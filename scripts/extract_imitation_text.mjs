import fs from 'node:fs';
import { PDFParse } from 'pdf-parse';

const sourcePdf =
  process.argv[2] ?? 'C:/Users/gerge/Downloads/Thomas A Kempis-The Imitation of Christ.pdf';
const outputText = process.argv[3] ?? 'data/imitation-of-christ.raw.txt';

const parser = new PDFParse({ data: fs.readFileSync(sourcePdf) });
const result = await parser.getText();
await parser.destroy();

fs.mkdirSync(outputText.replace(/[\\/][^\\/]+$/, ''), { recursive: true });
fs.writeFileSync(outputText, result.text, 'utf8');
console.log(`Extracted ${result.total} pages and ${result.text.length} characters to ${outputText}`);
