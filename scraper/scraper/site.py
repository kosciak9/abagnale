import requests
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from scraper.url import base_url, find_urls


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
        links = [
            urljoin(self.url, link['href'])
            for link in self.soup.body.find_all('a', href=True)
        ]
        look_like_urls = find_urls(self.soup.body.get_text())
        # the below guarantees that for every base url, only one corresponding actual url is returned
        return list({
            base_url(url): url
            for url in look_like_urls + links
        }.values())
    

    def __hash__(self):
        # using only html would cause sites with the same html to be de-duplicated
        # then, when other sites link to them, they would not be found in the database
        return hash(base_url(self.url))
    

    def __repr__(self):
        return f'Site at {self.url} with {len(self.links)} links'
