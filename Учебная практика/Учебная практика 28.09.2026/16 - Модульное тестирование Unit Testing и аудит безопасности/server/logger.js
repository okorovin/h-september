import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFile = path.join(__dirname, '..', 'app.log');

export function logError(message) {
  const timestamp = new Date().toLocaleString('ru-RU');
  const line = `${timestamp} | ERROR | ${message}\n`;
  fs.appendFileSync(logFile, line);
  console.error(line.trim());
}
