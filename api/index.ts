
import app from "../src/app";
import initializeFirebaseAdmin from "../src/config/firebase";
import { prismaConnect } from "../src/config/prisma";
import { initializeGlobalCategories } from "../src/services/globalCategories.service";

let initialized = false;

export default async function handler(req: any, res: any) {
    if (!initialized) {
        initializeFirebaseAdmin();
        await prismaConnect();
        await initializeGlobalCategories();
        initialized = true;
    }

    return app.ready().then(() => app.server.emit('request', req, res));
}