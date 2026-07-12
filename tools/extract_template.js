const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'index.html');
const data = fs.readFileSync(file, 'utf8');
const needle = 'const content = `';
let idx = data.indexOf(needle);
if (idx === -1) { console.log('Needle not found'); process.exit(1); }
const start = idx + needle.length - 1; // position of the backtick
let i = start + 1;
function isEscaped(pos) {
  let bs = 0; let j = pos - 1;
  while (j >= 0 && data[j] === '\\') { bs++; j--; }
  return bs % 2 === 1;
}
let end = -1;
for (; i < data.length; i++) {
  if (data[i] === '`' && !isEscaped(i)) { end = i; break; }
}
if (end === -1) { console.log('Closing backtick not found'); process.exit(2); }
const content = data.slice(start+1, end);
const before = data.slice(Math.max(0, start-200), start+1).replace(/\n/g,'\\n');
const after = data.slice(end, Math.min(data.length, end+200)).replace(/\n/g,'\\n');
const line = data.slice(0, start).split('\n').length;
console.log('Found template at approx line', line);
console.log('Start preview:', before);
console.log('End preview:', after);
console.log('Template length:', content.length);
console.log('Template tail (last 300 chars):');
console.log(content.slice(-300));
// print surrounding JS sentencing (100 chars before and after end)
console.log('Chars after closing backtick (next 40):', data.slice(end, end+40).replace(/\n/g,'\\n'));
