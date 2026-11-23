#!/usr/bin/env python3
"""Збирає «Останній Маяк» з модулів у src/ в один HTML-файл.

  python3 build.py

Результат:
  dist/game.html  — сторінка для claude.ai (без <!doctype>, як вимагає артефакт)
  docs/           — сайт для GitHub Pages: index.html, маніфест, service worker, іконки
"""
import glob, hashlib, json, os, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
S = lambda *p: os.path.join(ROOT, *p)
read = lambda p: open(p, encoding='utf8').read()


def assemble():
    js = ''.join(read(f) for f in sorted(glob.glob(S('src', 'js', '*.js'))))
    return (read(S('src', 'head.html')) + '<style>\n' + read(S('src', 'style.css')) + '</style>\n'
            + read(S('src', 'body.html')) + '<script>\n' + js + '</script>' + read(S('src', 'tail.html')))


def main():
    game = assemble()
    os.makedirs(S('dist'), exist_ok=True)
    open(S('dist', 'game.html'), 'w', encoding='utf8').write(game)

    ver = hashlib.sha1(game.encode('utf8')).hexdigest()[:10]
    head_extra = ('<meta charset="utf-8">\n'
                  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                  '<meta name="theme-color" content="#0b1418">\n'
                  '<meta name="description" content="Медитативна піксельна гра про хранителя згаслого маяка.">\n'
                  '<link rel="manifest" href="manifest.webmanifest">\n'
                  '<link rel="icon" href="icon-192.png">\n'
                  '<link rel="apple-touch-icon" href="apple-touch-icon.png">\n')
    sw_reg = ("<script>if('serviceWorker' in navigator)addEventListener('load',()=>"
              "navigator.serviceWorker.register('sw.js').catch(()=>{}));</script>\n")
    body_at = game.index('</style>') + len('</style>')
    page = ('<!doctype html>\n<html lang="uk">\n<head>\n' + head_extra + game[:body_at]
            + '\n</head>\n<body>' + game[body_at:] + '\n' + sw_reg + '</body>\n</html>\n')
    os.makedirs(S('docs'), exist_ok=True)
    open(S('docs', 'index.html'), 'w', encoding='utf8').write(page)
    open(S('docs', '.nojekyll'), 'w').write('')
    for f in glob.glob(S('assets', '*')):
        shutil.copy(f, S('docs', os.path.basename(f)))
    manifest = {
        "name": "Останній Маяк", "short_name": "Маяк", "lang": "uk",
        "description": "Медитативна піксельна гра про хранителя згаслого маяка.",
        "start_url": "./", "scope": "./", "display": "standalone",
        "background_color": "#0b1418", "theme_color": "#0b1418",
        "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},
                  {"src": "icon-512.png", "sizes": "512x512", "type": "image/png"},
                  {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
    open(S('docs', 'manifest.webmanifest'), 'w', encoding='utf8').write(json.dumps(manifest, ensure_ascii=False, indent=2))
    sw = read(S('src', 'sw.js')).replace('__VERSION__', ver)
    open(S('docs', 'sw.js'), 'w', encoding='utf8').write(sw)
    print('built', ver, len(game), 'bytes')


if __name__ == '__main__':
    main()
