"""Check the resource discovery journey on the built Pages site."""
import functools
import http.server
import json
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'wlan/build'
OUT.mkdir(exist_ok=True)


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def translate_path(self, path):
        if path.startswith('/LearnEverything/'):
            path = path[len('/LearnEverything'):]
        return super().translate_path(path)


server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / '_site')))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}/LearnEverything/wlan/'
errors = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/opt/google/chrome/chrome', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        page.on('pageerror', lambda error: errors.append(str(error)))
        response = page.goto(url)
        assert response.status == 200, 'WLAN learning page must be published'
        expect(page.locator('h1')).to_contain_text('Wi-Fi')
        cards = page.locator('.resource-card')
        assert cards.count() >= 30
        total = cards.count()
        expect(page.locator('.route-step')).to_have_count(5)
        page.screenshot(path=str(OUT / 'desktop.png'))
        page.locator('[data-type="video"]').click()
        videos = cards.count()
        assert videos >= 18
        page.locator('[data-type="article"]').click()
        assert cards.count() >= 15
        assert cards.count() + videos == total
        page.locator('#search').fill('QAM')
        assert cards.count() > 0
        assert all('QAM' in t for t in cards.all_text_contents())
        page.locator('#language').select_option('zh')
        assert cards.count() > 0
        page.locator('#search').fill('no-such-wlan-resource-xyz')
        expect(page.locator('#empty-state')).to_be_visible()
        page.locator('#reset-filters').click()
        expect(cards).to_have_count(total)
        page.locator('#topic').select_option('linux')
        assert 0 < cards.count() < total
        page.locator('#topic').select_option('all')

        for step in range(6):
            page.locator(f'[data-step="{step}"]').click()
            expect(page.locator(f'[data-step="{step}"]')).to_have_attribute('aria-pressed', 'true')
            expect(page.locator('#journey-detail h3')).not_to_be_empty()
        page.locator('#show-core').click()
        assert 0 < cards.count() < total
        expect(page.locator('#collection')).to_have_value('core')
        assert page.locator('.resource-card .core-badge').count() == cards.count()
        page.locator('#clear-all').click()

        # A resource link must clear conflicting filters and expose its reading guide.
        page.locator('[data-type="article"]').click()
        page.locator('a[href="#resource-v-openwifi"]').first.click()
        card = page.locator('#resource-v-openwifi')
        expect(card).to_be_visible()
        expect(card.locator('details')).to_have_attribute('open', '')
        card.locator('[data-action="save"]').click()
        card.locator('[data-action="done"]').click()
        page.reload()
        expect(card.locator('[data-action="save"]')).to_have_attribute('aria-pressed', 'true')
        expect(card.locator('[data-action="done"]')).to_have_attribute('aria-pressed', 'true')
        expect(page.locator('#done-count')).to_have_text('1')
        page.locator('#collection').select_option('saved')
        expect(cards).to_have_count(1)
        card.locator('[data-action="save"]').click()
        expect(page.locator('#empty-state')).to_be_visible()
        page.locator('#reset-filters').click()

        links = page.locator('.resource-links a').evaluate_all('(els) => els.map(a => ({href:a.href,rel:a.rel,target:a.target}))')
        assert all(l['href'].startswith('https://') and 'noopener' in l['rel'] and l['target'] == '_blank' for l in links)
        ids = page.locator('[id]').evaluate_all('(els) => els.map(e => e.id)')
        assert len(ids) == len(set(ids)), 'Duplicate element IDs'
        for href in page.locator('a[href^="#resource-"]').evaluate_all('(els) => [...new Set(els.map(e => e.getAttribute("href")))]'):
            assert page.locator(href).count() == 1, href
        card.locator('details').evaluate('(element) => element.open = false')
        page.locator('#resource-v-openwifi summary').focus()
        page.keyboard.press('Enter')
        expect(card.locator('details')).to_have_attribute('open', '')
        page.keyboard.press('Space')
        expect(card.locator('details')).not_to_have_attribute('open', '')

        for width, height in [(375, 812), (320, 700), (768, 1024), (844, 390)]:
            page.set_viewport_size({'width': width, 'height': height})
            page.goto(url)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), width
            page.locator('#resource-v-openwifi details').evaluate('(e) => e.open = true')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, 'expanded')
            if width == 375:
                page.screenshot(path=str(OUT / 'mobile.png'))
                page.locator('#library').evaluate('(element) => element.scrollIntoView({block:"start"})')
                page.screenshot(path=str(OUT / 'mobile-library.png'))

        for invalid in ['{broken', 'null', '[]', '{"done":"bad","saved":null}']:
            page.evaluate('(value) => localStorage.setItem("wlan-guide-v1", value)', invalid)
            page.reload()
            expect(cards).to_have_count(total)
            expect(page.locator('#done-count')).to_have_text('0')
        blocked = browser.new_context()
        blocked.add_init_script('Object.defineProperty(window, "localStorage", {get(){throw new Error("blocked")}})')
        fallback = blocked.new_page()
        fallback.goto(url)
        expect(fallback.locator('.resource-card')).to_have_count(total)
        fallback.locator('#resource-v-openwifi [data-action="save"]').click()
        expect(fallback.locator('#storage-notice')).to_be_visible()
        assert not errors, errors
        print(json.dumps({'resources': total, 'videos': videos, 'articles': total-videos, 'browser_errors': errors, 'result': 'PASS'}))
        browser.close()
finally:
    server.shutdown()
