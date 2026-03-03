import app from "./app";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase";
import { prismaConnect } from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.service";

const Port = env.PORT;

initializeFirebaseAdmin();

const StartServer = async () => {
  console.log("DATABASE_URL:", !!process.env.DATABASE_URL);
  console.log("PROJECT_ID:", !!process.env.FIREBASE_PROJECT_ID);
  console.log("CLIENT_EMAIL:", !!process.env.FIREBASE_CLIENT_EMAIL);
  console.log("PRIVATE_KEY:", !!process.env.FIREBASE_PRIVATE_KEY);
  try {
    await prismaConnect();

    await initializeGlobalCategories();

    await app.listen({ port: Port }).then(() => {
      console.log(`🔹 Servidor rodando na porta ${Port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

StartServer();
