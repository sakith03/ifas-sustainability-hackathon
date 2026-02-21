import * as XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = [
  ['Category', 'Metric', 'Threshold', 'Weight'],
  ['Environmental', 'Carbon Footprint (kg CO2)', 5000, 0.3],
  ['Environmental', 'Water Usage (L)', 10000, 0.2],
  ['Environmental', 'Waste Generation (kg)', 1000, 0.2],
  ['Social', 'Jobs Created', 10, 0.15],
  ['Social', 'Community Impact', 7, 0.15],
];

const worksheet = XLSX.utils.aoa_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Metrics');

const outputPath = path.join(__dirname, '../../data/sustainability_framework.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('Template created at:', outputPath);
