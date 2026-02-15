import 'dotenv/config';
import request from 'supertest';
import express from 'express';
import prisma from '../db';

const app = express();
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

describe('Health Check (real DB connection to sustainability_db)', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return 200 and ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should report database connected when backend reaches sustainability_db', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      database: 'connected',
    });
  });

  it('should run a raw query against sustainability_db', async () => {
    const result = await prisma.$queryRaw<[{ one: number }]>`SELECT 1 as one`;
    expect(result).toHaveLength(1);
    expect(result[0].one).toBe(1);
  });
});
