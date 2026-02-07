import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { object, z } from "zod";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),
  amount: z.number().positive("Valor deve ser positivo"),
  date: z.coerce.date({
    error: () => ({ message: "Data inválida" }),
  }),
  categoryId: z.string().refine(isValidObjectId, {
    error: () => ({ message: "Categoria inválida" }),
  }),
  type: z.enum([TransactionType.expense, TransactionType.income], {
    error: () => ({ message: "Type inválido" }),
  }),
});

export const getTransactionSchema = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  type: z
    .enum([TransactionType.expense, TransactionType.income], {
      error: () => ({ message: "Type inválido" }),
    })
    .optional(),
  categoryId: z
    .string()
    .refine(isValidObjectId, {
      error: () => ({ message: "Categoria inválida" }),
    })
    .optional(),
});

export const getTransactionSummarySchema = z.object({
  month: z.string({ error: "O mes é obrigatório" }),
  year: z.string({ error: "O ano é obrigatório" }),
});

export const getTransactionHistoricalSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2100),
  months: z.coerce.number().min(1).max(12).optional(),
});

export const deleteTransactionSchema = object({
  id: z.string().refine(isValidObjectId, {
    error: () => ({ message: "Id inválido" }),
  }),
});

export type CreateTransactionBody = z.infer<typeof createTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionSchema>;
export type GetTransactionSummary = z.infer<typeof getTransactionSummarySchema>;
export type GetTransactionHistorical = z.infer<typeof getTransactionHistoricalSchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionSchema>;
