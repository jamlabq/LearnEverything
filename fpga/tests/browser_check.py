#!/usr/bin/env python3
"""用真实浏览器检查课程交互、实际 VCD、资源和手机排版。"""
import functools
import http.server
import json
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'build'/'screenshots'
OUT.mkdir(parents=True, exist_ok=True)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}'
errors=[]

def set_input(page,name,value):
    button=page.locator(f'[data-input="{name}"]')
    if (button.get_attribute('aria-pressed')=='true') != bool(value):
        button.click()

def tab(page,name):
    page.locator(f'[data-tab="{name}"]').click()

def navigate(page,lesson):
    page.goto(f'{url}/#lesson-{lesson}')
    expect(page.locator('#advanced-circuit svg' if lesson>=4 else '#circuit-diagram svg')).to_be_visible()

try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/opt/google/chrome/chrome',headless=True,args=['--no-sandbox'])
        context=browser.new_context(viewport={'width':1440,'height':1100},reduced_motion='reduce')
        page=context.new_page()
        page.on('pageerror',lambda error:errors.append(str(error)))
        navigate(page,1)
        expect(page.locator('#circuit-diagram svg')).to_have_attribute('aria-label', 'A=0，B=0。与=0，异或=0，非=1。三条支路并行工作')
        for a in (0,1):
            for b in (0,1):
                set_input(page,'a',a);set_input(page,'b',b)
                expect(page.locator('#circuit-diagram svg')).to_have_attribute('aria-label',f'A={a}，B={b}。与={a&b}，异或={a^b}，非={1-a}。三条支路并行工作')
        for _ in range(3):page.locator('#cpu-step').click()
        expect(page.locator('.cpu-row.done')).to_have_count(3)
        set_input(page,'a',0)
        expect(page.locator('.cpu-row.done')).to_have_count(0)
        page.locator('#sim-reset').click()
        page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(OUT/'01-parallel-desktop.png'),full_page=True)
        page.locator('[data-wave="xsim"]').click()
        expect(page.locator('#wave-badge')).to_have_text('XSIM 2022.2')
        assert 'ns' in page.locator('#wave-plot').inner_text()
        for lesson in (1,2,3):
            navigate(page,lesson)
            tab(page,'concepts')
            if lesson in (1,3):expect(page.locator('#lesson-panel svg')).to_have_count(1)
            else:
                page.locator('[data-bit="0"]').click();page.locator('[data-bit="2"]').click();page.locator('[data-bit="3"]').click()
                expect(page.locator('#binary-result')).to_have_text('11')
            tab(page,'code')
            expect(page.locator('#copy-design')).to_be_visible()
            assert 'module' in page.locator('.code-block').first.inner_text()
            with page.expect_download() as dl:
                page.locator(f'a[href="labs/{["01_parallel","02_gates","03_mux"][lesson-1]}/design.v"]').click()
            assert dl.value.suggested_filename=='design.v'
            tab(page,'quiz')
            page.locator('[data-question="0"][data-answer="2"]').click()
            expect(page.locator('#feedback-0')).to_contain_text('再想一想')
            correct={1:[1,1,0],2:[0,1,1],3:[0,1,1]}[lesson]
            for i,answer in enumerate(correct):page.locator(f'[data-question="{i}"][data-answer="{answer}"]').click()
            expect(page.locator('#complete-lesson')).to_be_enabled()
            page.locator('#complete-lesson').click()
        page.reload()
        expect(page.locator('#progress-label')).to_have_text('3 / 20')
        navigate(page,2)
        for kind in ('AND','OR','XOR','NOT'):
            page.locator(f'[data-gate="{kind}"]').click()
            for a in (0,1):
                for b in ((0,) if kind=='NOT' else (0,1)):
                    set_input(page,'a',a)
                    if kind!='NOT':set_input(page,'b',b)
                    value={'AND':a&b,'OR':a|b,'XOR':a^b,'NOT':1-a}[kind]
                    expect(page.locator('#truth-container tr.current td').last).to_have_text(str(value))
            if kind=='NOT':expect(page.locator('#input-group-b')).to_be_hidden()
        page.locator('[data-gate="XOR"]').click()
        set_input(page,'a',1);set_input(page,'b',0)
        page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(OUT/'02-gates-desktop.png'),full_page=True)
        navigate(page,3)
        for sel in (0,1):
            for a in (0,1):
                for b in (0,1):
                    for key,value in [('sel',sel),('a',a),('b',b)]:set_input(page,key,value)
                    want=b if sel else a
                    expect(page.locator('#circuit-diagram svg')).to_have_attribute('aria-label',f'选择器，A={a}，B={b}，SEL={sel}，选择{"B" if sel else "A"}，Y={want}')
        page.locator('[data-wave="xsim"]').click()
        page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(OUT/'03-mux-desktop.png'),full_page=True)
        # 后七课：验证真实交互行为，期望值不从网页模型读取。
        def number(key,value):
            page.locator(f'[data-advanced-number="{key}"]').evaluate('(el,v)=>{el.value=v;el.dispatchEvent(new Event("input",{bubbles:true}));}',value)
        def bit(key,value):
            button=page.locator(f'[data-advanced-bit="{key}"]')
            if (button.get_attribute('aria-pressed')=='true')!=bool(value):button.click()
        def read(key,value):expect(page.locator(f'[data-signal="{key}"]')).to_have_text(str(value))
        def step(count=1):
            for _ in range(count):page.locator('#clock-step').click()
        navigate(page,4)
        number('a',15);number('b',1)
        read('sum',16);read('low_sum',0);read('carry',1)
        assert 'SUM [4:0]' in page.locator('#wave-plot').inner_text()
        navigate(page,5)
        bit('rst',0);number('d',11);read('q',0)
        page.locator('#clock-toggle').click();read('q',11)
        number('d',3);read('q',11)
        page.locator('#clock-toggle').click();read('q',11)
        bit('en',0);step();read('q',11)
        bit('rst',1);read('q',11);step();read('q',0)
        navigate(page,6)
        bit('rst',0);step(16);read('count',0);read('wrap',1)
        bit('en',0);step();read('count',0);read('wrap',0)
        navigate(page,7)
        bit('rst',0);number('a',1);number('b',2);step()
        read('stage_sum',3);read('y',0);read('valid_out',0)
        number('a',4);number('b',5);step()
        read('stage_sum',9);read('y',6);read('valid_out',1)
        bit('valid_in',0);step();read('y',18);read('valid_out',1)
        step();read('valid_out',0)
        navigate(page,8)
        bit('rst',0);step();read('state',1);read('green',1)
        bit('tick',0);step();read('state',1)
        bit('tick',1);step();read('state',2);step();read('state',0)
        navigate(page,9)
        bit('rst',0);number('level',0);read('duty',0);read('pwm',0)
        number('level',16);read('duty',16);read('pwm',1)
        bit('rst',1);read('pwm',0);step()
        bit('rst',0);bit('breath_en',1);read('duty',0)
        page.locator('#frame-step').click();read('phase',0);read('duty',1)
        page.locator('#frame-step').click();read('duty',2)
        navigate(page,10)
        bit('rst',0);step(3);read('count',3);read('led',0)
        step();read('count',0);read('led',1)
        number('half',8);step(5);read('count',5)
        assert 'COUNT [2:0]' in page.locator('#wave-plot').inner_text()
        number('half',1);step();read('count',0);read('led',1)
        expect(page.locator('#frequency-result')).to_contain_text('4 Hz')
        page.locator('#frequency-select').select_option('50000000')
        expect(page.locator('#frequency-result')).to_contain_text('25,000,000 Hz')
        page.locator('[data-workflow="1"]').click()
        expect(page.locator('#workflow-explanation')).to_contain_text('I/O 电压')
        page.locator('[data-workflow="4"]').click()
        expect(page.locator('#workflow-explanation')).to_contain_text('Hardware Manager')
        advanced=page.evaluate('async()=>{const {lessons}=await import("/src/content.js");return lessons.filter(l=>l.id>=4&&l.id<=10).map(l=>({id:l.id,lab:l.lab,answers:l.quizzes.map(q=>q.correct)}));}')
        for lesson in advanced:
            n=lesson['id'];navigate(page,n)
            # 播放后切面板，确认没有旧定时器访问新DOM。
            if n>=5:bit('rst',0)
            page.locator('#advanced-run').click()
            page.wait_for_timeout(300 if n==9 else 750)
            tab(page,'concepts');page.wait_for_timeout(750)
            expect(page.locator('#lesson-panel svg')).to_have_count(1)
            tab(page,'code')
            expect(page.locator('#copy-design')).to_be_visible()
            assert 'module' in page.locator('.code-block').first.inner_text()
            with page.expect_download() as dl:page.locator(f'a[href="labs/{lesson["lab"]}/design.v"]').click()
            assert dl.value.suggested_filename=='design.v'
            tab(page,'quiz')
            wrong=(lesson['answers'][0]+1)%3
            page.locator(f'[data-question="0"][data-answer="{wrong}"]').click()
            expect(page.locator('#feedback-0')).to_contain_text('再想一想')
            for i,answer in enumerate(lesson['answers']):page.locator(f'[data-question="{i}"][data-answer="{answer}"]').click()
            expect(page.locator('#complete-lesson')).to_be_enabled();page.locator('#complete-lesson').click()
            tab(page,'experiment');page.locator('[data-wave="xsim"]').click()
            expect(page.locator('#wave-badge')).to_have_text('XSIM 2022.2')
            assert 'ns' in page.locator('#wave-plot').inner_text()
            if page.locator('#wave-window-wrap').is_visible():
                for view in ('first','last','all','focus'):
                    page.locator('#wave-window').select_option(view)
                    expect(page.locator('#wave-plot svg')).to_be_visible()
            page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(OUT/f'{n:02d}-desktop.png'),full_page=True)
        page.reload();expect(page.locator('#progress-label')).to_have_text('10 / 20')
        # 不只检查图片：读取真实 VCD 导出，在每个测试时间段验证输出。
        checks=page.evaluate('''async () => {
            const {labData}=await import('/src/lab-data.js');
            const errors=[];let count=0;
            for(const [lab,{wave}] of Object.entries(labData).slice(0,3)) {
                const at=(name,t)=>Number(wave.signals[name].filter(([time])=>time<=t).at(-1)[1]);
                for(let t=5;t<wave.duration;t+=10) {
                    const a=at('a',t),b=at('b',t);
                    const expected=lab==='03_mux'?{y:at('sel',t)?b:a}:lab==='02_gates'?{y_and:a&b,y_or:a|b,y_xor:a^b,y_not:1-a}:{y_and:a&b,y_xor:a^b,y_not:1-a};
                    for(const [signal,value] of Object.entries(expected)) {
                        count++;if(at(signal,t)!==value)errors.push({lab,t,signal});
                    }
                }
            }
            return {count,errors};
        }''')
        assert checks['count']==36,checks
        assert not checks['errors'],checks
        navigate(page,3)
        # 自动遍历在切课后必须停止；切课不遗留计时器异常。
        page.locator('#auto-run').click()
        page.wait_for_timeout(900)
        page.locator('a[href="#lesson-1"]').first.click()
        page.wait_for_timeout(950)
        expect(page.locator('#crumb')).to_have_text('认识 FPGA')
        with page.expect_download() as dl:page.locator('.download-link').click()
        assert dl.value.suggested_filename=='fpga-labs.zip'
        for lesson in range(1,11):
            for viewport in ({'width':375,'height':812},{'width':812,'height':375}):
                page.set_viewport_size(viewport)
                navigate(page,lesson)
                for name in ('experiment','concepts','code','quiz'):
                    tab(page,name)
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),(lesson,name,viewport)
                tab(page,'experiment')
                if viewport['width']==375:page.evaluate('window.scrollTo(0,0)');page.screenshot(path=str(OUT/f'{lesson:02d}-mobile.png'),full_page=True)
                page.locator('#menu-toggle').click()
                expect(page.locator('#sidebar')).to_have_class('sidebar open')
                page.keyboard.press('Escape')
                expect(page.locator('#menu-toggle')).to_have_attribute('aria-expanded','false')
        # 检查所有本地链接不会 404（使用 request，不会触发下载窗口）。
        page.set_viewport_size({'width':1440,'height':1000})
        for lesson in range(1,11):
            navigate(page,lesson);tab(page,'code')
            for href in page.locator('#lesson-panel a[href]').evaluate_all('(els)=>els.map(e=>e.getAttribute("href"))'):
                assert context.request.get(f'{url}/{href}').ok,href
        assert not errors,errors
        browser.close()
        print(f'PASS browser: 十课关键交互、30题、下载、进度、手机布局与 {checks["count"]} 个真实波形输出检查。')
        print('截图:',OUT)
finally:
    server.shutdown()
