"""Optional real-browser checks: pip install playwright; use local Chrome/Chromium.

Start a server for _site on port 8766 first. External traffic is blocked so these
checks cover the copied content, search and MathJax without upstream access.
"""
import json
import os
from pathlib import Path
from urllib.parse import urlsplit, unquote

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
BASE = os.environ.get('WIKI_TEST_URL', 'http://127.0.0.1:8766').rstrip('/')
OUT = ROOT / 'build' / 'wiki-browser'
OUT.mkdir(parents=True, exist_ok=True)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROME_BIN', '/opt/google/chrome/chrome'), headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 1000})
        remote = []
        failures = []
        errors = []
        def route(request):
            if urlsplit(request.request.url).hostname != urlsplit(BASE).hostname:
                remote.append(request.request.url)
                request.abort()
            else: request.continue_()
        context.route('**/*', route)
        page = context.new_page()
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('response', lambda r: failures.append(f'{r.status} {r.url}') if r.status >= 400 else None)
        def visit(path):
            response = page.goto(BASE + path, wait_until='networkidle')
            assert response.status == 200, (path, response.status)
            page.wait_for_function('!window.MathJax || (MathJax.startup && MathJax.startup.promise)')
            page.evaluate('async () => { if (window.MathJax?.startup?.promise) await MathJax.startup.promise; }')
            assert page.locator('article').inner_text().strip(), path
            broken = page.locator('article img').evaluate_all('(xs) => xs.filter(x => !x.complete || x.naturalWidth === 0).map(x => x.src)')
            assert not broken, broken
            assert page.locator('a.mirror-home').evaluate('(a) => a.href') == BASE + '/', path
        visit('/oi-wiki/ds/seg/')
        assert page.locator('mjx-container').count() > 50, 'Segment tree formulas not rendered'
        assert page.locator('article pre code').count() > 5, 'Snippet code not rendered'
        page.screenshot(path=str(OUT / 'oi-segment-tree-desktop.png'))
        page.locator('[data-md-component="search-query"]').fill('线段树')
        page.locator('[data-md-component="search-query"]').dispatch_event('keyup')
        page.wait_for_selector('.md-search-result__link', timeout=20000)
        results = page.locator('.md-search-result__link')
        assert any('/oi-wiki/' in href for href in results.evaluate_all('(xs) => xs.map(x=>x.href)'))
        search_text = page.locator('.md-search-result').inner_text()
        assert '线段树' in search_text
        page.keyboard.press('Escape')
        visit('/oi-wiki/intro/faq/')
        visit('/cs-self-learning/计算机系统基础/CSAPP/')
        assert 'CSAPP' in page.locator('article').inner_text()
        page.screenshot(path=str(OUT / 'cs-course-desktop.png'))
        visit('/cs-self-learning/en/计算机系统基础/CSAPP/')
        assert '/docs/' in page.locator('.mirror-credit a').last.get_attribute('href')
        assert 'CSAPP.en.md' in page.locator('.mirror-credit a').last.get_attribute('href')
        assert unquote(page.locator('.md-select__link[hreflang="zh"]').evaluate('(a) => a.pathname')).endswith('/cs-self-learning/计算机系统基础/CSAPP/')
        visit('/cs-self-learning/en/必学工具/workflow/')
        assert page.locator('article img').count() == 15
        visit('/cs-self-learning/数学基础/MITLA/')
        visit('/cs-self-learning/')
        page.locator('[data-md-component="search-query"]').fill('CSAPP')
        page.locator('[data-md-component="search-query"]').dispatch_event('keyup')
        page.wait_for_selector('.md-search-result__link', timeout=20000)
        assert 'CSAPP' in page.locator('.md-search-result').inner_text()
        page.keyboard.press('Escape')
        page.set_viewport_size({'width': 390, 'height': 844})
        visit('/oi-wiki/ds/seg/')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Mobile horizontal overflow'
        page.locator('label[for="__drawer"].md-header__button').click()
        assert page.locator('#__drawer').is_checked(), 'Mobile navigation failed'
        page.locator('label[for="__drawer"].md-overlay').click(position={'x':380,'y':300}, force=True)
        assert not page.locator('#__drawer').is_checked()
        page.screenshot(path=str(OUT / 'oi-segment-tree-mobile.png'))
        visit('/cs-self-learning/')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Mobile CS overflow'
        page.screenshot(path=str(OUT / 'cs-home-mobile.png'))
        browser.close()
        report={'external_requests': sorted(set(remote)), 'http_failures': failures, 'page_errors': errors, 'screenshots': str(OUT)}
        (OUT / 'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
        print(json.dumps(report, ensure_ascii=False, indent=2))
        assert not remote and not failures and not errors, report
        print('PASS: local text, images, formulas, search, English pages and mobile navigation')


if __name__ == '__main__': main()
