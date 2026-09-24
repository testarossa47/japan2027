// Food photographs used in the daily plan. Original files and licence details
// remain linked on Wikimedia Commons below every image.
const foodPhotos = {
  bento: ['Zaru Bento.jpg', 'Bento für unterwegs'],
  gyudon: ['024 Gyudon beef bowl 牛丼 in Japan - food in Yoshinoya restaurant in Osaka, Japan.jpg', 'Gyūdon'],
  tendon: ['Tendon.jpg', 'Tendon'],
  tonkatsu: ['Japanese tonkatsu.jpg', 'Tonkatsu'],
  teppanyaki: ['Geselliges TEPPANyaki.jpg', 'Teppanyaki'],
  curryBread: ['Curry bread.jpg', 'Kare Pan'],
  hoto: ['Hōtō noodles.jpg', 'Hōtō-Nudeln'],
  kaiseki: ['IMG-2023-12-01-kaiseki.jpg', 'Ryokan-Abendessen'],
  teishoku: ['TonkatsuMeal.jpg', 'Japanisches Teishoku'],
  seafood: ['Sushi platter.jpg', 'Fischgericht und Markt-Snacks'],
  hidaBeef: ['Grilling Hida Beef (Takayama Street Food) (35910429046).jpg', 'Hida-Rind'],
  yudofu: ['Yudofu.jpg', 'Yudōfu'],
  soba: ['JapaneseFood.JPG', 'Soba'],
  takoyaki: ['Japanese Takoyaki.jpg', 'Takoyaki'],
  kushikatsu: ['Osaka kushiage kushikatsu (3818694686).jpg', 'Kushikatsu'],
  kakinoha: ['Kakinoha-zushi - 2.jpg', 'Kakinoha-Zushi'],
  okonomiyaki: ['Okonomiyaki 008.jpg', 'Okonomiyaki'],
  anagomeshi: ['Japanese anagomeshi.jpg', 'Anago-Meshi'],
  okinawa: ['Okinawa soba and goya chanpuru.jpg', 'Okinawa Soba und Gōya Champurū']
};

const foodPhotoByDay = {
  1:'bento', 2:'gyudon', 3:'tendon', 4:'tonkatsu', 5:'teppanyaki', 6:'curryBread',
  7:'hoto', 8:'kaiseki', 9:'teishoku', 10:'seafood', 11:'hidaBeef', 12:'hidaBeef',
  13:'yudofu', 14:'soba', 15:'teishoku', 16:'takoyaki', 17:'teishoku', 18:'kushikatsu',
  19:'kakinoha', 20:'okonomiyaki', 21:'okonomiyaki', 22:'anagomeshi', 23:'okinawa',
  24:'okinawa', 25:'okinawa', 26:'teishoku', 41:'bento'
};

const foodPhotoForDay = (day) => foodPhotoByDay[day] || 'teishoku';
const commonsFileUrl = (file) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(' ','_'))}`;
const commonsImageUrl = (file, width=640) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file.replaceAll(' ','_'))}?width=${width}`;
