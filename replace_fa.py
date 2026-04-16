import os, re

REPLACEMENTS = [
    ('fa-arrow-left',         '←'),
    ('fa-rotate-right',       '↺'),
    ('fa-rotate-left',        '↩'),
    ('fa-play',               '▶'),
    ('fa-right-from-bracket', '⇥'),
    ('fa-right-to-bracket',   '→'),
    ('fa-chevron-right',      '›'),
    ('fa-heart',              '♥'),
    ('fa-save',               '💾'),
    ('fa-check',              '✓'),
]

def replace_fa(content):
    for icon, sym in REPLACEMENTS:
        # Match <i class="fa-solid fa-XXX"></i> with any attrs/order
        pattern = r'<i[^>]*' + re.escape(icon) + r'[^>]*>\s*</i>'
        content = re.sub(pattern, sym, content)
    return content

js_dir = os.path.join(os.path.dirname(__file__), 'js')
changed = []
for fname in os.listdir(js_dir):
    if fname.endswith('.js'):
        fpath = os.path.join(js_dir, fname)
        orig = open(fpath, encoding='utf-8').read()
        updated = replace_fa(orig)
        if updated != orig:
            open(fpath, 'w', encoding='utf-8').write(updated)
            changed.append(fname)

print('Updated:', ', '.join(sorted(changed)) if changed else 'none')
