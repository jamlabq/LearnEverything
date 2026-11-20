import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from wiki_links import MirrorLinks


class MirrorLinksTest(unittest.TestCase):
    def setUp(self):
        self.links = MirrorLinks({
            'oi-wiki': {'index.md', 'ds/seg.md', 'math/number-theory/gcd.md'},
            'cs-self-learning': {'index.md', '编程入门/Python/CS61A.md', '编程入门/Python/CS61A.en.md', '必学工具/workflow.md', '必学工具/workflow.en.md'},
        })

    def test_absolute_internal_links_stay_local_under_any_deployment_prefix(self):
        self.assertEqual(self.links.rewrite('https://oi-wiki.org/ds/seg/#test', 'cs-self-learning', '必学工具/workflow/'), '../../../oi-wiki/ds/seg/#test')
        self.assertEqual(self.links.rewrite('https://oi-wiki.org/ds/seg/?q=1#x', 'oi-wiki', 'math/number-theory/gcd/'), '../../../ds/seg/?q=1#x')

    def test_chinese_and_historical_links(self):
        self.assertEqual(self.links.rewrite('https://csdiy.wiki/%E5%BF%85%E5%AD%A6%E5%B7%A5%E5%85%B7/workflow/', 'oi-wiki', ''), '../cs-self-learning/必学工具/workflow/')
        self.assertEqual(self.links.rewrite('https://csdiy.wiki/编程入门/CS61A/', 'cs-self-learning', ''), '编程入门/Python/CS61A/')

    def test_english_and_root_relative_links(self):
        self.assertEqual(self.links.rewrite('https://csdiy.wiki/en/必学工具/workflow/', 'oi-wiki', ''), '../cs-self-learning/en/必学工具/workflow/')
        self.assertEqual(self.links.rewrite('/ds/seg/', 'oi-wiki', 'math/number-theory/gcd/'), '../../../ds/seg/')

    def test_unrelated_links_are_preserved(self):
        for value in ['https://cs61a.org/', 'https://github.com/OI-wiki/OI-wiki', '#intro', '../seg/', 'mailto:test@example.com']:
            self.assertEqual(self.links.rewrite(value, 'oi-wiki', ''), value)

    def test_missing_upstream_page_has_explicit_local_fallback(self):
        self.assertEqual(self.links.rewrite('https://oi-wiki.org/missing/', 'oi-wiki', ''), 'mirror-missing/?path=%2Fmissing%2F')


if __name__ == '__main__':
    unittest.main()
