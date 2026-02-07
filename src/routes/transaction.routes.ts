import type { FastifyInstance } from "fastify";
import { createTransactionController } from "../controllers/transactions/createTransaction.controller";
import { deleteTransactionController } from "../controllers/transactions/deletTransaction.controller";
import { getTransactionsController } from "../controllers/transactions/getTransaction.controller";
import { getTransactionsHistoricalController } from "../controllers/transactions/getTransactionHistorical.controller";
import { getTransactionsSummaryController } from "../controllers/transactions/getTransactionsSummary.controller";
import { authMiddleware } from "../middlewares/auth.moddleware";

const transactionRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", authMiddleware); //Aplica o middleware de autenticação a todas as rotas abaixo

  //Criar uma transação
  fastify.route({
    method: "POST",
    url: "/",
    handler: createTransactionController,
  });

  //Buscar transações com filtros
  fastify.route({
    method: "GET",
    url: "/",
    handler: getTransactionsController,
  });

  //Buscar historico de transações
  fastify.route({
    method: "GET",
    url: "/historical",
    handler: getTransactionsHistoricalController,
  });

  //Buscar resumo mensal
  fastify.route({
    method: "GET",
    url: "/summary",
    handler: getTransactionsSummaryController,
  });

  //Deletar transação
  fastify.route({
    method: "DELETE",
    url: "/:id",
    handler: deleteTransactionController,
  });
};

export default transactionRoutes;
