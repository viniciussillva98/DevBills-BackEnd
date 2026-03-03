import app from "../src/app";
import initializeFirebaseAdmin from "../src/config/firebase";
import { prismaConnect } from "../src/config/prisma";
import { initializeGlobalCategories } from "../src/services/globalCategories.service";

let initialized = false;

export default async function handler(req: any, res: any) {
    try {
        if (!initialized) {
            console.log("Inicializando backend...");

            initializeFirebaseAdmin();
            console.log("Firebase OK");

            await prismaConnect();
            console.log("Prisma OK");

            await initializeGlobalCategories();
            console.log("Categorias OK");

            initialized = true;
        }

        await app.ready();
        app.server.emit("request", req, res);

    } catch (error) {
        console.error("ERRO NO BACKEND:", error);
        res.status(500).json({
            message: "Erro interno",
            error: String(error),
        });
    }
}