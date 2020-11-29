import langdetect


def deduplicate(seq):
    '''Deduplicate a sequence while keeping its elements in order'''
    seen = set()
    seen_add = seen.add
    return [x for x in seq if not (x in seen or seen_add(x))]


def get_lang(text):
    try:
        return langdetect.detect(text)
    except:
        return None
