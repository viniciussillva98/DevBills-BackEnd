import type { FastifyInstance } from "fastify";
import { getCategoriesController } from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.moddleware";

const categoryRouter = async (fastify: FastifyInstance): Promise<void> => {
  fastify.addHook("preHandler", authMiddleware); //Aplica o middleware de autenticação a todas as rotas abaixo
  fastify.get("/", getCategoriesController);
};

export default categoryRouter;
