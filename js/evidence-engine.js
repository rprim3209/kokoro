/* One deterministic compatibility model for scan, product details and routines.
 * Sources justify the stated scope, never a guarantee of individual tolerance.
 */
(function(root) {
  'use strict';
  const sources = {
    differin: {title:'Differin · Fachinformation, 4.5',url:'https://www.medicines.org.uk/emc/product/921/smpc',kind:'Fachinformation'},
    nice: {title:'NICE NG198 · Akne',url:'https://www.nice.org.uk/guidance/ng198/chapter/Recommendations',kind:'Leitlinie'},
    aad: {title:'AAD · Akneleitlinie 2024',url:'https://www.aad.org/news/updated-guidelines-acne-management',kind:'Leitlinie'},
    ema: {title:'EMA · Retinoide und Schwangerschaft',url:'https://www.ema.europa.eu/en/news/updated-measures-pregnancy-prevention-during-retinoid-use',kind:'Behörde'},
    comedo: {title:'Draelos & DiNardo 2006 · fertige Formulierungen',url:'https://pubmed.ncbi.nlm.nih.gov/16488305/',kind:'Humanstudie · begrenzter Umfang'},
    twyneo: {title:'TWYNEO · formulierte Tretinoin/BPO-Kombination',url:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=27208dff-e376-4c18-b56e-0a260f685a39',kind:'US-Fachinformation · keine EU-Freigabe'}
  };
  const labels={konflikt:'Nicht anwenden · Grund beachten',eher_nicht:'Mit Vorsicht kombinieren',unbekannt:'Basischeck · kein bekannter Konflikt',passt:'Kein hinterlegter Konflikt erkannt'};
  const ranks={passt:0,unbekannt:1,eher_nicht:2,konflikt:3};
  function normalize(p) {
    p=p||{};
    const text=[p.name,p.wirk,Array.isArray(p.inci)?p.inci.join(', '):p.inci].filter(Boolean).join(' ').toLowerCase();
    const groups=new Set(p.klassen||p.groups||[]);
    if(p.kat==='reiniger'||p.slot==='reiniger')groups.add('cleansing');
    if(p.kat==='spf'||p.slot==='spf')groups.add('sunscreen');
    const derivative=/ascorbyl|ethyl.?ascorb|ascorbyl glucoside|magnesium ascorbyl|sodium ascorbyl/.test(text);
    if(derivative){groups.delete('ascorbic');groups.add('vitamin_c_derivative');}
    if(/\badapalen[e]?\b|\bepiduo\b|\bdifferin\b/.test(text)) groups.add('retinoid_rx');
    if(/\btretinoin\b/.test(text)){groups.add('retinoid_rx');groups.add('tretinoin');}
    const ret=groups.has('retinoid_rx')||groups.has('retinoid_cos')||groups.has('retinoid');
    return {raw:p,id:p.id||'',name:p.name||'Produkt ohne Namen',groups,ret,rx:!!p.rx||groups.has('retinoid_rx'),rinse:p.rinseOff===true||p.kat==='reiniger',complete:p.evidence?.formulaVerified===true&&!!p.evidence?.sourceUrl,derivative};
  }
  function assess(input={}) {
    const items=(input.products||[]).filter(Boolean).filter((p,i,a)=>!p.id||a.findIndex(x=>x.id===p.id)===i).map(normalize);
    const profile=input.profile||{};const findings=[];const missing=[];let paired=0,separated=0;
    const add=(id,severity,title,reason,action,ps,source,evidence='Vorsichtshinweis')=>findings.push({id,severity,title,reason,action,productIds:ps.map(p=>p.id),products:ps.map(p=>p.name),source:source?sources[source]:null,evidence,reviewedAt:'2026-09-28'});
    for(const p of items){
      if(!p.complete)missing.push(p.name+': Rezeptur und Datenstand nicht vollständig verifiziert.');
      if(profile.pregnancy===true&&p.groups.has('retinoid_rx')) add('rx-pregnancy','konflikt','Medizinisches Retinoid bei Schwangerschaft',p.name+' enthält ein medizinisches Retinoid. Diese Arzneistoffe dürfen in Schwangerschaft und bei Schwangerschaftsplanung nicht angewendet werden.','Nicht anwenden und die behandelnde Praxis kontaktieren.',[p],'ema','Dokumentierte Gegenanzeige');
      if(['baby','child','teen'].includes(profile.category)&&(p.ret||p.groups.has('bpo')||p.groups.has('aha')||p.groups.has('bha'))) add('age-review','unbekannt','Altersfreigabe prüfen','Für '+p.name+' ist hier keine verifizierte, altersbezogene Anwendung hinterlegt.','Packungsangaben und bei Arzneimitteln den ärztlichen Plan prüfen. Keine automatische Wirkstoffempfehlung.',[p],null,'Prüfgrenze');
      if(p.groups.has('ab_top')&&!items.some(x=>x.groups.has('bpo')))add('antibiotic-plan','eher_nicht','Behandlungsplan prüfen','Ein topisches Antibiotikum ist erfasst. Antibiotika sollten nicht allein gegen Akne verwendet werden. Der Schrank bildet den verordneten Plan möglicherweise nicht vollständig ab.','Verordnung mit der Praxis abgleichen; BPO nicht eigenständig hinzufügen.',[p],'aad','Leitlinienhinweis');
      if(p.rx)add('rx-plan','unbekannt','Arzneimittel: Verordnung hat Vorrang','Die App prüft keine Dosierung, vollständigen Wechselwirkungen oder persönliche Arzneimittel-Eignung.','Anwendung nach Fachinformation und ärztlichem Plan.',[p],null,'Prüfgrenze');
    }
    for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
      const a=items[i],b=items[j];const co=input.coApplication?input.coApplication(a.id,b.id):{together:true};
      if(!co.together){separated++;continue;}
      paired++;
      const g=(p,k)=>p.groups.has(k),acid=p=>g(p,'aha')||g(p,'bha');const pair=[a,b];
      if((g(a,'tretinoin')&&g(b,'bpo'))||(g(b,'tretinoin')&&g(a,'bpo')))add('tret-bpo','eher_nicht','Formulierung entscheidet','BPO kann die Stabilität bestimmter Tretinoin-Formulierungen beeinträchtigen. Stabilisierte Kombinationen existieren; für diese beiden Produkte fehlt der passende Nachweis.','Konkrete Präparate und Anwendung in der Apotheke oder Praxis prüfen.',pair,'twyneo','Formulierungsabhängig');
      else if((a.ret&&g(b,'bpo'))||(b.ret&&g(a,'bpo')))add('ret-bpo','eher_nicht','Zusätzliche Reizung möglich','Zwei getrennte Produkte mit Retinoid und BPO sind derselben Anwendung zugeordnet. Das ist kein pauschales chemisches Verbot; Reizung ist möglich.','Verordneten Plan beachten und Verträglichkeit mit der Praxis besprechen.',pair,'differin');
      if((a.ret&&acid(b))||(b.ret&&acid(a)))add('ret-acid','eher_nicht','Peeling neben Retinoid','Zusätzliche peelende Produkte können die Reizung unter Retinoiden verstärken. Konzentration, Kontaktzeit und Gewöhnung sind hier nicht ausreichend bekannt.','Zusätzliche Peelings vor der Anwendung prüfen; bei Therapie die Praxis einbeziehen.',pair,'differin');
      if((a.ret&&b.ret)||(acid(a)&&acid(b)))add('duplicate-active','eher_nicht','Wirkstoffwirkung überschneidet sich','Mehrere Retinoid- oder Peelingprodukte in einer Anwendung können die Belastung erhöhen. Die Stoffklasse allein beweist keinen Schaden.','Konzentration und Anwendung vergleichen; ein weiteres Wirkstoffprodukt nicht automatisch ergänzen.',pair,null,'Vorsichtsheuristik · nicht klinisch validiert');
      if((g(a,'bpo')&&g(b,'ascorbic'))||(g(b,'bpo')&&g(a,'ascorbic')))add('bpo-laa','unbekannt','Stabilität nicht belegt','Für diese konkrete BPO/Ascorbinsäure-Kombination ist kein passender Stabilitätsnachweis hinterlegt.','Hersteller- oder Fachinformation zur konkreten Kombination prüfen.',pair,null,'Evidenzlücke');
    }
    if(!items.length)missing.push('Noch keine Produkte für einen Kombinationscheck vorhanden.');
    if(input.unresolved?.length)missing.push('Gespeicherte Produkte konnten noch nicht geladen werden.');
    const baseline=missing.length?'unbekannt':'passt';
    const verdict=findings.reduce((v,f)=>ranks[f.severity]>ranks[v]?f.severity:v,baseline);
    findings.sort((a,b)=>ranks[b.severity]-ranks[a.severity]);
    const basicChecked=items.length>0&&items.every(p=>p.groups.size>0)&&!input.unresolved?.length;
    const checkStatus=findings.length?verdict:(basicChecked?'passt':'unbekannt');
    return {coverage:{recognized:items.filter(p=>p.groups.size>0).length,total:items.length,paired,separated,verified:items.filter(p=>p.complete).length},checkStatus,basicChecked,version:'evidence-1.0.0',verdict,title:!items.length?'Deine Routine ist noch leer':(verdict==='unbekannt'&&findings.length?findings[0].title:labels[verdict]),findings,missing,products:items.map(x=>x.raw),scope:'Orientierung zu hinterlegten Regeln. Keine Garantie individueller Verträglichkeit.',empty:!items.length};
  }
  const api={assess,normalize,labels,sources,ranks};root.KokoroEvidence=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
