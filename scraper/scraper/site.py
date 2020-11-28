import requests
from bs4 import BeautifulSoup


class Site:
    def __init__(self, url, html):
        self.url = url
        self.html = html
        self.soup = BeautifulSoup(html, 'lxml')
    

    @classmethod
    def from_url(cls, url):
        return cls(
            url=url,
            html=requests.get(url).text
        )


    @property
    def links(self):
        '''Returns a list of URLs that this website links to'''
        # TODO: use regex to match things that look like urls (even if they're not linked)
        return [
            link['href']
            for link in self.soup.body.find_all('a', href=True)
        ]
    

    def __hash__(self):
        return hash(self.html)
    

    def __repr__(self):
        return f'Site at {self.url} with {len(self.links)} links'
