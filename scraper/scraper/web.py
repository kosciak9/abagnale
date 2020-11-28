from functools import reduce
from scraper.site import Site
from scraper.url import base_url
from scraper.parallel import parallel_map


class Web:
    def __init__(self, sites):
        self.sites = frozenset(sites)
    

    @classmethod
    def from_url(cls, url, depth=1, parallel=True):
        '''Follow the URL, all URLs found on the URL, etc - until the depth limit is reached'''
        if depth == 0:
            return cls(sites=[])
        top_level_site = Site.from_url(url, ignore_errors=True)
        if top_level_site is None:
            return cls(sites=[])
        
        links = top_level_site.links if depth > 1 else []
        def recurse(link):
            return cls.from_url(url=link, depth=depth - 1, parallel=parallel)
        
        return cls.merge(
            cls(sites=[top_level_site]),
            *(
                parallel_map(recurse, links)
                if parallel and depth == 2 else
                [recurse(link) for link in links]
            )
        )


    @classmethod
    def merge(cls, *args):
        '''Merge multiple webs, making sure not to duplicate sites'''
        return cls(sites=reduce(
            lambda a, b: a.union(b),
            (arg.sites for arg in args),
            frozenset()
        ))
    

    def __getitem__(self, url):
        for site in self.sites:
            if base_url(site.url) == base_url(url):
                return site
        raise KeyError(f'Base url {base_url(url)} of {url} not present in {self}')
    

    def __repr__(self):
        return f'Web with {len(self.sites)} sites'
