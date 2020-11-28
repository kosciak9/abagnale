import re
from urllib.parse import urlparse


def domain(url):
    '''Turn http://abc.xyz/cool?q=10 into abc.xyz'''
    return urlparse(url).netloc


def base_url(url):
    '''Turn http://abc.xyz/cool?q=10 into abc.xyz/cool'''
    parsed = urlparse(url)
    domain = parsed.netloc
    path = parsed.path
    if path.endswith('/'):
        path = path[:-1]
    return domain + path


def find_urls(text):
    '''Find all substrings that look like urls, prepending http:// if needed'''
    url_regex = r"(?i)\b((?:www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
    return [
        'http://' + x[0]
        for x in re.findall(url_regex, text)
    ]
