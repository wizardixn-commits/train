import urllib.request
import re
import os

css_urls = [
    ("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap", "Outfit"),
    ("https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap", "Noto Color Emoji")
]

req = urllib.request.Request(
    css_urls[0][0], 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
)

local_css = ""

for url, name in css_urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})
    response = urllib.request.urlopen(req).read().decode('utf-8')
    
    # find all woff2 urls
    urls = re.findall(r'url\((https://[^)]+\.woff2)\)', response)
    
    for font_url in set(urls):
        font_name = font_url.split('/')[-1]
        print(f"Downloading {font_name}...")
        urllib.request.urlretrieve(font_url, f"fonts/{font_name}")
        response = response.replace(font_url, f"../fonts/{font_name}")
        
    local_css += response + "\n"
    
with open('css/fonts.css', 'w') as f:
    f.write(local_css)

