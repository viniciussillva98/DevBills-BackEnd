import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default(3001),
  DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatória"),
  NODE_ENV: z.enum(["dev", "test", "prod"], {
    error: "NODE_ENV inválido, deve ser um desses tipos ([dev, test, prod])",
  }),
  //Firebase Env Variables
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("🚨 VARIÁVEIS DE AMBIENTES INVÁLIDAS");
  process.exit(1);
}

export const env = _env.data;
