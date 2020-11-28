from functools import reduce
from tqdm.auto import tqdm
from scraper.url import base_url
from scraper.site import Site


class Web:
    def __init__(self, sites):
        self.sites = frozenset(sites)
    

    @classmethod
    def from_url(cls, url, depth=1, loading=True):
        '''Follow the URL, all URLs found on the URL, etc - until the depth limit is reached'''
        if depth == 0:
            return cls(sites=[])
        top_level_site = Site.from_url(url, ignore_errors=True)
        if top_level_site is None:
            return cls(sites=[])
        links = top_level_site.links
        links = tqdm(links) if loading and depth == 2 else links
        return cls.merge(
            cls(sites=[top_level_site]),
            *[
                cls.from_url(url=link_url, depth=depth - 1, loading=loading)
                for link_url in links
            ]
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
