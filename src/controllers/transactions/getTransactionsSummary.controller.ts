import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionSummary } from "../../schemas/transaction.schema";
import type { CategorySummary } from "../../types/category.types";
import type { TransactionSummary } from "../../types/transaction.types";

dayjs.extend(utc);

export const getTransactionsSummaryController = async (
  request: FastifyRequest<{ Querystring: GetTransactionSummary }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId; // Supondo que o userId seja adicionado ao request por um middleware de autenticação

  if (!userId) {
    return reply.status(401).send({ error: "Usuário não autenticado" });
  }

  const { month, year } = request.query;

  if (!month || !year) {
    return reply.status(400).send({ eror: "Mês e ano são obrigatórios" });
  }

  const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
  const endate = dayjs.utc(startDate).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endate,
        },
      },
      include: {
        category: true,
      },
    });

    let totalExpenses = 0;
    let totalIncomes = 0;
    const groupedExpenses = new Map<string, CategorySummary>();

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.expense) {
        const existing = groupedExpenses.get(transaction.categoryId) ?? {
          categoryId: transaction.categoryId,
          categoryName: transaction.category.name,
          categoryColor: transaction.category.color,
          amout: 0,
          percentage: 0,
        };

        existing.amout += transaction.amount;
        groupedExpenses.set(transaction.categoryId, existing);

        totalExpenses += transaction.amount;
      } else {
        totalIncomes += transaction.amount;
      }
    }

    const summary: TransactionSummary = {
      totalExpenses,
      totalIncomes,
      balance: Number((totalIncomes - totalExpenses).toFixed(2)),
      expensesByCategory: Array.from(groupedExpenses.values())
        .map((expense) => ({
          ...expense,
          percentage: Number.parseFloat(
            ((expense.amout / totalExpenses) * 100).toFixed(2),
          ),
        }))
        .sort((a, b) => b.amout - a.amout),
    };
    // console.log(Array.from(groupedExpenses.values()));
    //console.log({ groupedExpenses, totalExpenses, totalIncomes });
    reply.send(summary);
  } catch (error) {
    request.log.error(`Erro ao trazer transações, ${error}`);
    reply.status(500).send({ error: "Erro do servidor" });
  }
};
