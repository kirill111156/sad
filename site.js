const pages=[['index.html','Главная'],['all-services.html','Услуги'],['services.html','Программа'],['prices.html','Цены'],['gallery.html','Фото'],['promotions.html','Акции'],['reviews.html','Отзывы'],['contacts.html','Контакты']];
const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
if(!document.querySelector('link[rel~="icon"]'))document.head.insertAdjacentHTML('beforeend','<link rel="icon" href="favicon.ico" sizes="any">');
const gardenPhotos=[
  'assets/photos/home-hero.jpg','assets/references/adaptation-reference.png','assets/references/classroom-reference.png','assets/references/art-reference.png','assets/references/cooking-reference.png','assets/references/music-reference.png','assets/references/team-reference.png','assets/references/director-reference.png','assets/references/educator-reference.png','assets/references/food-reference.png','assets/references/reading-reference.png','assets/references/entrance-reference.png'
];
const responsiveLogoMarkup=`<img class="logo-art logo-new" src="assets/brand/mir-montessori-logo.svg" alt="Сад Мир Монтессори — Жулебино">`;
document.querySelectorAll('[data-header]').forEach(el=>el.innerHTML=`<a class="skip-link" href="#main">К основному содержанию</a><header class="site-header"><div class="container header-row"><a class="brand brand-logo" href="index.html" aria-label="Сад Мир Монтессори в Жулебино — главная">${responsiveLogoMarkup}</a><button class="menu-btn" aria-label="Открыть меню" aria-expanded="false" aria-controls="site-nav">☰</button><nav class="nav" id="site-nav" aria-label="Основная навигация">${pages.map(([url,label])=>`<a class="${file===url?'active':''}" href="${url}"${file===url?' aria-current="page"':''}>${label}</a>`).join('')}</nav><a class="phone" href="tel:+79264835949">+7 (926) 483-59-49</a><a class="btn" href="contacts.html#tour">На экскурсию</a></div></header>`);
document.querySelector('main')?.setAttribute('id','main');
document.querySelectorAll('[data-footer]').forEach(el=>el.innerHTML=`<footer class="site-footer"><div class="container footer-grid"><div><a class="brand brand-logo footer-logo" href="index.html" aria-label="Сад Мир Монтессори в Жулебино — главная">${responsiveLogoMarkup}</a><p>Частный детский сад для детей от 1,5 до 7 лет.</p><p class="fine">Стоимость и наличие мест уточняйте у администратора. Информация на сайте не является публичной офертой.</p></div><div class="footer-links"><strong>Разделы</strong>${pages.slice(1).map(([u,l])=>`<a href="${u}">${l}</a>`).join('')}</div><div><strong>Контакты</strong><p><a href="tel:+79264835949">+7 (926) 483-59-49</a><br>Москва, ул. Авиаконструктора Миля, 11, корп. 1<br>Пн–пт, 08:00–19:00</p><p><a href="privacy.html">Политика обработки данных</a></p></div></div></footer><div class="mobile-cta"><a class="btn secondary" href="tel:+79264835949">Позвонить</a><a class="btn" href="contacts.html#tour">Экскурсия</a></div>`);
document.addEventListener('click',e=>{if(e.target.closest('.menu-btn')){const b=e.target.closest('.menu-btn'),n=document.querySelector('.nav');n.classList.toggle('open');b.setAttribute('aria-expanded',n.classList.contains('open'))}});
document.querySelectorAll('.mail-form').forEach(form=>{
  form.insertAdjacentHTML('beforeend','<div class="form-honeypot" aria-hidden="true"><label>Не заполняйте это поле<input name="website" tabindex="-1" autocomplete="off"></label></div><div class="form-status" role="status" aria-live="polite"></div>');
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const button=form.querySelector('button[type="submit"],button:not([type])');
    const status=form.querySelector('.form-status');
    const originalText=button?.textContent||'Отправить';
    const data=new FormData(form);
    data.set('page',location.pathname);
    if(button){button.disabled=true;button.textContent='Отправляем…';}
    status.textContent='';status.className='form-status';
    try{
      const response=await fetch('send.php',{method:'POST',body:data,headers:{Accept:'application/json'}});
      const result=await response.json();
      if(!response.ok||!result.ok)throw new Error(result.message||'Не удалось отправить заявку.');
      form.reset();status.textContent=result.message;status.classList.add('success');
    }catch(error){
      status.textContent=error.message||'Не удалось отправить заявку. Позвоните нам по телефону.';status.classList.add('error');
    }finally{if(button){button.disabled=false;button.textContent=originalText;}}
  });
});
document.querySelectorAll('.mail-form input,.mail-form select,.mail-form textarea').forEach(field=>{if(!field.getAttribute('aria-label'))field.setAttribute('aria-label',field.placeholder||({name:'Имя родителя',phone:'Телефон',age:'Возраст ребёнка',message:'Комментарий'}[field.name]||field.name));});
if(file==='index.html'){
  const reviews=[...document.querySelectorAll('.section')].find(s=>s.textContent.includes('Что говорят родители'));
  if(reviews){reviews.classList.remove('tint');reviews.insertAdjacentHTML('beforebegin',`<section class="section tint"><div class="container"><div class="section-head"><div><div class="eyebrow">Ритм без спешки</div><h2>День, в котором есть место выбору</h2></div><p>Занятия сменяют друг друга без гонки: ребёнок успевает сосредоточиться, подвигаться, пообщаться и отдохнуть.</p></div><div class="timeline"><div class="timeline-item"><div class="timeline-time">Встреча</div><strong>Спокойно войти в день</strong><p>Педагог помогает ребёнку освоиться и выбрать первое занятие.</p></div><div class="timeline-item"><div class="timeline-time">Montessori-класс</div><strong>Работа в своём темпе</strong><p>Ребёнок выбирает материал, действует самостоятельно и при необходимости получает помощь.</p></div><div class="timeline-item"><div class="timeline-time">Вместе</div><strong>Движение и общение</strong><p>В дне есть групповые занятия, творчество, музыка и время быть с другими детьми.</p></div><div class="timeline-item"><div class="timeline-time">Завершение</div><strong>Спокойный переход домой</strong><p>Родителям рассказывают о важных событиях и настроении ребёнка.</p></div></div></div></section>`);}
}
const photoPlan={'index.html':[0,1],'gallery.html':[2,8,9,3,5,4,6,10,11],'services.html':[7,8,6]};
const photoLabels=['Акварельная иллюстрация ребёнка с глобусом — Мир Монтессори','Знакомство ребёнка с педагогом','Пространство Montessori-класса','Живопись на мольбертах','Кулинарное занятие','Музыкальное занятие','Команда детского сада','Руководитель беседует с родителем','Педагог помогает ребёнку','Сервировка детского стола','Время для чтения','Вход в детский сад'];
const photoSizes=[[1024,1024],[1448,1086],[1448,1086],[1448,1086],[1448,1086],[1448,1086],[1536,1024],[1122,1402],[1122,1402],[1448,1086],[1448,1086],[1536,1024]];
document.head.insertAdjacentHTML('beforeend','<style>.media-placeholder.has-photo{position:relative;overflow:hidden;padding:0;background:var(--sage);border:0}.media-placeholder.has-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.media-placeholder.has-photo .photo-fallback{display:none}</style>');
(photoPlan[file]||[]).forEach((photoIndex,slot)=>{
  const box=document.querySelectorAll('.media-placeholder')[slot];
  if(!box)return;
  const fallback=box.innerHTML;
  const label=box.querySelector('b')?.textContent||'Фотография Сада Монтессори';
  const eager=file==='index.html'&&slot===0;
  box.classList.add('has-photo');
  box.innerHTML=`<div class="photo-fallback">${fallback}</div><img src="${gardenPhotos[photoIndex]}" alt="${photoLabels[photoIndex]}" width="${photoSizes[photoIndex][0]}" height="${photoSizes[photoIndex][1]}" sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 40vw" ${eager?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
  const img=box.querySelector('img');
  img.addEventListener('load',()=>box.classList.add('photo-loaded'));
  img.addEventListener('error',()=>box.classList.add('photo-error'));
  if(img.complete&&img.naturalWidth)box.classList.add('photo-loaded');
});
const header=document.querySelector('.site-header');
const backToTop=document.createElement('button');
backToTop.className='back-to-top';
backToTop.type='button';
backToTop.setAttribute('aria-label','Вернуться в начало страницы');
backToTop.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/></svg>';
document.body.append(backToTop);
const updateScrollUi=()=>{
  const moved=window.scrollY>48;
  header?.classList.toggle('is-scrolled',moved);
  backToTop.classList.toggle('is-visible',window.scrollY>520);
};
window.addEventListener('scroll',updateScrollUi,{passive:true});
backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
updateScrollUi();
