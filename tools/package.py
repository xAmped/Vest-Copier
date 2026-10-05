#!/usr/bin/env python3
"""Build the shareable package: dist/vest-copier-v<version>/ and a .zip of it.

Contents: the userscript, a self-contained offline copy of the tutorial (screenshots inlined), the one-page
quick-start PDF, and a short README. Run from anywhere:  python3 tools/package.py
Regenerate the inputs first if they changed:  node docs/tutorial/shots.mjs  and  (cd docs/one-pager && node build-pdf.mjs)
"""
import base64
import re
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / 'src' / 'vest-copier.user.js'
TUTORIAL = ROOT / 'docs' / 'tutorial' / 'index.html'
PDF = ROOT / 'docs' / 'Vest-Copier-Quick-Start.pdf'

src = SCRIPT.read_text(encoding='utf-8')
version = re.search(r"^// @version\s+(\S+)", src, re.M).group(1)
name = f'vest-copier-v{version}'
out = ROOT / 'dist' / name

tutorial = TUTORIAL.read_text(encoding='utf-8')
if f'v{version}' not in tutorial:
    raise SystemExit(f'docs/tutorial/index.html does not mention v{version}: update its version pill first')


def inline_image(match):
    path = TUTORIAL.parent / match.group(1)
    data = base64.b64encode(path.read_bytes()).decode('ascii')
    return f'src="data:image/png;base64,{data}"'


body = re.sub(r'src="(img/[^"]+\.png)"', inline_image, tutorial)
if body.lstrip().lower().startswith('<!doctype'):
    standalone = body  # already a full document (as in the public repo)
else:  # authored as a page body: wrap it
    title = re.search(r'<title>(.*?)</title>', body).group(1)
    body = body.replace(f'<title>{title}</title>', '', 1)
    standalone = (
        '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>{title}</title>\n</head>\n<body>\n{body}\n</body>\n</html>\n'
    )

readme = f"""Vest Copier v{version}
=====================

Copies your master Vest Markets account's trades to your other accounts, live, from inside the
Vest page. Adds a Trade tab for stop and targets in points.

IT PLACES REAL ORDERS ON LIVE ACCOUNTS. Start with the smallest size.

In this folder
  vest-copier.user.js           The script.
  LICENSE.txt                   What you may and may not do with it.
  Vest-Copier-Tutorial.html     The tutorial. Open it in your browser and read it first.
  Vest-Copier-Quick-Start.pdf   One-page summary.

Install (2 minutes)
  1. Install the Tampermonkey browser extension.
  2. Chrome, Edge or Brave: open chrome://extensions, click Details on Tampermonkey,
     and turn on "Allow User Scripts".
  3. Open https://raw.githubusercontent.com/xAmped/Vest-Copier/main/src/vest-copier.user.js
     and click Install (it then updates itself). Or: Tampermonkey icon > Create a new script,
     delete the template, paste ALL of vest-copier.user.js, and save (Ctrl+S).
  4. Open next.vestmarkets.com. The Vest Copier panel appears top-right.

Paste the script's text into Tampermonkey. Opening a .txt copy in the browser does not install it.

Source, updates and issues: https://github.com/xAmped/Vest-Copier
License: free to use for your own trading and to share unmodified; not for sale (see LICENSE.txt).

Independent tool, not affiliated with or endorsed by Vest Markets. Use at your own risk.
"""

if out.exists():
    shutil.rmtree(out)
out.mkdir(parents=True)
shutil.copy2(SCRIPT, out / 'vest-copier.user.js')
(out / 'Vest-Copier-Tutorial.html').write_text(standalone, encoding='utf-8')
shutil.copy2(PDF, out / 'Vest-Copier-Quick-Start.pdf')
shutil.copy2(ROOT / 'LICENSE', out / 'LICENSE.txt')
(out / 'README.txt').write_text(readme.replace('\n', '\r\n'), encoding='utf-8')  # Windows line endings for Notepad

zip_path = out.parent / f'{name}.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(out.iterdir()):
        z.write(f, f'{name}/{f.name}')

print(f'built {out.relative_to(ROOT)}/ and {zip_path.relative_to(ROOT)} ({zip_path.stat().st_size // 1024} KB)')
