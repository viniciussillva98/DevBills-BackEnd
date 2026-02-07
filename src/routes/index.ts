import type { FastifyInstance } from "fastify";
import categoryRouter from "./category.routes";
import transactionRoutes from "./transaction.routes";

async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/health", async () => {
    return {
      status: "ok✅",
      message: "🔹DevBills API rodando normalmente!!",
    };
  });

  fastify.register(categoryRouter, { prefix: "/categories" });
  fastify.register(transactionRoutes, { prefix: "/transactions" });
}

export default routes;
