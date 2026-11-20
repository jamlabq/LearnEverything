#!/usr/bin/env python3
"""Exercise the learning journey in Chrome, including Pages subdirectory hosting."""
import functools
import http.server
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'english' / 'build' / 'screenshots'
OUT.mkdir(parents=True, exist_ok=True)


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def translate_path(self, path):
        if path.startswith('/LearnEverything/'):
            path = path[len('/LearnEverything'):]
        return super().translate_path(path)


server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/LearnEverything'
url = base + '/english/'
key = 'learneverything-english-v2'
errors = []

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/opt/google/chrome/chrome', headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1440, 'height': 1050}, reduced_motion='reduce')
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(url)
        expect(page.locator('.lesson-card')).to_have_count(45)
        expect(page.locator('.stage-card')).to_have_count(4)
        expect(page.locator('.extra-resource')).to_have_count(4)
        expect(page.locator('#completed-count')).to_have_text('0')
        page.screenshot(path=str(OUT / 'desktop.png'), full_page=True)
        page.screenshot(path=str(OUT / 'desktop-fold.png'))

        for stage, count in [('warmup', 10), ('bridge', 5), ('deep', 25), ('screen', 5)]:
            page.locator(f'#stage-filters [data-stage="{stage}"]').click()
            expect(page.locator('.lesson-card')).to_have_count(count)
            expect(page.locator(f'#stage-filters [data-stage="{stage}"]')).to_have_attribute('aria-pressed', 'true')
        page.locator('#stage-filters [data-stage="all"]').click()
        page.locator('#search').fill('Friends')
        expect(page.locator('.lesson-card')).to_have_count(3)
        page.locator('#search').fill('环境科学')
        assert page.locator('.lesson-card').count() >= 4
        page.locator('#search').fill('no-such-material-123')
        expect(page.locator('#empty-state')).to_be_visible()
        page.locator('#reset-filters').click()
        expect(page.locator('.lesson-card')).to_have_count(45)

        # Topic, platform and transcript filters compose with the stage selection.
        page.locator('#stage-filters [data-stage="deep"]').click()
        page.locator('#platform-filter').select_option('bilibili')
        expect(page.locator('.lesson-card')).to_have_count(6)
        page.locator('#topic-filter').select_option('环境科学')
        expect(page.locator('.lesson-card')).to_have_count(1)
        page.locator('#transcript-filter').select_option('auto')
        expect(page.locator('#empty-state')).to_be_visible()
        page.locator('#reset-filters').click()
        expect(page.locator('#topic-filter')).to_have_value('all')
        expect(page.locator('#platform-filter')).to_have_value('all')
        expect(page.locator('#transcript-filter')).to_have_value('all')
        page.locator('#transcript-filter').select_option('auto')
        expect(page.locator('.lesson-card')).to_have_count(8)
        page.locator('#transcript-filter').select_option('all')

        # Each deep link exposes a concrete task, source status and five steps.
        for lesson_id in range(1, 46):
            page.goto(f'{url}#lesson-{lesson_id}')
            expect(page.locator('#lesson-dialog')).to_be_visible()
            expect(page.locator('input[data-step]')).to_have_count(5)
            expect(page.locator('.questions li')).to_have_count(3)
            expect(page.locator('.output-task > p')).not_to_be_empty()
            expect(page.locator('.resource-caveat')).not_to_be_empty()
            links = page.locator('.resource-links a').evaluate_all('(els) => els.map(el => ({href:el.href, rel:el.rel, target:el.target}))')
            assert all(link['href'].startswith('https://') and 'noopener' in link['rel'] and link['target'] == '_blank' for link in links)
            if lesson_id == 1:
                expect(page.locator('#previous-lesson')).to_be_disabled()
            if lesson_id == 45:
                expect(page.locator('#next-lesson')).to_be_disabled()

        # Notes must stay plain text, survive refresh and not mark a unit complete.
        page.goto(f'{url}#lesson-1')
        note = 'My role: explain delays. <img src=x onerror=alert(1)> & “review”'
        page.locator('#lesson-notes').fill(note)
        page.locator('input[data-step="0"]').check()
        page.locator('input[data-step="1"]').check()
        page.reload()
        expect(page.locator('#lesson-notes')).to_have_value(note)
        expect(page.locator('input[data-step="0"]')).to_be_checked()
        expect(page.locator('#completed-count')).to_have_text('0')
        expect(page.locator('#dialog-progress')).to_have_text('2 / 5 步已练习')
        for step in range(2, 5):
            page.locator(f'input[data-step="{step}"]').check()
        expect(page.locator('#completed-count')).to_have_text('1')
        expect(page.locator('#dialog-progress')).to_have_text('五步完成 ✓')
        page.screenshot(path=str(OUT / 'lesson-desktop.png'))
        page.locator('input[data-step="4"]').uncheck()
        expect(page.locator('#completed-count')).to_have_text('0')
        page.locator('input[data-step="4"]').check()
        page.locator('#dialog-close').click()
        expect(page.locator('#lesson-dialog')).not_to_be_visible()
        page.locator('#status-filter').select_option('done')
        expect(page.locator('.lesson-card')).to_have_count(1)
        page.locator('#status-filter').select_option('new')
        expect(page.locator('.lesson-card')).to_have_count(44)
        page.locator('#status-filter').select_option('started')
        expect(page.locator('#empty-state')).to_be_visible()
        page.locator('#reset-filters').click()
        page.locator('#continue-learning').click()
        expect(page.locator('#dialog-title')).to_have_text('Why are we all so stressed? ⏲️ 6 Minute English')
        page.locator('#next-lesson').click()
        expect(page.locator('#dialog-title')).to_have_text('Food and mood ⏲️ 6 Minute English')
        page.locator('#previous-lesson').click()
        expect(page.locator('#dialog-title')).to_have_text('Why are we all so stressed? ⏲️ 6 Minute English')
        page.keyboard.press('Escape')
        expect(page.locator('#lesson-dialog')).not_to_be_visible()
        expect(page.locator('#continue-learning')).to_be_focused()

        # Export contains actual local notes and checked tasks, without external calls.
        with page.expect_download() as download:
            page.locator('#export-progress').click()
        exported = Path(download.value.path()).read_text(encoding='utf-8-sig')
        assert note in exported and '- [x] 迁移到交流' in exported and '45. Friends' in exported

        for minutes in [20, 60, 40]:
            page.locator(f'[data-minutes="{minutes}"]').click()
            values = page.locator('.schedule-row span:last-child').all_text_contents()
            assert sum(int(value.split()[0]) for value in values) == minutes

        # Keyboard-only access and focus restoration from a lesson link.
        lesson_link = page.locator('[data-lesson-card="3"] .card-title a')
        lesson_link.focus()
        page.keyboard.press('Enter')
        expect(page.locator('#lesson-dialog')).to_be_visible()
        page.keyboard.press('Tab')
        assert page.evaluate('document.activeElement.closest("dialog") !== null')
        page.keyboard.press('Escape')
        expect(lesson_link).to_be_focused()
        page.goto(f'{url}#lesson-999')
        expect(page.locator('#lesson-dialog')).not_to_be_visible()
        expect(page.locator('#toast')).to_contain_text('没有找到')

        # Empty, malformed and unsupported saved state recover safely.
        page.evaluate('key => Object.keys(localStorage).filter(k => k.startsWith(key)).forEach(k => localStorage.removeItem(k))', key)
        for invalid in ['{broken', 'null', '[]', '{"version":99,"lessons":{}}']:
            page.evaluate('([key, value]) => localStorage.setItem(key,value)', [key, invalid])
            page.reload()
            expect(page.locator('.lesson-card')).to_have_count(45)
            expect(page.locator('#completed-count')).to_have_text('0')

        # All complete sends the learner to transfer checks rather than a false lesson.
        page.evaluate('key => localStorage.setItem(key,JSON.stringify({version:1,lessons:Object.fromEntries(Array.from({length:45},(_,i)=>[i+1,{steps:[true,true,true,true,true],notes:""}]))}))', key)
        page.reload()
        expect(page.locator('#completed-count')).to_have_text('45')
        page.locator('#hero-start').click()
        assert page.url.endswith('#checkpoints')
        page.evaluate('key => Object.keys(localStorage).filter(k => k.startsWith(key)).forEach(k => localStorage.removeItem(k))', key)
        page.goto(url)

        # Expanded sections, cards, and dialogs must fit narrow and landscape screens.
        for width, height in [(390, 844), (320, 720), (768, 1024), (844, 390)]:
            page.set_viewport_size({'width': width, 'height': height})
            page.goto(url)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, 'main')
            if width == 390:
                page.screenshot(path=str(OUT / 'mobile-fold.png'))
                page.screenshot(path=str(OUT / 'mobile.png'), full_page=True)
            page.locator('details').evaluate_all('(els) => els.forEach(el=>el.open=true)')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, 'expanded')
            page.goto(f'{url}#lesson-21')
            expect(page.locator('#lesson-dialog')).to_be_visible()
            assert page.locator('#lesson-dialog').evaluate('(el) => el.scrollWidth <= el.clientWidth + 1'), (width, 'dialog')
            page.locator('#dialog-close').click()
        page.set_viewport_size({'width': 1440, 'height': 1050})

        # A blocked storage API still permits studying and exporting, with clear feedback.
        isolated = browser.new_context()
        isolated.add_init_script('Object.defineProperty(window,"localStorage",{get(){throw new DOMException("Blocked","SecurityError")}})')
        blocked = isolated.new_page()
        blocked.on('pageerror', lambda error: errors.append(str(error)))
        blocked.goto(url + '#lesson-1')
        expect(blocked.locator('.lesson-card')).to_have_count(45)
        expect(blocked.locator('#note-save-status')).to_contain_text('暂未保存')
        blocked.locator('input[data-step="0"]').check()
        expect(blocked.locator('#dialog-progress')).to_have_text('1 / 5 步已练习')
        blocked.locator('#dialog-close').click()
        expect(blocked.locator('#storage-warning')).to_be_visible()
        isolated.close()

        # A small checkbox write cannot hide a failed large note write.
        quota = browser.new_context()
        quota.add_init_script('''
            const original = Storage.prototype.setItem;
            Storage.prototype.setItem = function(key, value) {
                if (key.endsWith(':notes')) throw new DOMException('Full', 'QuotaExceededError');
                return original.call(this, key, value);
            };
        ''')
        quota_page = quota.new_page()
        quota_page.goto(url + '#lesson-1')
        quota_page.locator('#lesson-notes').fill('Unsaved note must remain exportable')
        expect(quota_page.locator('#note-save-status')).to_contain_text('暂未保存')
        quota_page.locator('input[data-step="0"]').check()
        expect(quota_page.locator('#note-save-status')).to_contain_text('暂未保存')
        quota_page.locator('#dialog-close').click()
        expect(quota_page.locator('#storage-warning')).to_be_visible()
        peer = quota.new_page()
        peer.goto(url + '#lesson-2')
        peer.locator('input[data-step="0"]').check()
        quota_page.locator('[data-lesson-card="1"] .card-title a').click()
        expect(quota_page.locator('#lesson-notes')).to_have_value('Unsaved note must remain exportable')
        quota_page.locator('#dialog-close').click()
        with quota_page.expect_download() as quota_download:
            quota_page.locator('#export-progress').click()
        assert 'Unsaved note must remain exportable' in Path(quota_download.value.path()).read_text(encoding='utf-8-sig')
        quota.close()

        # Independent tabs must never replace the other course's live note text.
        multi = browser.new_context()
        first = multi.new_page()
        second = multi.new_page()
        first.goto(url + '#lesson-1')
        second.goto(url + '#lesson-2')
        for tab, letter in [(first, 'A'), (second, 'B')]:
            tab.evaluate('''letter => {
                window.typingFinished = false;
                let count = 0;
                const timer = setInterval(() => {
                    const input = document.querySelector('#lesson-notes');
                    input.value += letter;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    if (++count === 100) {
                        clearInterval(timer);
                        window.typingFinished = true;
                    }
                }, 10);
            }''', letter)
        first.wait_for_function('window.typingFinished === true')
        second.wait_for_function('window.typingFinished === true')
        expect(first.locator('#lesson-notes')).to_have_value('A' * 100)
        expect(second.locator('#lesson-notes')).to_have_value('B' * 100)
        first.reload()
        second.reload()
        expect(first.locator('#lesson-notes')).to_have_value('A' * 100)
        expect(second.locator('#lesson-notes')).to_have_value('B' * 100)
        multi.close()

        # v1 records are retained and exportable with the original lesson titles.
        legacy_context = browser.new_context()
        legacy = legacy_context.new_page()
        legacy.goto(url)
        legacy.evaluate("localStorage.setItem('learneverything-english-v1:1:notes', JSON.stringify('Old role description')); localStorage.setItem('learneverything-english-v1:1:step-0','true')")
        legacy.reload()
        expect(legacy.locator('#legacy-notice')).to_be_visible()
        legacy.locator('#hero-start').click()
        expect(legacy.locator('#lesson-notes')).to_have_value('')
        expect(legacy.locator('input[data-step="0"]')).not_to_be_checked()
        legacy.locator('#dialog-close').click()
        with legacy.expect_download() as archive_download:
            legacy.locator('#export-legacy').click()
        archive = Path(archive_download.value.path()).read_text(encoding='utf-8-sig')
        assert 'Meeting face-to-face' in archive and 'Old role description' in archive
        assert legacy.evaluate("localStorage.getItem('learneverything-english-v1:1:notes')") == '"Old role description"'
        legacy_context.close()

        page.goto(base + '/')
        expect(page.locator('a.course[href="english/"]')).to_be_visible()
        page.locator('a.course[href="english/"]').click()
        expect(page.locator('.lesson-card')).to_have_count(45)
        page.locator('.header-inner .brand').click()
        assert page.url.endswith('/LearnEverything/')
        page.goto(base + '/fpga/')
        expect(page.locator('h1')).to_contain_text('会写程序')
        assert not errors, errors
        browser.close()
        print('PASS: 45 lessons, 25 genuine long originals, 4 extras, filters, deep links, 5-step completion, notes/reload/export, keyboard, invalid state, blocked/quota-limited storage, concurrent tab editing, 4 responsive sizes, Pages prefix and existing FPGA entry.')
finally:
    server.shutdown()
