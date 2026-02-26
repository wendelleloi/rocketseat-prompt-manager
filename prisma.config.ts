import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const url = process.env.DATABASE_URL!;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: 'postgresql://postgres:password@localhost:5432/rocketseat_prompt_manager?schema=public',
  },
});
