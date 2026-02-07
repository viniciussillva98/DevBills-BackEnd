import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionHistorical } from "../../schemas/transaction.schema";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");
dayjs.extend(utc);

export const getTransactionsHistoricalController = async (
  request: FastifyRequest<{ Querystring: GetTransactionHistorical }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId; // Supondo que o userId seja adicionado ao request por um middleware de autenticação

  if (!userId) {
    return reply.status(401).send({ error: "Usuário não autenticado" });
  }

  const { month, year, months = 5 } = request.query;

  const baseDate = new Date(year, month - 1, 1);

  const startDate = dayjs
    .utc(baseDate)
    .subtract(months - 1, "month")
    .startOf("month")
    .toDate();
  const endDate = dayjs.utc(baseDate).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });
    const monthlyDate = Array.from({ length: months }, (_, i) => {
      const date = dayjs.utc(baseDate).subtract(months - 1 - i, "month");
      return {
        name: date.format("MMM/YYYY"),
        income: 0,
        expense: 0,
      };
    });

    transactions.forEach((transaction) => {
      const monthkey = dayjs.utc(transaction.date).format("MMM/YYYY");
      const monthDate = monthlyDate.find((m) => m.name === monthkey);

      if (monthDate) {
        if (transaction.type === "income") {
          monthDate.income += transaction.amount;
        } else {
          monthDate.expense += transaction.amount;
        }
      }
    });
    reply.send({ history: monthlyDate });
  } catch (_error) {}
};
