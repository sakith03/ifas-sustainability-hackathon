import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

interface SustainabilityMetric {
  category: string;
  metric: string;
  threshold: number;
  weight: number;
}

export class ExcelService {
  private metricsCache: SustainabilityMetric[] = [];

  async loadMetricsFromExcel(filePath: string): Promise<SustainabilityMetric[]> {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error('No sheets found in the Excel file');
      }

      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        throw new Error(`Worksheet "${sheetName}" not found in the workbook`);
      }

      const data = XLSX.utils.sheet_to_json(worksheet) as any[];
      
      this.metricsCache = data.map(row => ({
        category: row.Category || '',
        metric: row.Metric || '',
        threshold: Number(row.Threshold) || 0,
        weight: Number(row.Weight) || 1,
      }));

      return this.metricsCache;
    } catch (error) {
      console.error('Error reading Excel file:', error);
      throw new Error('Failed to load sustainability metrics');
    }
  }

  async generateExcelReport(assessment: any): Promise<Buffer> {
    const data = [
      ['Sustainability Assessment Report'],
      [],
      ['Metric', 'Score', 'Status'],
      ['Carbon Impact', assessment.carbonScore, this.getStatus(assessment.carbonScore)],
      ['Resource Efficiency', assessment.resourceScore, this.getStatus(assessment.resourceScore)],
      ['Social Impact', assessment.socialScore, this.getStatus(assessment.socialScore)],
      ['Total Score', assessment.totalScore, this.getStatus(assessment.totalScore)],
      [],
      ['Recommendations'],
      ...assessment.recommendations.map((rec: string) => [rec]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessment');

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  private getStatus(score: number): string {
    if (score >= 70) return 'Excellent';
    if (score >= 40) return 'Good';
    return 'Needs Improvement';
  }
}