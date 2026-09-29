'use strict';
// Progressive enhancement: existing routing, scanner and profile storage remain intact.
(function(){
const icons={start:'<path d="m3 11 9-8 9 8v10h-6v-7H9v7H3z"/>',cabinet:'<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M4 12h16M12 3v18M9 8v1m6 7v1"/>',scan:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8v8m4-8v8m4-8v8"/>',settings:'<circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>'};
let returnFocus=null;
function polish(){
 for(const [name,path] of Object.entries(icons)){const b=document.getElementById('navTab_'+name);if(!b)continue;const icon=b.querySelector('.tab-icon');if(icon&&!icon.querySelector('svg'))icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';b.setAttribute('aria-current',b.classList.contains('active')?'page':'false');}
 const main=document.getElementById('appContent');
 main.classList.toggle('routine-layout',appState.view==='cabinet');main.classList.toggle('home-layout',appState.view==='start');
 const tabs=main.querySelector('.routine-tabs');
 if(appState.view==='cabinet') {
   if(tabs&&!tabs.dataset.ordered){tabs.dataset.ordered='true';main.prepend(tabs);const title=document.createElement('h1');title.className='cabinet-title';title.textContent='Deine Routine';main.prepend(title);}
   if(!main.querySelector('.cabinet-title')){const heading=document.createElement('h1');heading.className='cabinet-title';heading.textContent='Deine Routine';main.prepend(heading);}
   const hero=main.querySelector('.scan-hero');
   if(hero&&!hero.dataset.refined){hero.dataset.refined='true';const add=hero.querySelector('button');if(add){hero.replaceChildren(add);hero.className='routine-add-row';hero.removeAttribute('style');if(tabs)tabs.after(hero);}}
   main.querySelectorAll('button[onclick="openScanModal()"],button[onclick="switchScreen(\'scan\')"]').forEach(b=>b.remove());
   const bar=main.querySelector('.profile-bar');
   if(bar&&!bar.closest('.profile-details')){const details=document.createElement('details');details.className='profile-details';const summary=document.createElement('summary');summary.textContent='Hautprofil & Pflegeziele';details.append(summary);bar.before(details);details.append(bar);main.append(details);}
   if(main.querySelector('.empty-shelf'))main.querySelector('.routine-add-row')?.remove();
   const list=main.querySelector('.step-list')||main.querySelector('.empty-shelf');const evidence=main.querySelector('.evidence-card');
   if(list&&evidence&&!evidence.dataset.ordered){evidence.dataset.ordered='true';list.after(evidence);}
 }
 if(appState.view==='cabinet'&&!main.querySelector('.routine-primary')){
 const primary=document.createElement('div'),secondary=document.createElement('div');primary.className='routine-primary';secondary.className='routine-secondary';
 for(const child of [...main.children]){(child.matches('.cabinet-title,.routine-tabs,.routine-add-row,.step-list,.empty-shelf,.simple-pm-bar,.mode-switcher')?primary:secondary).append(child);}
 main.append(primary,secondary);
 }
 }
 function polishModal(){
 const sheet=document.querySelector('.sheet');document.body.classList.toggle('sheet-open',!!sheet);
 if(sheet&&!sheet.querySelector('.sheet-close')){returnFocus=document.activeElement;sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');sheet.setAttribute('aria-label','Produkt und Routine');const close=document.createElement('button');close.className='sheet-close';close.setAttribute('aria-label','Schließen');close.textContent='×';close.onclick=closeModal;sheet.prepend(close);close.focus();const grip=sheet.querySelector('.sheet-handle');if(grip)installSheetDrag(grip,sheet);}
}
const observer=new MutationObserver(polishModal);observer.observe(document.getElementById('modalContainer'),{childList:true,subtree:true});
window.applyScreenLayout=polish;
document.addEventListener('keydown',e=>{const sheet=document.querySelector('.sheet');if(!sheet)return;if(e.key==='Escape'){closeModal();returnFocus?.focus();}if(e.key==='Tab'){const els=[...sheet.querySelectorAll('button,input,select,textarea,a[href],summary')].filter(x=>!x.disabled&&x.getClientRects().length);const first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&typeof stopBarcodeScanner==='function')stopBarcodeScanner();});window.addEventListener('pagehide',()=>{if(typeof stopBarcodeScanner==='function')stopBarcodeScanner();});
function installSheetDrag(grip,sheet){
 let start=null,delta=0;grip.style.touchAction='none';grip.setAttribute('aria-label','Zum Schließen nach unten ziehen');
 grip.addEventListener('pointerdown',e=>{start=e.clientY;delta=0;grip.setPointerCapture(e.pointerId);sheet.style.transition='none';});
 grip.addEventListener('pointermove',e=>{if(start===null)return;delta=Math.max(0,e.clientY-start);sheet.style.transform='translateY('+delta+'px)';});
 const finish=()=>{if(start===null)return;start=null;sheet.style.transition='transform .18s ease';if(delta>80){closeModal();returnFocus?.focus();}else sheet.style.transform='';};
 grip.addEventListener('pointerup',finish);grip.addEventListener('pointercancel',()=>{delta=0;finish();});
}
document.addEventListener('DOMContentLoaded',()=>{polish();polishModal();});polish();polishModal();
})();
function showUndoToast(message){const toast=document.getElementById('appToast');if(!toast)return;clearTimeout(window._toastTimer);toast.replaceChildren(document.createTextNode(message+' '));const button=document.createElement('button');button.textContent='Rückgängig';button.onclick=()=>{window.kokoroUndo?.();window.kokoroUndo=null;toast.classList.remove('show');};toast.append(button);toast.classList.add('show');window._toastTimer=setTimeout(()=>{toast.classList.remove('show');window.kokoroUndo=null;},10000);}
