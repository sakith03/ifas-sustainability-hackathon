## Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Testing**: Jest + React Testing Library + Supertest
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose
- **Deployment**: Railway/Vercel

## Why This Stack?
- TypeScript: Type safety across full stack
- Next.js: Fast development with API routes option
- Prisma: Type-safe database access
- Docker: Consistent environments
- Jest: Industry standard testing

## Database Schema (Draft)
```sql
User (id, email, created_at)
BusinessIdea (id, user_id, name, description, sector, created_at)
Assessment (id, idea_id, carbon_score, social_score, total_score, recommendations)
```
