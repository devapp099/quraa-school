(function(root){
'use strict';
function randomIndex(n){if(!Number.isInteger(n)||n<1||n>4294967296)throw Error('Invalid pool');const a=new Uint32Array(1),limit=Math.floor(4294967296/n)*n;do{crypto.getRandomValues(a)}while(a[0]>=limit);return a[0]%n;}
function eligible(lists,session){const won=new Set(session.results.map(x=>x.id)),seen=new Set();return lists.filter(l=>session.listIds.includes(l.id)).flatMap(l=>l.participants.map(p=>({...p,listId:l.id,listTitle:l.title}))).filter(p=>!won.has(p.id)&&!seen.has(p.id)&&seen.add(p.id));}
function choose(lists,session,mode){const pool=eligible(lists,session);if(!pool.length)return null;if(mode==='round'){const available=session.listIds.filter(id=>pool.some(p=>p.listId===id));let selected=available[0];for(let k=0;k<session.listIds.length;k++){const id=session.listIds[(session.cursor+k)%session.listIds.length];if(available.includes(id)){selected=id;break;}}const subset=pool.filter(p=>p.listId===selected);return {person:subset[randomIndex(subset.length)],nextCursor:(session.listIds.indexOf(selected)+1)%session.listIds.length};}return {person:pool[randomIndex(pool.length)],nextCursor:session.cursor};}
const engine={randomIndex,eligible,choose};if(typeof module!=='undefined')module.exports=engine;else root.QuraaEngine=engine;
})(globalThis);
