/* Adapter keeps all existing navigation/profile/scanner flows on one assessment. */
function evidenceProfile(){const p=typeof getActiveProfile==='function'?getActiveProfile():null;return {category:p?.category||appState.profile||'adult',pregnancy:p?.pregnancy===true};}
function evidenceResolve(id){return typeof resolveProfileCabinetProduct==='function'?resolveProfileCabinetProduct(id):resolveCabinetProduct(id);}
function evidenceAssess(ids,candidate,slot){
  const unique=[...new Set(ids||[])];const products=unique.map(evidenceResolve).filter(Boolean);if(candidate&&!products.some(p=>p.id===candidate.id))products.push(candidate);
  return KokoroEvidence.assess({products,profile:evidenceProfile(),unresolved:unique.filter(id=>!evidenceResolve(id)),coApplication:(a,b)=>{
    if(candidate&&(a===candidate.id||b===candidate.id))return {together: slot==='am'||slot==='pm'};
    return evidenceProfile().category==='adult'?getProductCoApplicationInfo(a,b):{together:true};
  }});
}
function evidenceCurrentIds(){return getFullCabinetProductIds().filter(id=>!['wasser','water'].includes(id));}
function evidenceResult(candidate,slot){
  let ids=evidenceCurrentIds();
  if(candidate){const category=evidenceProfile().category;if(category==='adult')ids=slot==='am'?(appState.am||[]):getActivePMList();}
  return evidenceAssess(ids,candidate,slot);
}
function evidenceStatus(v){return {passt:'ok',unbekannt:'unknown',eher_nicht:'warn',konflikt:'no'}[v]||'unknown';}
function evidenceReason(r){return r.findings[0]?.reason||(!r.empty&&r.checkStatus==='unbekannt'?'Nicht alle Produkte sind ausreichend zugeordnet. Der Check kann deshalb noch kein grünes Ergebnis anzeigen.':r.empty?'Füge deine Produkte hinzu. Danach vergleichen wir ihre Wirkstoffgruppen.':'Die erfassten Wirkstoffgruppen lösen in deiner geplanten Anwendung keine Konfliktregel aus.');}
function evidenceCoverage(r){const c=r.coverage;if(!c||r.empty)return '';return '<dl class="check-coverage"><div><dt>Wirkstoffgruppen</dt><dd>'+c.recognized+' von '+c.total+' Produkten erfasst</dd></div><div><dt>Kombinationen</dt><dd>'+c.paired+' gemeinsam geprüft · '+c.separated+' zeitlich getrennt</dd></div><div><dt>Vollständige Rezeptur</dt><dd>'+c.verified+' von '+c.total+' verifiziert</dd></div></dl>';}
function evidenceCard(r){
  const displayStatus=r.checkStatus||r.verdict;const displayTitle=displayStatus==='passt'?'Wirkstoffcheck · kein Konflikt erkannt':(r.empty?r.title:displayStatus==='unbekannt'&&!r.findings.length?'Wirkstoffcheck · Angaben fehlen':r.title);
  return `<section class="evidence-card ${evidenceStatus(displayStatus)}" aria-label="Kombinationscheck"><div class="evidence-heading"><span class="evidence-dot" aria-hidden="true"></span><strong>${escapeHtml(displayTitle)}</strong><span class="evidence-count">${r.products.length} Produkte</span></div><p>${escapeHtml(evidenceReason(r))}</p>${evidenceCoverage(r)}<details ${r.verdict==='konflikt'?'open':''}><summary>${r.verdict==='konflikt'?'Warum rot?':'Warum diese Bewertung?'}</summary><p>Grün: kein Treffer in den hinterlegten Wirkstoffregeln. Gelb: Vorsicht. Rot: konkrete Gegenanzeige. Grau: Angaben fehlen oder eine Fachprüfung ist nötig.</p><p>Geprüft werden erfasste Wirkstoffgruppen, gemeinsame Anwendung und angegebener persönlicher Kontext. Nicht geprüft werden die vollständige Rezeptur, individuelle Allergien oder die tatsächliche Verträglichkeit.</p>${r.findings.map(f=>`<article class="evidence-finding"><strong>${escapeHtml(f.title)}</strong><small>${escapeHtml(f.products.join(' + '))}</small><p>${escapeHtml(f.reason)}</p><p class="evidence-action">${escapeHtml(f.action)}</p><small>${escapeHtml(f.evidence)}${f.source?` · <a href="${escapeHtml(f.source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(f.source.title)}</a>`:''}</small></article>`).join('')}${r.missing.length?`<div class="evidence-missing"><strong>Was noch fehlt</strong><ul>${r.missing.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>`:''}<p class="evidence-scope">${escapeHtml(r.scope)} · Regelstand ${escapeHtml(r.version)}</p></details></section>`;
}
function evidencePrognosis(r){return {evidence:r,empty:r.empty,status:r.empty?'empty':evidenceStatus(r.verdict),verdict:r.verdict,title:r.title,topAlert:evidenceReason(r),points:[escapeHtml(evidenceReason(r))],shortPoints:[escapeHtml(evidenceReason(r))],whyNotes:r.missing.map(escapeHtml),flagged:r.findings.reduce((flags,f)=>{for(const id of f.productIds){if(!flags[id]||KokoroEvidence.ranks[f.severity]>KokoroEvidence.ranks[flags[id].outcome])flags[id]={outcome:f.severity,reason:f.reason};}return flags;},{}),cabinetHits:r.findings};}
function productIngredients(p){
 const raw=p.inci||p.ingredients_text||p.ingredientsText||p.ingredients;
 return Array.isArray(raw)?raw.map(x=>typeof x==='string'?x:x?.text||x?.name||'').filter(Boolean).join(', '):typeof raw==='string'?raw.trim():'';
}
function evidenceProductModal(prodId,tab){
 const p=evidenceResolve(prodId);if(!p)return;
 const inci=productIngredients(p);const r=evidenceResult(p,tab||appState.tab);
 const cAnal=typeof analyzeInciComedogenicity==='function'?analyzeInciComedogenicity(p):null;
 const tex=cAnal?.textureEval||(typeof classifyProductTexture==='function'?classifyProductTexture(p):null);
 const texHtml=tex?`<section class="detail-section"><h3>Textur & Galenik</h3><p><strong style="color:${tex.color}">${escapeHtml(tex.label)}</strong></p><p>${escapeHtml(tex.explanation||'')}</p>${tex.warning?`<p class="evidence-action" style="color:#b45309">${escapeHtml(tex.warning)}</p>`:''}${cAnal&&cAnal.hasInci?`<p style="margin-top:6px;font-size:0.86rem"><span class="tag" style="background:${cAnal.badgeColor};color:${cAnal.textColor};font-weight:600">${escapeHtml(cAnal.label)}</span></p><p style="font-size:0.82rem;color:var(--muted)">${escapeHtml(cAnal.summary)}</p>`:''}</section>`:'';
 showModalSheet(`<div class="detail-heading"><small>${escapeHtml(p.brand||'Produkt')}</small><h2>${escapeHtml(p.name)}</h2></div>
 <section class="detail-section"><h3>Inhaltsstoffe (INCI)</h3>${inci?`<p class="ingredient-list" translate="no">${escapeHtml(inci)}</p><p>Erfasste Liste. Die aktuelle Verpackung ist maßgeblich.</p>`:'<p>Keine vollständige Inhaltsstoffliste hinterlegt. Bitte die aktuelle Verpackung prüfen.</p>'}
 <h4>Erfasste Wirkstoffe</h4><p>${escapeHtml(p.wirk||'Wirkstoffangaben fehlen')}</p><p>Wirkstoffangaben ersetzen keine vollständige Inhaltsstoffliste.</p></section>
 ${texHtml}
 ${evidenceCard(r)}<section class="detail-section"><h3>Produktangaben</h3><p>Parfümfrei: ${p.ff===true?'als Angabe erfasst':p.ff===false?'nein':'unbekannt'} · Nicht komedogen: ${p.nc===true?'Herstellerangabe, keine Verträglichkeitsgarantie':'nicht verifiziert'}</p></section>
 <div class="detail-actions"><button class="detail-secondary" id="detailAlternatives">Ähnliche Alternativen</button><button class="evidence-primary" id="detailAddProduct">Zur Routine hinzufügen</button></div>`);
 document.getElementById('detailAlternatives').onclick=()=>openEvidenceAlternatives(prodId);
 document.getElementById('detailAddProduct').onclick=()=>addCandidateToCabinet(p.id);
}
function evidenceAlternatives(id){
 const target=evidenceResolve(id);if(!target)return [];
 const pool=getCatalogCandidatesPool(evidenceProfile().category);
 const identity=p=>String((p.brand||'')+' '+(p.name||'')).toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
 const seen=new Set([identity(target)]);
 const eligible=Object.fromEntries(Object.entries(pool).filter(([key,p])=>{
  if(!p||p.rx||p.schiene==='rx'||['water','wasser'].includes(p.id)||p.kat!==target.kat)return false;
  if(typeof quizCandidateMatches==='function'&&!quizCandidateMatches(p,getActiveProfile()))return false;
  const name=identity(p);if(seen.has(name))return false;seen.add(name);return true;
 }));
 return findSimilarProducts(target,{pool:eligible,limit:6,category:evidenceProfile().category});
}
function openEvidenceAlternatives(id){
 const target=evidenceResolve(id);if(!target)return;
 const matches=evidenceAlternatives(id);
 showModalSheet(`<h2>Ähnliche Alternativen</h2><p class="alternative-name" translate="no">${escapeHtml(target.brand||'')} · ${escapeHtml(target.name)}</p><p>Ähnliche Pflegekategorie und erfasste Wirkstoffe. Keine Garantie für gleiche Wirkung oder Verträglichkeit. Hinterlegte Profilwünsche werden berücksichtigt.</p><div id="alternativeResults">${matches.length?'':'<p>Keine passende Alternative für dieses Profil im Katalog gefunden.</p>'}</div>`);
 const list=document.getElementById('alternativeResults');
 for(const {candidate:p} of matches){
  const button=document.createElement('button');button.className='alternative-product';
  button.innerHTML=`<strong translate="no">${escapeHtml(p.brand||'')} · ${escapeHtml(p.name)}</strong><small>Inhaltsstoffe und Check ansehen →</small>`;
  button.onclick=()=>evidenceProductModal(p.id);list.append(button);
 }
 if(typeof applyI18n==='function')applyI18n(document.body);
}

function openSafetyContext(){const p=getActiveProfile();showModalSheet(`<h2>Persönlicher Prüfkontext</h2><p>Optional und nur auf diesem Gerät gespeichert. Unbekannte Angaben werden nicht als medizinische Freigabe gewertet.</p><label class="safety-toggle"><input type="checkbox" id="pregnancyContext" ${p?.pregnancy===true?'checked':''}> Schwangerschaft oder Schwangerschaft geplant</label><p class="evidence-scope">Diese Angabe aktiviert den Hinweis zu medizinischen Retinoiden. Die App ersetzt keine Prüfung aller Produkte durch die Praxis.</p><button class="evidence-primary" onclick="saveSafetyContext()">Speichern</button>`);}
function saveSafetyContext(){const p=getActiveProfile();if(p)p.pregnancy=document.getElementById('pregnancyContext').checked;saveState();closeModal();renderCurrentScreen();}
