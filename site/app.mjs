import {recommendService,buildSummary} from './service-guide.mjs';
import {initialLanguage,applyLanguage,translate} from './i18n.mjs';

const config=window.VAREMO_CONFIG;
const phone=String(config.whatsappNumber).replace(/\D/g,'');
let language=initialLanguage();
function updateContactLinks(){
  document.querySelectorAll('[data-contact]').forEach(link=>{
    const greeting=translate(link.dataset.contactMessage || 'contact.greeting');
    link.href=`https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`;
  });
}

const menuButton=document.querySelector('.menu-toggle');
const nav=document.getElementById('main-nav');
function closeMenu(){nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label',translate('menu.open'));}
menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',translate(open?'menu.close':'menu.open'));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('is-open')){closeMenu();menuButton.focus();}});
window.matchMedia('(min-width:1001px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const fields={vehicle:document.getElementById('vehicle'),dirt:document.getElementById('dirt'),water:document.getElementById('water')};
function updateGuide(){
  const values=Object.fromEntries(Object.entries(fields).map(([key,element])=>[key,element.value]));
  const result=recommendService(values.vehicle,values.dirt,values.water,config.prices,language);
  for(const key of ['method','description','price','note'])document.getElementById(`result-${key}`).textContent=result[key];
  document.getElementById('result-price-label').textContent=result.priceLabel;
  document.getElementById('whatsapp-summary').href=`https://wa.me/${phone}?text=${encodeURIComponent(buildSummary({...values,result},language))}`;
}
const guide=document.getElementById('service-guide');
guide.addEventListener('change',updateGuide);
guide.addEventListener('submit',event=>event.preventDefault());
document.querySelectorAll('[data-vehicle]').forEach(link=>link.addEventListener('click',()=>{fields.vehicle.value=link.dataset.vehicle;updateGuide();}));
function setLanguage(nextLanguage,remember=false){
  language=applyLanguage(nextLanguage,{remember});
  updateGuide();
  updateContactLinks();
  updateAnimationControl();
  menuButton.setAttribute('aria-label',translate(nav.classList.contains('is-open')?'menu.close':'menu.open'));
}
const availability=document.querySelector('.availability-strip');
const animationButton=document.querySelector('.availability-pause');
function updateAnimationControl(){
  const paused=availability.classList.contains('is-paused');
  animationButton.setAttribute('aria-pressed',String(paused));
  animationButton.setAttribute('aria-label',translate(paused?'hours.resume':'hours.pause'));
}
animationButton.addEventListener('click',()=>{
  availability.classList.toggle('is-paused');
  updateAnimationControl();
});
animationButton.hidden=false;
document.querySelectorAll('[data-language]').forEach(button=>{
  button.addEventListener('click',()=>setLanguage(button.dataset.language,true));
});
setLanguage(language);
document.getElementById('year').textContent=String(new Date().getFullYear());

const privacy=document.getElementById('privacy-dialog');
document.getElementById('privacy-open').addEventListener('click',()=>privacy.showModal());
privacy.querySelector('.dialog-close').addEventListener('click',()=>privacy.close());
privacy.addEventListener('click',event=>{if(event.target!==privacy)return;const rect=privacy.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)privacy.close();});

const sticky=document.querySelector('.mobile-contact');
if('IntersectionObserver' in window){
  const visible=new Set();
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)visible.add(entry.target);else visible.delete(entry.target);});const hidden=visible.size>0;sticky.classList.toggle('is-hidden',hidden);sticky.inert=hidden;},{threshold:.1});
  ['hero-contact','whatsapp-summary'].forEach(id=>observer.observe(document.getElementById(id)));
  observer.observe(document.querySelector('.footer-contact'));
}else{sticky.classList.remove('is-hidden');}
