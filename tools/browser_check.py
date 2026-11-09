# Chromium (SwiftShader) tekshiruvi: python3 tools/browser_check.py  (playwright kerak)
import asyncio,sys,json
from playwright.async_api import async_playwright
import os;import tempfile;SP=tempfile.mkdtemp(prefix='koinot_shots_')+os.sep
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader','--allow-file-access-from-files'])
    pg=await b.new_page(viewport={'width':1440,'height':900})
    errs=[]
    pg.on('pageerror',lambda e:errs.append('PAGEERR '+str(e)))
    pg.on('console',lambda m:errs.append('CONSOLE '+m.type+' '+m.text) if m.type in('error',) and 'net::ERR_' not in m.text else None)
    await pg.goto(''+'file://'+os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','index.html'))+'')
    await pg.wait_for_selector('#loader.done',state='attached',timeout=90000)
    await pg.wait_for_timeout(1500)
    await pg.screenshot(path=SP+'s_main.png')
    tabs=await pg.evaluate("[...document.querySelectorAll('.lab-tabs button')].map(b=>b.dataset.lab)")
    print('tabs',tabs)
    for t in tabs:
      await pg.evaluate("KoinotLab.open(%s)"%json.dumps(t))
      await pg.wait_for_timeout(700)
      await pg.screenshot(path=SP+'s_%s.png'%t)
    print('errors',errs[:20])
    await b.close()
asyncio.run(main())
