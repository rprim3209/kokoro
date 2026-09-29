const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
test('profile switches preserve each screen and render exactly once for all categories',()=>{
 const src=fs.readFileSync(path.join(__dirname,'../js/state.js'),'utf8');const fn=src.slice(src.indexOf('function switchProfile('),src.indexOf('function updateCategoryNav('));
 for(const view of ['settings','start','cabinet','scan'])for(const category of ['adult','teen','child','baby']){
  let renders=0,saves=0;const state={view,profiles:[{id:'target',category}]};
  const c=vm.createContext({appState:state,syncActiveProfileFromWorkingState(){},loadProfileToAppState(p){state.activeProfileId=p.id;state.profile=p.category},saveState(){saves++},updateCategoryNav(){},updateBottomNav(){},renderCurrentScreen(){renders++;assert.equal(state.view,view)}});
  vm.runInContext(fn,c);c.switchProfile('target');assert.equal(state.activeProfileId,'target');assert.equal(state.view,view);assert.equal(renders,1);assert.equal(saves,1);
 }
});
