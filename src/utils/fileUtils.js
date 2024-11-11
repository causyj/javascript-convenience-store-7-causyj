import fs from 'fs';
import path from 'path';

export const readFile = (fileName) => {
  const filePath = path.resolve('public', fileName);
  return fs.readFileSync(filePath, 'utf-8');
};

export const getLinesFromFile = (fileName) => {
  const data = readFile(fileName);
  const lines = data
    .split('\n')
    .slice(1)
    .filter((line) => line.trim() !== '');

  return lines;
};
