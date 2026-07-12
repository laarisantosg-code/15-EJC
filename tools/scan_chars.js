const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
const data = fs.readFileSync(file, 'utf8');
let found = false;
for (let i=0;i<data.length;i++){
  const code = data.charCodeAt(i);
  if ((code>=0 && code<=8) || (code>=11 && code<=12) || (code>=14 && code<=31) || code===0x2028 || code===0x2029){
    found = true;
    const start = Math.max(0, i-40);
    const end = Math.min(data.length, i+40);
    const snippet = data.slice(start,end).replace(/\n/g,'\\n');
    const line = data.slice(0,i).split('\n').length;
    console.log(`Char at index ${i} code ${code} line ${line}: ...${snippet}...`);
  }
}
if(!found) console.log('No suspicious control characters found');
else process.exit(2);
