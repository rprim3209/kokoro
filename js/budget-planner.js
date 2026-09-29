(function(root){'use strict';
function plan({budget,maxProducts,candidates,owned=[]}){
 const cap=Math.min(5,Math.max(1,Number(maxProducts)||3));const ceiling=Math.max(0,Math.round((Number(budget)||0)*100));const ownedSet=new Set(owned);const seen=new Set();
 const pool=candidates.filter(p=>{if(!p||!p.id||seen.has(p.id))return false;seen.add(p.id);return (!p.rx||ownedSet.has(p.id))&&(ownedSet.has(p.id)||(Number.isFinite(p.price)&&p.price>0));}).map(p=>({...p,owned:ownedSet.has(p.id),cost:ownedSet.has(p.id)?0:Math.round(p.price*100)}));
 const rank=p=>ownedSet.has(p.id)?-1000+owned.indexOf(p.id):({spf:0,reiniger:1,creme:2}[p.slot]??3);
 pool.sort((a,b)=>rank(a)-rank(b)||a.cost-b.cost||a.id.localeCompare(b.id));
 let spent=0;const products=[];const slots=new Set();for(const p of pool){if(products.length>=cap)break;if(!p.owned&&slots.has(p.slot))continue;if(spent+p.cost>ceiling)continue;products.push(p);spent+=p.cost;slots.add(p.slot);}
 const missing=['spf','reiniger','creme'].filter(s=>!slots.has(s));
 return {budget:ceiling/100,maxProducts:cap,products,totalCost:spent/100,savings:(ceiling-spent)/100,missing,overLimit:owned.length>cap};
}root.KokoroBudget={plan};if(typeof module!=='undefined')module.exports=root.KokoroBudget;
})(typeof window!=='undefined'?window:globalThis);
