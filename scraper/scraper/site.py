import requests
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from scraper.url import domain, base_url, find_urls


class Site:
    def __init__(self, url, html):
        self.url = url
        self.html = html
    

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
        '''A list of URLs that this website links to'''
        if self.soup.body is None:
            return []
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
    

    @property
    def external_links(self):
        '''A list of URLs outside this domain'''
        return [
            link
            for link in self.links
            if domain(link) != domain(self.url)
        ]
    

    @property
    def soup(self):
        return BeautifulSoup(self.html, 'lxml')
    

    @classmethod
    def from_json(cls, json_obj):
        return cls(
            url=json_obj['url'],
            html=json_obj['html'],
        )
    

    def to_json(self):
        return dict(
            url=self.url,
            html=self.html,
        )
    

    def __hash__(self):
        # using only html would cause sites with the same html to be de-duplicated
        # then, when other sites link to them, they would not be found in the database
        return hash(base_url(self.url))
    

    def __repr__(self):
        return f'Site at {self.url} with {len(self.links)} links'
