import type { TransactionType } from "@prisma/client";
import type { CategorySummary } from "./category.types";

export interface TransactionFilter {
  userId: string;
  date?: {
    gte: Date;
    lte: Date;
  };
  type?: TransactionType;
  categoryId?: string;
}

export interface TransactionSummary {
  totalExpenses: number; //despesas ou saidas
  totalIncomes: number; //receitas ou entradas
  balance: number; //saldo atual
  expensesByCategory: CategorySummary[];
}
