const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
const s = fs.readFileSync(file, 'utf8');
const needle = 'const content = `';
let idx = s.indexOf(needle);
if (idx === -1) { console.log('Needle not found'); process.exit(1); }
const start = idx + needle.length - 1;
function isEscaped(pos) { let bs=0,j=pos-1; while(j>=0 && s[j]=='\\'){bs++; j--; } return bs%2===1; }
let end=-1; for(let i=start+1;i<s.length;i++){ if (s[i]=='`' && !isEscaped(i)){ end=i; break; } }
if (end===-1){ console.log('Closing not found'); process.exit(2); }
const before = s.slice(end-20,end).replace(/\n/g,'\\n');
const after = s.slice(end,end+40).replace(/\n/g,'\\n');
console.log('end index', end);
console.log('before:', before);
console.log('after:', after);
console.log('char codes around:');
for(let k=end-5;k<end+20;k++){ const ch=s[k]; const code = s.charCodeAt(k); console.log(k, code, JSON.stringify(ch)); }
console.log('Full context (80 chars):', s.slice(end-40,end+80).replace(/\n/g,'\\n'));
