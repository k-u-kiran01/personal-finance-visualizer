import { TRANSACTION_CATEGORIES, CategoryType } from "@/lib/categories";

export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: "expense" | "income";
}

export function groupTransactionsByMonth(transactions: Transaction[]) {
  return transactions.reduce((groups, tx) => {
    const date = new Date(tx.date);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
    return groups;
  }, {} as Record<string, Transaction[]>);
}

export function isCategoryType(category: string): category is CategoryType {
  return TRANSACTION_CATEGORIES.some(cat => cat.value === category);
} 