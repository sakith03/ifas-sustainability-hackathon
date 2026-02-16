import request from 'supertest';
import app from '../index';
import { cleanDatabase, disconnectDatabase } from '../test-setup';
import prisma from '../db';

describe('Business API', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await disconnectDatabase();
  });

  describe('POST /api/business/ideas', () => {
    it('should create a business idea', async () => {
      // First create a user
      const user = await prisma.user.create({
        data: {
          email: 'entrepreneur@example.com',
          name: 'Test Entrepreneur',
        },
      });

      const response = await request(app)
        .post('/api/business/ideas')
        .send({
          userId: user.id,
          name: 'Solar Panel Manufacturing',
          description: 'Affordable solar panels for homes',
          sector: 'Renewable Energy',
          resources: { materials: ['silicon', 'glass'] },
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Solar Panel Manufacturing');
    });
  });

  describe('POST /api/business/ideas/:ideaId/assess', () => {
    it('should assess a business idea', async () => {
      const user = await prisma.user.create({
        data: { email: 'test@test.com', name: 'Test' },
      });

      const idea = await prisma.businessIdea.create({
        data: {
          userId: user.id,
          name: 'Green Transport',
          description: 'Electric bikes',
          sector: 'Transportation',
        },
      });

      const response = await request(app)
        .post(`/api/business/ideas/${idea.id}/assess`)
        .send({
          carbonFootprint: 500,
          waterUsage: 2000,
          wasteGenerated: 100,
          renewableEnergy: true,
          jobsCreated: 5,
          communityImpact: 7,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalScore');
      expect(response.body.totalScore).toBeGreaterThan(0);
    });
  });
});