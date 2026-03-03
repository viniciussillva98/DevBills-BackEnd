import app from "./app";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase";
import { prismaConnect } from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.service";

const Port = env.PORT;

initializeFirebaseAdmin();

const StartServer = async () => {

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
