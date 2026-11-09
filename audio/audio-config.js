/* KOINOT — musiqa va ovoz sozlamasi (ixtiyoriy).
   Fayllarni shu papkadagi music/ va ambient/ ichiga qo‘ying — batafsil: audio/OQING.txt.
   Hech narsa yozmasangiz ham ishlaydi: ilovaning o‘z (kod bilan hosil qilingan) musiqa va ovozlari yangraydi.

   music   — musiqa fayllari ro‘yxati, masalan: ['music/kosmos1.mp3','music/kosmos2.ogg']
             (bo‘sh qoldirsangiz, music/music1.mp3, music2.mp3, music3.mp3 … nomli fayllar tartib bilan qidiriladi)
   ambient — alohida obyekt ovozlari, masalan: {earth:'ambient/yer.mp3', jupiter:'ambient/yupiter.mp3', 'galaxy:andromeda':'ambient/andromeda.mp3'}
             (ro‘yxatda bo‘lmasa, ambient/<kalit>.mp3 qidiriladi: ambient/earth.mp3, ambient/stage3.mp3 …) */
window.KOINOT_AUDIO={music:[],ambient:{}};
