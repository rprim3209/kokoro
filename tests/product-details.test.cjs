const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
function context(){
 const c=vm.createContext({window:{location:{protocol:'http:'}},console,appState:{profile:'adult'},getActiveProfile:()=>({category:'adult'})});
 for(const file of ['catalog.js','evidence-ui.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',file),'utf8'),c);
 vm.runInContext('resolveProfileCabinetProduct=id=>DB[id]||EU_FLAG_CATALOG[id]',c);return c;
}
test('alternatives use real catalogue candidates, excluding self, water, duplicates and prescriptions',()=>{
 const c=context();const items=vm.runInContext('evidenceAlternatives("baleaCreme")',c);
 assert.ok(items.length>0);assert.ok(items.every(x=>x.candidate.id!=='baleaCreme'&&x.candidate.kat==='creme'&&x.candidate.schiene!=='rx'));
 const names=items.map(x=>(x.candidate.brand+x.candidate.name).toLowerCase().replace(/[^\p{L}\p{N}]/gu,''));assert.equal(new Set(names).size,names.length);
 assert.ok(vm.runInContext('evidenceAlternatives("baleaWash").every(x=>!["water","wasser"].includes(x.candidate.id))',c));
});
test('alternatives respect profile filters and honestly return empty when none qualify',()=>{
 const c=context();c.quizCandidateMatches=()=>false;assert.equal(vm.runInContext('evidenceAlternatives("baleaCreme").length',c),0);
});
test('ingredient display supports stored schemas without treating active summaries as INCI',()=>{
 const c=context();assert.equal(c.productIngredients({inci:['Aqua','Glycerin']}),'Aqua, Glycerin');
 assert.equal(c.productIngredients({ingredients_text:'Aqua, Panthenol'}),'Aqua, Panthenol');
 assert.equal(c.productIngredients({ingredients:[{text:'Aqua'},{name:'Glycerin'}]}),'Aqua, Glycerin');
 assert.equal(c.productIngredients({wirk:'Panthenol + Cica'}),'');
});
