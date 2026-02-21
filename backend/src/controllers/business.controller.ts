import type { Request, Response } from 'express';
import prisma from '../db';
import { AssessmentService } from '../services/assessment.service';
import { ExcelService } from '../services/excel.service';


const assessmentService = new AssessmentService();
const excelService = new ExcelService();

export class BusinessController {

  async createIdea(req: Request, res: Response) {
    try {
      const { userId, name, description, sector, resources } = req.body;

      const idea = await prisma.businessIdea.create({
        data: {
          userId,
          name,
          description,
          sector,
          resources,
        },
      });

      res.status(201).json(idea);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create business idea' });
    }
  }

  async getIdeas(req: Request, res: Response) {
    try {
      const ideas = await prisma.businessIdea.findMany({
        include: {
          user: true,
          assessment: true,
        },
      });
      res.json(ideas);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ideas' });
    }
  }

    //BusinessController class
    async downloadReport(req: Request, res: Response) {
      try {
        const assessmentId = req.params.assessmentId;
    
        if (!assessmentId) {
          return res.status(400).json({ error: 'Assessment ID is required' });
        }
    
        const assessment = await prisma.assessment.findUnique({
          where: { id: assessmentId },
        });
    
        if (!assessment) {
          return res.status(404).json({ error: 'Assessment not found' });
        }
    
        const buffer = await excelService.generateExcelReport(assessment);
    
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=assessment-report.xlsx'
        );
    
        res.send(buffer);
      } catch (error) {
        res.status(500).json({ error: 'Failed to generate report' });
      }
    }
    
  

  async assessIdea(req: Request, res: Response) {
    try {
      const ideaId  = req.params.ideaId;

      if (!ideaId) {
        return res.status(400).json({ error: 'Idea ID is required' });
      }

      const assessmentInput = req.body;

      const result = await assessmentService.assessBusinessIdea(
        ideaId,
        assessmentInput
      );

      const assessment = await prisma.assessment.create({
        data: {
          businessIdeaId: ideaId,
          carbonScore: result.carbonScore,
          socialScore: result.socialScore,
          resourceScore: result.resourceScore,
          totalScore: result.totalScore,
          recommendations: result.recommendations,
        },
      });

      res.json(assessment);
    } catch (error) {
      res.status(400).json({ error: 'Assessment failed' });
    }
  }
}