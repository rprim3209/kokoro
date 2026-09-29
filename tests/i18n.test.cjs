const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function context(){const c=vm.createContext({});for(const file of ['i18n.js','i18n-current.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../js',file),'utf8'),c);return c;}
test('every quiz question, answer and description has an explicit English translation',()=>{
 const c=context();vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/screens/quiz.js'),'utf8').split('let quizTrack')[0],c);
 const values=vm.runInContext('[...QUIZ_BABY,...QUIZ_CHILD,...QUIZ_TEEN,...QUIZ_BEGINNER,...QUIZ_PRO].flatMap(q=>[q.q,...q.opts.flatMap(o=>[o.k,o.d])])',c);
 for(const value of values)assert.ok(c.I18N_EN[value],'Missing English translation: '+value);
});
test('dynamic translations retain names and counts without mixed-language fragments',()=>{
 const c=context();
 assert.equal(c.translateString('PFLEGEPLAN FÜR Kind'),'SKINCARE PLAN FOR Kind');
 assert.equal(c.translateString('Profil Morgen bearbeiten'),'Edit profile Morgen');
 assert.equal(c.translateString('24 von 1010 Katalogeinträgen · 24 angezeigt'),'24 of 1010 catalogue entries · 24 shown');
 assert.equal(c.translateString('2 gemeinsam geprüft · 3 zeitlich getrennt'),'2 checked together · 3 used at separate times');
 assert.match(c.translateString('Noch nicht abgedeckt: Sonnenschutz, Feuchtigkeit. Deine gewählte Produktanzahl und dein Budget bleiben trotzdem verbindlich.'),/^Not yet covered: sun protection, moisturising\./);
});
test('translation restores original German and accepts subsequently changed DOM text',()=>{
 const c=context();let lang='en';const parent={tagName:'P',closest:()=>false};const node={parentElement:parent,nodeValue:'Deine Routine'};
 const root={querySelectorAll:()=>[]};c.localStorage={getItem:()=>lang};c.NodeFilter={SHOW_TEXT:4};c.document={createTreeWalker:()=>{let done=false;return {nextNode:()=>done?null:(done=true,node)};},documentElement:{},getElementById:()=>null};
 c.applyI18n(root);assert.equal(node.nodeValue,'Your routine');
 lang='de';c.applyI18n(root);assert.equal(node.nodeValue,'Deine Routine');
 node.nodeValue='Produktkatalog';lang='en';c.applyI18n(root);assert.equal(node.nodeValue,'Product catalogue');
 lang='de';c.applyI18n(root);assert.equal(node.nodeValue,'Produktkatalog');
});
