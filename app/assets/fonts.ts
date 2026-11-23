// 字型切換：網址加 ?ff_type=0 / 1 / 2
//   0 = 原本的字（系統字型，預設）
//   1 = Zen Maru Gothic（日文圓體；它沒有的中文字，例如查、鄉、值，用思源黑體補）
//   2 = 芫荽 Iansui
// 選過的會記在這個瀏覽器（localStorage），換頁也維持；?ff_type=0 換回原本的
// 這段放在 <head> 直接執行（畫面出來前），所以只能用一般 JavaScript
export const FONTS: Record<string, string> = {
  '1': 'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Noto+Sans+TC:wght@400;500;700;900&display=swap',
  '2': 'https://fonts.googleapis.com/css2?family=Iansui&display=swap',
}

export const FONT_SCRIPT = `(function(){
var F=${JSON.stringify(FONTS)};
window.__setFont=function(t){
  t=F[t]?t:'0';
  try{localStorage.setItem('ff_type',t)}catch(e){}
  document.documentElement.setAttribute('data-ff',t);
  if(F[t]&&!document.getElementById('ff-'+t)){var l=document.createElement('link');l.id='ff-'+t;l.rel='stylesheet';l.href=F[t];document.head.appendChild(l)}
};
var t=null;
try{t=new URLSearchParams(location.search).get('ff_type')}catch(e){}
if(t==null){try{t=localStorage.getItem('ff_type')}catch(e){}}
window.__setFont(t);
})();`
