import re


def base_url(url):
    '''Turns http://abc.xyz/ into abc.xyz'''
    proto_index = url.find('://')
    if proto_index >= 0:
        url = url[proto_index + 3:]
    if url.endswith('/'):
        url = url[:-1]
    return url


def find_urls(text):
    '''Find all substrings that look like urls, prepending http:// if needed'''
    url_regex = r"(?i)\b((?:www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))"
    return [
        'http://' + x[0]
        for x in re.findall(url_regex, text)
    ]
