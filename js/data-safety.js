/* Untrusted profile files and product fields remain data, never executable markup. */
(function(root){
'use strict';
const forbidden=new Set(['__proto__','prototype','constructor']);
const textKeys=new Set(['name','title','brand','brandName','wirk','notes','truth','store','subtitle','cf_basis']);
function plain(value){return String(value??'').replace(/</g,'‹').replace(/>/g,'›').replace(/"/g,'”').replace(/'/g,'’').replace(/`/g,'’').replace(/\\/g,'/');}
function clean(value,key='',depth=0){
 if(depth>18)throw Error('Zu stark verschachtelte Datei');
 if(value===null||typeof value==='boolean'||typeof value==='number')return value;
 if(typeof value==='string'){
  if(value.length>20000)throw Error('Text zu lang');
  if(['id','activeProfileId'].includes(key)&&(!/^[a-zA-Z0-9_-]{1,120}$/.test(value)||forbidden.has(value)))throw Error('Ungültige Kennung');
  if(['url','img','image_url','appLink','sourceUrl'].includes(key)){if(!value)return '';try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch{return '';}}
  return textKeys.has(key)?plain(value):value;
 }
 if(Array.isArray(value)){if(value.length>3000)throw Error('Zu viele Einträge');return value.map(x=>clean(x,key,depth+1));}
 if(typeof value==='object'){const out={};for(const [k,v]of Object.entries(value)){if(forbidden.has(k))throw Error('Ungültiges Datenfeld');out[k]=clean(v,k,depth+1);}return out;}
 throw Error('Ungültige Daten');
}
function snapshot(value){const v=clean(value);if(!v||Array.isArray(v)||typeof v!=='object')throw Error('Ungültiges Profil');
 const slots=['am','pm_a','pm_b','pm_c','reiniger','creme','spf','haar','windel','active'];
 function lists(data){if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Ungültige Routinen');for(const k of slots)if(k in data&&(!Array.isArray(data[k])||data[k].some(id=>typeof id!=='string'||!/^[a-zA-Z0-9_-]{1,120}$/.test(id)||forbidden.has(id))))throw Error('Ungültige Produktliste');}
 lists(v);for(const cat of ['baby','child','teen'])if(v[cat])lists(v[cat]);
 if(v.tags&&(!Array.isArray(v.tags)||v.tags.some(x=>typeof x!=='string')))throw Error('Ungültige Tags');
 if(v.profiles){if(!Array.isArray(v.profiles)||v.profiles.length>30)throw Error('Ungültige Profile');for(const p of v.profiles){if(!p||!['adult','teen','child','baby'].includes(p.category)||typeof p.name!=='string')throw Error('Ungültiges Profil');if(p.tags&&(!Array.isArray(p.tags)||p.tags.some(x=>typeof x!=='string')))throw Error('Ungültige Tags');if(p.data)lists(p.data);}}
 if(v.customProducts){if(Array.isArray(v.customProducts)||typeof v.customProducts!=='object')throw Error('Ungültiger Produktkatalog');for(const [id,p]of Object.entries(v.customProducts)){if(!/^[a-zA-Z0-9_-]{1,120}$/.test(id)||!p||typeof p.name!=='string')throw Error('Ungültiges Produkt');p.id=id;delete p.evidence;}}
 return v;
}
root.KokoroData={plain,clean,snapshot};if(typeof module!=='undefined')module.exports=root.KokoroData;
})(typeof window!=='undefined'?window:globalThis);
