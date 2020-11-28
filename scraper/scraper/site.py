import requests
from urllib.parse import urljoin
import re
from bs4 import BeautifulSoup


class Site:
    def __init__(self, url, html):
        self.url = url
        self.html = html
        self.soup = BeautifulSoup(html, 'lxml')
    

    @classmethod
    def from_url(cls, url, ignore_errors=False):
        try:
            html = requests.get(url).text
        except Exception as exception:
            if ignore_errors:
                return None
            raise exception
        return cls(
            url=url,
            html=html
        )


    @property
    def links(self):
        '''Returns a list of URLs that this website links to'''
        # TODO: use regex to match things that look like urls (even if they're not linked)
        links = frozenset(
            urljoin(self.url, link['href'])
            for link in self.soup.body.find_all('a', href=True)
        )
        url_regex = r"(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
        look_like_urls = frozenset(x[0] for x in re.findall(url_regex, self.soup.body.get_text())) # TODO: add http:// etc to these links
        return links.union(look_like_urls)
    

    def __hash__(self):
        return hash(self.html)
    

    def __repr__(self):
        return f'Site at {self.url} with {len(self.links)} links'
