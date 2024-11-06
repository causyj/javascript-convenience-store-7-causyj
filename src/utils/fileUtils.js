import fs from 'fs';
import path from 'path';

const readFile = (fileName) => {
  const filePath = path.resolve('public', fileName);
  return fs.readFileSync(filePath, 'utf-8');
};
export default readFile;
