from functools import reduce
from scraper.site import Site


class Web:
    def __init__(self, sites):
        self.sites = frozenset(sites)
    

    @classmethod
    def from_url(cls, url, depth=1):
        '''Follow the URL, all URLs found on the URL, etc - until the depth limit is reached'''
        if depth == 0:
            return cls(sites=[])
        top_level_site = Site.from_url(url) # TODO: handle errors here
        return cls.merge(
            cls(sites=[top_level_site]),
            *[
                cls.from_url(url=link_url, depth=depth - 1)
                for link_url in top_level_site.links
            ]
        )


    @classmethod
    def merge(cls, *args):
        '''Merge multiple webs, making sure not to duplicate sites'''
        return cls(sites=reduce(
            lambda a, b: a.union(b),
            (arg.sites for arg in args)
        ))
    

    def __repr__(self):
        return f'Web with {len(self.sites)} sites'
