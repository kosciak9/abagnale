import re
import spacy
from tqdm.auto import tqdm
from scraper.url import domain
from scraper.utils import get_lang


# TODO: should extract entity objects, so that case/url details become unimportant
def extract_entities(site):
    unfiltered = set(
        extract_emails(site)
        + extract_nlp(site)
        + [domain(site.url)]
        + ([site.title] if site.title is not None else [])
    )
    return list(set(
        entity.lower()
        for entity in unfiltered
        if not any(symbol in entity for symbol in ['\t', '\n', '\u200b'])
        if entity.count(' ') <= 2
    ))


email_regex = re.compile(r'[\w\.-]+@[\w\.-]+\.\w+')
def extract_emails(site):
    return email_regex.findall(site.text)


def extract_nlp(site):
    lang = site.lang
    nlp_models = get_nlp_models()
    if lang not in nlp_models:
        return []
    return [
        ent.text.strip()
        for ent in nlp_models[lang](site.text).ents
        if ent.label_ in nlp_label_types[lang]
        if get_lang(ent.text) in nlp_models
    ]


_nlp_models_cache = None
def get_nlp_models():
    global _nlp_models_cache
    if _nlp_models_cache is not None:
        return _nlp_models_cache
    _nlp_models_cache = {
        code: spacy.load(model_name) # if this crashes, run: spacy download <model name>
        for code, model_name in tqdm(
            {
                'en': 'en_core_web_md',
                **{
                    code: f'{code}_core_news_sm'
                    for code in [
                        'pl', 'nl', 'fr', 'de', 'it', 'es'
                    ]
                }
            }.items(),
            desc='Loading NLP models'
        )
    }
    return _nlp_models_cache


nlp_label_types = {
    'pl': {'persName', 'orgName'},
    **{
        code: {'PERSON', 'ORG'}
        for code in [
            'en', 'nl', 'fr', 'de', 'it', 'es'
        ]
    }
}
