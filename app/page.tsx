'use client';

import { useState, useMemo } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { TransactionList } from '@/components/transactions/transaction-list';
import { MonthlyExpensesChart } from '@/components/charts/monthly-expenses-chart';
import { StatsCard } from '@/components/ui/stats-card';
import { PageHeader } from '@/components/ui/page-header';
import { useTransactions } from '@/hooks/use-transactions';
import { TransactionFormData } from '@/lib/validations';

export default function Home() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { toast } = useToast();

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    return {
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      addTransaction(data);
      setIsAddDialogOpen(false);
      toast({
        title: 'Transaction added',
        description: `${data.type === 'income' ? 'Income' : 'Expense'} of ${formatCurrency(data.amount)} has been recorded.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add transaction. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const success = deleteTransaction(id);
      if (success) {
        toast({
          title: 'Transaction deleted',
          description: 'The transaction has been removed from your records.',
        });
      }
    }
  };

  const handleEditTransaction = (transaction: any) => {
    // This would open an edit dialog - for now, just show a toast
    toast({
      title: 'Edit feature',
      description: 'Edit functionality will be added in the next update.',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <PageHeader 
          title="Personal Finance Dashboard" 
          subtitle="Track your income, expenses, and financial goals"
        >
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="sr-only">Add New Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm onSubmit={handleAddTransaction} />
            </DialogContent>
          </Dialog>
        </PageHeader>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Balance"
            value={formatCurrency(stats.balance)}
            icon={DollarSign}
            trend={{
              value: stats.balance >= 0 ? "Positive" : "Negative",
              isPositive: stats.balance >= 0,
            }}
          />
          <StatsCard
            title="Total Income"
            value={formatCurrency(stats.totalIncome)}
            icon={TrendingUp}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20"
          />
          <StatsCard
            title="Total Expenses"
            value={formatCurrency(stats.totalExpenses)}
            icon={TrendingDown}
            className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20"
          />
          <StatsCard
            title="Transactions"
            value={stats.transactionCount.toString()}
            icon={BarChart3}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2">
            <MonthlyExpensesChart transactions={transactions} />
          </div>

          {/* Quick Add Form */}
          <div className="lg:col-span-1">
            <TransactionForm onSubmit={handleAddTransaction} />
          </div>
        </div>

        {/* Transaction List */}
        <div className="mt-8">
          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
}