#!/usr/bin/env python3
"""实践篇真实浏览器检查：边沿、示例、串行线路解码和窄屏。"""
import functools
import http.server
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright, expect
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'build'/'screenshots';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}'
errors=[]
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce')
  page.on('pageerror',lambda e:errors.append(str(e)))
  def go(n):
   page.goto(f'{url}/#lesson-{n}');expect(page.locator('#practice-circuit svg')).to_be_visible()
  def bit(k,v):
   b=page.locator(f'[data-practice-bit="{k}"]')
   if (b.get_attribute('aria-pressed')=='true')!=bool(v):b.click()
  def number(k,v):page.locator(f'[data-practice-number="{k}"]').fill(str(v))
  def out(k,v):expect(page.locator(f'[data-practice-output="{k}"]')).to_have_text(str(v))
  def tab(name):page.locator(f'[data-tab="{name}"]').click()
  go(11)
  bit('rst',0);number('d',42);bit('load',1)
  out('q',0);page.locator('#practice-clock').click();out('q',42)
  number('d',77);out('q',42);page.locator('#practice-clock').click();out('q',42)
  page.locator('#practice-step').click();out('q',77)
  number('d',256);expect(page.locator('[data-practice-number="d"]')).to_have_attribute('aria-invalid','true');out('q',77)
  number('d',-1);out('q',77);number('d',1.5);out('q',77)
  for n,key in [(18,'count'),(19,'baud_count')]:
   go(n);bit('rst',0);bit('push' if n==18 else 'start',1)
   page.locator('#practice-clock').click();out(key,1 if n==18 else 0)
   expect(page.locator('#practice-status')).to_contain_text('CLK=1')
   page.locator('#practice-clock').click();out(key,1 if n==18 else 0)
  checks={11:('q',255),12:('y',2),13:('result',1),14:('count',0),15:('press',1),16:('q',31),17:('rdata',123),18:('count',1),19:('busy',0),20:('queued',0)}
  go(11)
  metadata=page.evaluate('async()=>{const {lessons}=await import("/src/content.js");return lessons.filter(l=>l.id>=11).map(l=>({id:l.id,lab:l.lab,answers:l.quizzes.map(q=>q.correct)}));}')
  assert len(metadata)==10
  for l in metadata:
   n=l['id'];go(n)
   expect(page.locator('.practice-exercises>section')).to_have_count(3)
   for scenario in range(3):
    page.locator(f'[data-scenario="{scenario}"]').click()
    if n==19 and scenario==0:expect(page.locator('[data-decoded-byte="165"]')).to_have_count(1)
    if n==19 and scenario==1:expect(page.locator('[data-decoded-byte="0"]')).to_have_count(1)
    if n==20 and scenario==0:
     assert page.locator('[data-decoded-byte]').evaluate_all('(els)=>els.map(e=>Number(e.dataset.decodedByte))')==[0,165,255]
    if n==20 and scenario==1:
     expect(page.locator('[data-decoded-byte]')).to_have_count(0)
     assert 'FRAMING_ERROR' in page.locator('#wave-plot').inner_text()
    if n==20 and scenario==2:expect(page.locator('[data-decoded-byte="66"]')).to_have_count(1)
   out(*checks[n])
   if n==13:out('parallel_count',8)
   if n==18:out('accepted_pop',1) # after empty simultaneous input, current nonempty means next pop accepted
   if n==19:expect(page.locator('[data-decoded-byte]')).to_have_count(0)
   page.locator('[data-wave="xsim"]').click();expect(page.locator('#wave-badge')).to_have_text('XSIM 2022.2')
   for view in ('first','last','focus'):
    if page.locator('#wave-window-wrap').is_visible():page.locator('#wave-window').select_option(view)
    expect(page.locator('#wave-plot svg')).to_be_visible()
   if n>=19:
    page.locator('#wave-window').select_option('all');expect(page.locator('#wave-plot svg')).to_be_visible()
   page.screenshot(path=str(OUT/f'{n:02d}-practice-desktop.png'),full_page=True)
   if n!=12:page.locator('#practice-run').click()
   tab('concepts');page.wait_for_timeout(500)
   expect(page.locator('[data-practice-diagram] svg')).to_have_count(1)
   tab('code');expect(page.locator('.table-scroll .explain-table')).to_be_visible()
   with page.expect_download() as dl:page.locator(f'a[href="labs/{l["lab"]}/design.v"]').click()
   assert dl.value.suggested_filename=='design.v'
   tab('quiz')
   page.locator(f'[data-question="0"][data-answer="{(l["answers"][0]+1)%3}"]').click()
   expect(page.locator('#complete-lesson')).to_be_disabled()
   for i,a in enumerate(l['answers']):page.locator(f'[data-question="{i}"][data-answer="{a}"]').click()
   page.locator('#complete-lesson').click()
  page.reload();expect(page.locator('#progress-label')).to_have_text('10 / 20')
  # 手工送入实际RX帧，而非调用预置示例。
  go(20);bit('rst',0)
  page.locator('#serial-byte').fill('65');page.locator('#serial-send').click();page.locator('#serial-drain').click()
  expect(page.locator('[data-decoded-byte="65"]')).to_have_count(1)
  page.locator('#serial-bad').click();page.locator('#serial-drain').click()
  expect(page.locator('[data-decoded-byte]')).to_have_count(1)
  for n in range(11,21):
   for vp in ({'width':375,'height':812},{'width':812,'height':375}):
    page.set_viewport_size(vp);go(n)
    for panel in ('experiment','concepts','code','quiz'):
     tab(panel);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(n,panel,vp)
    tab('experiment')
    if vp['width']==375:page.screenshot(path=str(OUT/f'{n:02d}-practice-mobile.png'),full_page=True)
    page.locator('#menu-toggle').click();expect(page.locator('#lesson-nav a[href="#lesson-20"]')).to_be_visible();page.keyboard.press('Escape')
  assert not errors,errors
  browser.close()
  print('PASS practice browser: 10 lessons,30 scenarios,30 exercises,30 quizzes,clock edges,TX line decoding,downloads,mobile portrait/landscape,no page errors')
finally:server.shutdown()
