from functools import reduce
import gzip
import json
from scraper.site import Site
from scraper.url import base_url
from scraper.parallel import parallel_map


class Web:
    def __init__(self, sites):
        self.sites = frozenset(sites)
    

    @classmethod
    def from_url(cls, url, max_links=256, depth=1, parallel=True):
        '''Follow the URL, all URLs found on the URL, etc - until the depth limit is reached'''
        top_level_site = Site.from_url(url, ignore_errors=True)
        if top_level_site is None:
            return cls(sites=[])
        
        links = top_level_site.links if depth > 1 else []
        links = links[:max_links]
        def recurse(link):
            return cls.from_url(url=link, max_links=max_links, depth=depth - 1, parallel=False)
        
        return cls.merge(
            cls(sites=[top_level_site]),
            *(
                parallel_map(recurse, links)
                if parallel else
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
    

    @classmethod
    def from_zip(cls, file_path):
        with gzip.open(file_path, 'rb') as file:
            json_str = file.read().decode('utf8')
            return cls.from_json(json.loads(json_str))
    

    def to_zip(self, file_path):
        with gzip.open(file_path, 'wb') as file:
            json_str = json.dumps(self.to_json())
            file.write(bytes(json_str, encoding='utf8'))

    
    @classmethod
    def from_json(cls, json_obj):
        return cls([Site.from_json(site_json) for site_json in json_obj])
    

    def to_json(self):
        # sort by hash to guarantee that the same web will always give the same json
        return [site.to_json() for site in sorted(self.sites, key=hash)]
    

    def __len__(self):
        return len(self.sites)
    

    def __iter__(self):
        return iter(self.sites)
    

    def __getitem__(self, url):
        for site in self.sites:
            if base_url(site.url) == base_url(url):
                return site
        raise KeyError(f'Base url {base_url(url)} of {url} not present in {self}')
    

    def __repr__(self):
        return f'Web with {len(self.sites)} sites'
