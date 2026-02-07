import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import {
  type CreateTransactionBody,
  createTransactionSchema,
} from "../../schemas/transaction.schema";

export const createTransactionController = async (
  request: FastifyRequest<{ Body: CreateTransactionBody }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId; // Supondo que o userId seja adicionado ao request por um middleware de autenticação

  if (!userId) {
    return reply.status(401).send({ error: "Usuário não autenticado" });
  }

  const result = createTransactionSchema.safeParse(request.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return reply.status(400).send({ errors });
  }

  const transaction = result.data;

  try {
    const category = await prisma.category.findFirst({
      where: {
        id: transaction.categoryId,
        type: transaction.type,
      },
    });

    if (!category) {
      return reply.status(400).send({ error: "Categoria inválida" });
    }

    const parseDate = new Date(transaction.date);

    const newTransaction = await prisma.transaction.create({
      data: {
        ...transaction,
        userId,
        date: parseDate,
      },
      include: {
        category: true,
      },
    });

    reply.status(201).send({ newTransaction });
  } catch (error) {
    request.log.error(`❌Erro ao criar transação, ${error}`);
    reply.status(500).send({ erro: "Erro interno do servidor" });
  }
};
