"""Rebuild offline texture bundle after editing assets/textures images.
Run: python tools/build_textures.py (from any folder). Standard Python only.
Data URLs allow WebGL texture loading when index.html is opened via file://.
"""
from pathlib import Path
import base64, json, mimetypes
root=Path(__file__).resolve().parents[1]
assets=root/'assets'/'textures'
textures={p.name:'data:'+mimetypes.guess_type(p.name)[0]+';base64,'+base64.b64encode(p.read_bytes()).decode('ascii') for p in sorted(assets.iterdir()) if p.suffix.lower() in {'.jpg','.jpeg','.png','.webp'}}
(assets/'textures.bundle.js').write_text('/* Generated from local textures. Run tools/build_textures.py to rebuild. */\nwindow.KOINOT_TEXTURES='+json.dumps(textures,separators=(',',':'))+';\n',encoding='utf-8')
print('Packed',len(textures),'textures')
