/* Funcionalidad independiente de WordPress/Divi y servicios externos. */
(() => {
 'use strict';
 const ZONAS=JSON.parse(document.getElementById('datos').textContent);
 let actual=1;
 const $=(s)=>document.querySelector(s);
 const sitio=$('#zona-activa');
 const categorias={Edificios:'edificios',Deportes:'deportes',Exteriores:'exteriores'};
 function nodo(tipo,clase,contenido){let e=document.createElement(tipo);if(clase)e.className=clase;if(contenido!==undefined)e.textContent=contenido;return e;}
 function cambia(id){
  const zona=ZONAS.find(z=>z.id===id);if(!zona)return;
  actual=id;
  document.querySelectorAll('[data-zona]').forEach(b=>{const activo=Number(b.dataset.zona)===id;b.setAttribute('aria-pressed',String(activo));});
  sitio.replaceChildren();
  const cabeza=nodo('div','ficha-top'); const numero=nodo('span','num '+categorias[zona.category],zona.id);numero.setAttribute('aria-hidden','true');
  const tit=nodo('div');tit.append(nodo('div','meta',zona.category),nodo('h2',null,zona.name));cabeza.append(numero,tit);sitio.append(cabeza);
  const cuerpo=nodo('div','ficha-main');const galeria=nodo('div','foto-grid');
  if(zona.pictures.length){zona.pictures.forEach((p,i)=>{const fig=document.createElement('figure');const a=document.createElement('a');a.href='assets/fotos/'+p;a.target='_blank';a.rel='noopener';a.title='Abrir fotografía real en tamaño grande';const im=document.createElement('img');im.src='assets/fotos/'+p;im.alt='Fotografía real de '+zona.name+' ('+(i+1)+')';im.loading='lazy';a.append(im);fig.append(a);galeria.append(fig);});}
  else{galeria.append(nodo('div','sin-foto','Fotografía real pendiente de incorporar'));}
  const texto=nodo('div','texto');texto.append(nodo('p','principal',zona.short),nodo('p',null,zona.details));texto.append(nodo('p','nota',zona.photo_caption));
  const nav=nodo('div','arrows');const anterior=nodo('button',null,'← Anterior');const siguiente=nodo('button',null,'Siguiente →');anterior.type=siguiente.type='button';anterior.addEventListener('click',()=>cambia(id===1?9:id-1));siguiente.addEventListener('click',()=>cambia(id===9?1:id+1));nav.append(anterior,siguiente);texto.append(nav);cuerpo.append(galeria,texto);sitio.append(cuerpo);
 }
 const mapa=$('#mapa');const lista=$('#accesos');
 const imagen=mapa.querySelector('img');
 // Coordenadas en píxeles de la imagen base; el navegador conserva su proporción.
 const ancho=Number(imagen.getAttribute('width')), alto=Number(imagen.getAttribute('height'));
 for(const zona of ZONAS){
  let b=nodo('button','hotspot '+categorias[zona.category]);
  const numero=nodo('span','hotspot-num',zona.id);numero.setAttribute('aria-hidden','true');
  const etiqueta=nodo('span','hotspot-label',zona.name);etiqueta.setAttribute('aria-hidden','true');b.append(numero,etiqueta);
  b.setAttribute('aria-controls','zona-activa');b.type='button';b.dataset.zona=zona.id;b.setAttribute('aria-label',zona.id+': '+zona.name);b.setAttribute('aria-pressed','false');b.style.left=(zona.coords[0]/ancho*100)+'%';b.style.top=(zona.coords[1]/alto*100)+'%';b.addEventListener('click',()=>cambia(zona.id));mapa.append(b);
  const item=nodo('button','chip '+categorias[zona.category]);item.type='button';item.dataset.zona=zona.id;item.setAttribute('aria-pressed','false');item.setAttribute('aria-label',zona.id+': '+zona.name);item.setAttribute('aria-controls','zona-activa');item.title=zona.name;const n=nodo('span',null,zona.id);item.append(n,nodo('span','chip-name sr-only',zona.name));item.addEventListener('click',()=>cambia(zona.id));lista.append(item);
 }
 cambia(1);
})();
