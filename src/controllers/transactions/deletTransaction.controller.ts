import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { DeleteTransactionParams } from "../../schemas/transaction.schema";

export const deleteTransactionController = async (
  request: FastifyRequest<{ Params: DeleteTransactionParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId; // Supondo que o userId seja adicionado ao request por um middleware de autenticação
  const { id } = request.params;

  if (!userId) {
    return reply.status(401).send({ error: "Usuário não autenticado" });
  }

  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!transaction) {
      return reply.status(400).send({ error: "Id da transação inválido" });
    }

    await prisma.transaction.delete({ where: { id } });

    reply.status(200).send({ message: "Deletado com sucesso" });
  } catch (error) {
    request.log.error({ message: "Erro ao deletar" });
    reply.status(500).send({ error, Err: "Erro ao deletar transação" });
  }
};
