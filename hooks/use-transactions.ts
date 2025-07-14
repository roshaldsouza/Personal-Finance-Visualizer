'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '@/lib/storage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      const stored = getTransactions();
      setTransactions(stored);
      setLoading(false);
    };

    loadTransactions();
  }, []);

  const addNewTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction = addTransaction(transactionData);
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateExistingTransaction = (id: string, updates: Partial<Transaction>) => {
    const updatedTransaction = updateTransaction(id, updates);
    if (updatedTransaction) {
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
    }
    return updatedTransaction;
  };

  const removeTransaction = (id: string) => {
    const success = deleteTransaction(id);
    if (success) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
    return success;
  };

  return {
    transactions,
    loading,
    addTransaction: addNewTransaction,
    updateTransaction: updateExistingTransaction,
    deleteTransaction: removeTransaction,
  };
};