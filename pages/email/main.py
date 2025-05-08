import sys
import io
import requests
import re
import json
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def normalize_email(text):
    return text.lower().replace("[at]", "@").replace("(at)", "@") \
               .replace("[dot]", ".").replace("(dot)", ".") \
               .replace(" at ", "@").replace(" dot ", ".") \
               .replace(" ", "").strip()

def extract_contacts_with_names(html):
    soup = BeautifulSoup(html, "html.parser")

    email_pattern = re.compile(r"[\w\.-]+(?:\s*(?:@|\[at\]|\(at\))\s*)[\w\.-]+(?:\s*(?:\.|\[dot\]|\(dot\))\s*)[\w\.-]+")
    phone_pattern = re.compile(r"(?:\+91[\-\s]?)?\b\d{10}\b|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b")

    emails = set()
    phones = set()

    for tag in soup.find_all(text=True):
        if not tag.strip():
            continue
        line = tag.strip()
        emails.update(normalize_email(email) for email in email_pattern.findall(line))
        phones.update(phone.strip() for phone in phone_pattern.findall(line))

    return list(emails), list(phones)

def fetch_single_page_contacts(url, name_filter=None):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        html = response.text
        emails, phones = extract_contacts_with_names(html)

        if name_filter:
            emails = [e for e in emails if name_filter.lower() in e.lower()]
            phones = [p for p in phones if name_filter.lower() in p.lower()]

        return emails, phones
    except Exception as e:
        return [], []

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({ "emails": [], "phones": [], "error": "Missing URL" }))
        sys.exit(1)

    url = sys.argv[1]
    name_filter = sys.argv[2] if len(sys.argv) > 2 else None

    emails, phones = fetch_single_page_contacts(url, name_filter)
    print(json.dumps({ "emails": emails, "phones": phones }))
