const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
let data = fs.readFileSync(file, 'utf8');
const needle = 'const content = `';
const startIdx = data.indexOf(needle);
if (startIdx === -1) { console.error('needle not found'); process.exit(1); }
let startBacktick = startIdx + needle.length - 1;
function isEscaped(pos){ let bs=0,j=pos-1; while(j>=0 && data[j]=='\\'){bs++; j--; } return bs%2===1; }
let endBacktick = -1; for(let i=startBacktick+1;i<data.length;i++){ if (data[i]=='`' && !isEscaped(i)){ endBacktick=i; break; } }
if (endBacktick===-1){ console.error('closing backtick not found'); process.exit(2); }
const notifyMarker = '/* ══ NOTIFY ══ */';
const notifyIdx = data.indexOf(notifyMarker, endBacktick);
if (notifyIdx === -1){ console.error('notify marker not found'); process.exit(3); }
const correctMiddle = '\n      printWindow.document.write(content);\n      printWindow.document.close();\n      printWindow.focus();\n      setTimeout(() => printWindow.print(), 300);\n    \n    ';
// Replace content between endBacktick+1 and notifyIdx with correctMiddle
const newData = data.slice(0, endBacktick+1) + ';' + correctMiddle + data.slice(notifyIdx);
fs.writeFileSync(file, newData, 'utf8');
console.log('Patched file.');
