"""Map links from either upstream wiki to relocatable local mirror URLs."""
import posixpath
from urllib.parse import quote, unquote, urlsplit, urlunsplit

HOSTS = {'oi-wiki.org': 'oi-wiki', 'www.oi-wiki.org': 'oi-wiki',
         'csdiy.wiki': 'cs-self-learning', 'www.csdiy.wiki': 'cs-self-learning'}


def page_route(source):
    """MkDocs directory URL, including CS's .en.md language convention."""
    english = source.endswith('.en.md')
    source = source[:-6] + '.md' if english else source
    route = source[:-3]
    route = route[:-5] if route.endswith('index') and (route == 'index' or route.endswith('/index')) else route + '/'
    return ('en/' if english else '') + route


class MirrorLinks:
    def __init__(self, sources):
        self.routes = {site: {page_route(path) for path in paths} for site, paths in sources.items()}
        self.aliases = {}
        for site, routes in self.routes.items():
            leaves = {}
            for route in routes:
                if route.startswith('en/'):
                    continue
                leaves.setdefault(route.rstrip('/').split('/')[-1], []).append(route)
            self.aliases[site] = {key: values[0] for key, values in leaves.items() if len(values) == 1}
        self.missing = set()

    def rewrite(self, url, site, current_route):
        parsed = urlsplit(url)
        if parsed.netloc:
            target_site = HOSTS.get(parsed.hostname)
            if not target_site:
                return url
        elif parsed.path.startswith('/') and not parsed.scheme:
            target_site = site
        else:
            return url
        path = unquote(parsed.path).strip('/')
        if path.endswith('.md'):
            path = page_route(path)
        elif path.endswith('/index.html') or path == 'index.html':
            path = path[:-10]
        elif path.endswith('.html'):
            path = path[:-5] + '/'
        else:
            path = path + '/' if path else ''
        # Absolute upstream image/code links retain their file extension.
        if posixpath.splitext(parsed.path)[1] not in ('', '.md', '.html'):
            path = unquote(parsed.path).lstrip('/')
        elif path not in self.routes[target_site]:
            alias = self.aliases[target_site].get(path.rstrip('/').split('/')[-1])
            if alias and not path.startswith('en/'):
                path = alias
            else:
                self.missing.add((target_site, parsed.path))
                path = 'mirror-missing/'
                parsed = parsed._replace(query='path=' + quote(parsed.path, safe=''), fragment='')
        target = posixpath.join(target_site, path)
        base = posixpath.join(site, current_route or '.')
        relative = posixpath.relpath(target, base)
        if path.endswith('/') or not path:
            relative = relative.rstrip('/') + '/'
        return urlunsplit(('', '', relative, parsed.query, parsed.fragment))
