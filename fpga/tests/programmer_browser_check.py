#!/usr/bin/env python3
"""Check the programmer route, preserved progress, and the two added workshops."""
import functools
import http.server
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'build' / 'screenshots'
OUT.mkdir(parents=True, exist_ok=True)

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}'
errors = []
route = [1, 2, 3, 4, 5, 11, 6, 14, 13, 7, 12, 15, 8, 9, 16, 17, 18, 19, 20, 10]
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/opt/google/chrome/chrome', headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(url)
        expect(page.locator('h1')).to_contain_text('会写程序')
        expect(page.locator('.learning-roadmap > article')).to_have_count(4)
        links = page.locator('#lesson-nav a[href^="#lesson-"]').evaluate_all('(els)=>els.map(el=>Number(el.hash.slice(8)))')
        assert links == route, links
        page.screenshot(path=str(OUT / 'start-desktop.png'), full_page=True)
        # Previously saved records still refer to stable lesson IDs, even after reordering.
        page.evaluate('localStorage.setItem("fpga-visible-progress",JSON.stringify({"5":true,"11":true,"20":true}))')
        page.reload()
        expect(page.locator('#progress-label')).to_have_text('3 / 20')
        for n in [5, 11, 20]:
            expect(page.locator(f'#lesson-nav a[href="#lesson-{n}"] .check')).to_have_text('✓')
        for i, n in enumerate(route):
            page.goto(f'{url}/#lesson-{n}')
            expect(page.locator('.learning-focus')).to_be_visible()
            expect(page.locator('.guided-practice > ol > li')).to_have_count(4)
            expect(page.locator('.eyebrow')).to_contain_text(f'路线 {i+1}/20')
            expected_prev = f'#lesson-{route[i-1]}' if i else '#start'
            expected_next = f'#lesson-{route[i+1]}' if i < 19 else '#start'
            expect(page.locator('.lesson-footer a').first).to_have_attribute('href', expected_prev)
            expect(page.locator('.lesson-footer a').last).to_have_attribute('href', expected_next)
        page.goto(f'{url}/#lesson-9')
        expect(page.locator('.learning-focus')).to_contain_text('phase<duty')
        page.goto(f'{url}/#lesson-5')
        expect(page.locator('#software-values')).to_contain_text('a=1，b=2')
        page.locator('#software-step').click()
        expect(page.locator('#software-values')).to_contain_text('a=2，b=2；已执行 1/2 条')
        expect(page.locator('#hardware-values')).to_contain_text('a=1，b=2')
        page.locator('#software-step').click()
        expect(page.locator('#software-step')).to_be_disabled()
        page.locator('#hardware-step').click()
        expect(page.locator('#hardware-values')).to_contain_text('a=2，b=1')
        page.locator('#assignment-a').fill('3')
        page.locator('#assignment-b').fill('9')
        page.locator('#assignment-reset').click()
        page.locator('#hardware-step').click()
        expect(page.locator('#hardware-values')).to_contain_text('a=9，b=3')
        page.locator('#assignment-a').fill('16')
        page.locator('#assignment-reset').click()
        expect(page.locator('#assignment-error')).to_contain_text('0…15')
        expect(page.locator('#hardware-values')).to_contain_text('a=9，b=3')
        page.locator('#assignment-a').fill('')
        page.locator('#assignment-reset').click()
        expect(page.locator('#assignment-error')).to_contain_text('0…15')
        page.locator('#assignment-a').fill('3')
        page.locator('#assignment-reset').click()
        expect(page.locator('#assignment-error')).to_be_empty()
        page.locator('#assignment-demo').screenshot(path=str(OUT / 'assignment-desktop.png'))
        for lesson, name in [(5, 'old_values'), (15, 'button_counter')]:
            page.goto(f'{url}/#lesson-{lesson}')
            page.locator('.workshop-files > summary').click()
            page.locator(f'[data-workshop-wave="{name}"]').click()
            expect(page.locator(f'[data-workshop-actual="{name}"] svg')).to_be_visible()
            assert 'ns' in page.locator(f'[data-workshop-actual="{name}"]').inner_text()
            for filename in ['README.md', 'starter.v', 'design.v', 'tb.sv']:
                href = f'workshops/{name}/{filename}'
                assert page.request.get(f'{url}/{href}').ok, href
            with page.expect_download() as download:
                page.locator(f'a[href="workshops/{name}/starter.v"]').click()
            assert download.value.suggested_filename == 'starter.v'
        def counts(level, edge, clean):
            for key, value in [('level', level), ('edge', edge), ('clean', clean)]:
                expect(page.locator(f'#{key}-count')).to_have_text(str(value))
        for name, want in [('hold', (12, 1, 1)), ('bounce', (14, 3, 1)), ('short', (2, 1, 0))]:
            page.locator(f'[data-button-scenario="{name}"]').click()
            counts(*want)
        page.locator('#button-restart').click()
        page.locator('#button-raw').click()
        counts(0, 0, 0)  # A raw input change cannot itself update any register.
        page.locator('#button-eight').click()
        counts(6, 1, 1)
        page.locator('#button-eight').click()
        counts(14, 1, 1)
        page.locator('#button-reset').click()
        counts(0, 0, 0)
        expect(page.locator('#button-raw')).to_have_attribute('aria-pressed', 'true')
        page.locator('#button-eight').click()
        counts(6, 1, 1)
        page.locator('[data-button-scenario="bounce"]').click()
        page.locator('.workshop-files > summary').click()
        page.locator('#button-project').screenshot(path=str(OUT / 'button-desktop.png'))
        for width, height in [(375, 812), (812, 375)]:
            page.set_viewport_size({'width': width, 'height': height})
            for lesson in ['start', 'lesson-5', 'lesson-15', 'lesson-20']:
                page.goto(f'{url}/#{lesson}')
                if lesson == 'start':
                    expect(page.locator('.learning-roadmap')).to_be_visible()
                    page.screenshot(path=str(OUT / f'start-{width}.png'), full_page=True)
                else:
                    # Include expanded optional content and real workshop waveforms.
                    page.locator('.programmer-demo details').evaluate_all('(els)=>els.forEach(el=>el.open=true)')
                    if page.locator('[data-workshop-wave]').count():
                        page.locator('[data-workshop-wave]').click()
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (width, lesson, 'expanded')
                    if lesson == 'lesson-5' and width == 375:
                        page.locator('#assignment-demo').screenshot(path=str(OUT / 'assignment-mobile.png'))
                    for tab in ['concepts', 'code', 'quiz']:
                        page.locator(f'[data-tab="{tab}"]').click()
                        page.locator('details').evaluate_all('(els)=>els.forEach(el=>el.open=true)')
                        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (width, lesson, tab)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (width, lesson)
        page.goto(f'{url}/#lesson-999')
        expect(page.locator('h1')).to_contain_text('会写程序')
        assert not errors, errors
        browser.close()
        print('PASS programmer browser: route, stable links/progress, assignment steps, three button scenarios, reset, XSim waves, downloads, expanded mobile panels.')
finally:
    server.shutdown()
