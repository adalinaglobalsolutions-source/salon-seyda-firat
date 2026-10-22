'use strict';
const $ = (selector) => document.querySelector(selector);
const menu = $('.menu-toggle');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); $('#nav').classList.toggle('open', open); });
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); $('#nav').classList.remove('open'); }));
document.addEventListener('keydown', e => { if(e.key === 'Escape' && $('#nav')?.classList.contains('open')) { menu.setAttribute('aria-expanded','false'); $('#nav').classList.remove('open'); menu.focus(); } });
document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => { $('#service').value = a.dataset.service; $('#form-result').hidden = true; }));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
 document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed',String(b === button)); });
 let count=0; document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; if(!card.hidden) count++; });
 $('#filter-status').textContent = `${count} kart gösteriliyor.`;
}));
const messages = {
 normal: 'Demo talebi oluşturuldu: salon onayı bekleniyor. Henüz randevu kesinleşmedi. Bu örnek hiçbir yere gönderilmedi.',
 conflict: 'Demo çakışması: tercih edilen zaman uygun değil. Alternatif gün için salonla görüşme adımı gösterilir; otomatik randevu oluşturulmaz.',
 cancel: 'Demo talebi iptal edildi. Bu örnek için hatırlatma hazırlanmaz. Gerçek bir randevu değiştirilmedi.',
 error: 'Demo bağlantı hatası: talep iletilmedi. Seçimlerinizi kontrol edip yeniden deneyebilirsiniz. Gerçek bir bağlantı denenmedi.'
};
$('#booking-form')?.addEventListener('submit', e => { e.preventDefault(); const result=$('#form-result'); result.textContent=messages[$('#scenario').value]; result.dataset.state=$('#scenario').value; result.hidden=false; });
$('#reset-demo')?.addEventListener('click',()=>{ $('#booking-form').reset(); $('#form-result').textContent=''; $('#form-result').hidden=true; $('#service').focus(); });
// 3B etkileşimler: imleçle eğilen kartlar, dönen vitrin ve kayan galeri
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
if(!reduceMotion && finePointer){
 document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', e => { const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; card.style.setProperty('--ry',`${x*12}deg`); card.style.setProperty('--rx',`${-y*10}deg`); });
  card.addEventListener('pointerleave', () => { card.style.setProperty('--ry','0deg'); card.style.setProperty('--rx','0deg'); });
 });
 const scene=$('[data-scene]'), tilt=scene?.querySelector('.scene-tilt');
 scene?.addEventListener('pointermove', e => { const r=scene.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; tilt.style.setProperty('--ry',`${x*22}deg`); tilt.style.setProperty('--rx',`${-6-y*14}deg`); });
 scene?.addEventListener('pointerleave', () => { tilt.style.setProperty('--ry','0deg'); tilt.style.setProperty('--rx','-6deg'); });
}
const flow=$('.portfolio.flow');
if(flow){
 const layout=()=>{ const center=flow.scrollLeft+flow.clientWidth/2; flow.querySelectorAll('.concept').forEach(card=>{ if(card.hidden) return; const d=Math.max(-1.4,Math.min(1.4,(card.offsetLeft+card.offsetWidth/2-center)/(card.offsetWidth+26))); const a=Math.min(Math.abs(d),1); card.style.transform=reduceMotion?'':`rotateY(${-d*32}deg) translateZ(${-a*140}px) scale(${1-a*.06})`; card.style.opacity=String(1-a*.35); }); };
 let raf=0; flow.addEventListener('scroll',()=>{ cancelAnimationFrame(raf); raf=requestAnimationFrame(layout); },{passive:true});
 window.addEventListener('resize',layout);
 const step=dir=>flow.scrollBy({left:dir*(flow.querySelector('.concept:not([hidden])')?.offsetWidth+26||300),behavior:reduceMotion?'auto':'smooth'});
 $('.flow-btn.prev')?.addEventListener('click',()=>step(-1)); $('.flow-btn.next')?.addEventListener('click',()=>step(1));
 flow.addEventListener('keydown',e=>{ if(e.key==='ArrowRight'){e.preventDefault();step(1);} if(e.key==='ArrowLeft'){e.preventDefault();step(-1);} });
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{ flow.scrollLeft=0; requestAnimationFrame(layout); }));
 window.addEventListener('load',layout); layout();
}
