import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const prismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log("✅ DB conectado");
  } catch (_err) {
    console.error("🚨 Erro ao conectar DB");
  }
};

export default prisma;
