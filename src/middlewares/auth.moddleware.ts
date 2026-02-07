import type { FastifyReply, FastifyRequest } from "fastify";
import admin from "firebase-admin";

declare module "fastify" {
  // Extende a interface FastifyRequest para incluir userId
  interface FastifyRequest {
    userId?: string;
  }
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return reply
      .code(401)
      .send({ message: "❌ Unauthorized. 🚨Token Não autorizado" });
  }

  const token = authorizationHeader.replace("Bearer ", ""); //Remove o prefixo "Bearer" para obter só o token real.

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    request.userId = decodedToken.uid; // Adiciona o userId ao request para uso posterior
  } catch (error) {
    request.log.error("Erro na verificação do token:");
    reply.code(401).send({
      message: "❌ Unauthorized.🚨Token está inválido ou expirado",
      error,
    });
  }
};
