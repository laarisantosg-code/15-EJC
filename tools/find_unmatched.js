const fs=require('fs');const path=require('path');const s=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');const open='<script';let idx=0;let scriptCount=0;while(true){let o=s.indexOf(open,idx); if(o===-1) break; let startTagEnd=s.indexOf('>',o); let close=s.indexOf('</script>',startTagEnd); if(close===-1) break; const content=s.slice(startTagEnd+1,close); scriptCount++; const stack=[]; let escaped=false; for(let i=0;i<content.length;i++){ const ch=content[i]; if(ch==='\\' && !escaped){ escaped=true; continue; } if(ch==='`' && !escaped){ // skip template literal content
   // consume until matching backtick not escaped
   i++; while(i<content.length){ if(content[i]==='\\'){ i+=2; continue;} if(content[i]==='`') break; i++; }
   escaped=false; continue;
 }
 escaped=false;
 if(ch==='{' ) stack.push({ch:'{',i});
 else if(ch==='}'){
   if(stack.length && stack[stack.length-1].ch==='{') stack.pop(); else { console.log('Unmatched closing } at', i); }
 }
}
 if(stack.length) {
   console.log('Script', scriptCount, 'has', stack.length, 'unmatched opening { at positions:');
   stack.forEach(it=>{ const before = content.slice(Math.max(0,it.i-40), Math.min(content.length, it.i+40)).replace(/\n/g,'\\n'); console.log(it.i, before); });
 } else console.log('Script', scriptCount, 'balanced');
 idx=close+9; }
