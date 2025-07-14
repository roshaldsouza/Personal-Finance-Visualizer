import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  type: z.enum(['income', 'expense'], {
    required_error: 'Type is required',
  }),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;