'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, DollarSign, Calendar, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { transactionSchema, TransactionFormData } from '@/lib/validations';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  loading?: boolean;
}

export function TransactionForm({ onSubmit, loading }: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
      type: 'expense',
    },
  });

  const handleSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchType = form.watch('type');

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-xl border-0">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          Add New Transaction
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Track your income and expenses with detailed information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Transaction Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Transaction Type
            </Label>
            <RadioGroup
              value={form.watch('type')}
              onValueChange={(value) => form.setValue('type', value as 'income' | 'expense')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label 
                  htmlFor="income" 
                  className={cn(
                    "flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-all duration-200",
                    watchType === 'income' 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  )}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Income</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label 
                  htmlFor="expense" 
                  className={cn(
                    "flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-all duration-200",
                    watchType === 'expense' 
                      ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-700 dark:text-rose-300"
                      : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                  )}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Expense</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-10 text-lg font-medium"
                {...form.register('amount', { valueAsNumber: true })}
              />
            </div>
            {form.formState.errors.amount && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                className="pl-10"
                {...form.register('date')}
              />
            </div>
            {form.formState.errors.date && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Description
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Textarea
                id="description"
                placeholder="Enter transaction description..."
                className="pl-10 min-h-[80px] resize-none"
                {...form.register('description')}
              />
            </div>
            {form.formState.errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            className={cn(
              "w-full h-12 text-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]",
              watchType === 'income' 
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25" 
                : "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/25"
            )}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add Transaction</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}