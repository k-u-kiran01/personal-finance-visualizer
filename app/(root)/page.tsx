"use client";

import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart } from "@/components/dashboard/PieChart";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { BudgetManager } from "@/components/budgets/BudgetManager";
import { TRANSACTION_CATEGORIES } from "@/lib/categories";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { MonthlyBarChart } from "@/components/dashboard/MonthlyBarChart";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: "expense" | "income";
}

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
  year: number;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    amount: 0,
    date: "",
    description: "",
    category: "other",
    type: "expense" as "expense" | "income",
  });

  const handleAddTransaction = async (newTransaction: Transaction) => {
    setTransactions(prev => {
      const updated = [...prev, newTransaction];
      return updated;
    });
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      amount: transaction.amount,
      date: transaction.date.split('T')[0], // Convert to YYYY-MM-DD format
      description: transaction.description,
      category: transaction.category,
      type: transaction.type,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction || !editForm.description || !editForm.amount || !editForm.date) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingTransaction._id,
          amount: editForm.amount,
          date: editForm.date,
          description: editForm.description,
          category: editForm.category,
          type: editForm.type,
        }),
      });

      if (res.ok) {
        const updatedTransaction = await res.json();
        setTransactions(prev => prev.map(tx => 
          tx._id === editingTransaction._id 
            ? updatedTransaction
            : tx
        ));
        setEditDialogOpen(false);
        setEditingTransaction(null);
        setEditForm({ amount: 0, date: "", description: "", category: "other", type: "expense" });
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await fetch("/api/transactions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setTransactions(prev => prev.filter(tx => tx._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Calculate dashboard data - using useMemo for better performance
  const dashboardData = useMemo(() => {
    const totalExpenses = transactions
      .filter(tx => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalIncome = transactions
      .filter(tx => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const categoryData = transactions
      .filter(tx => tx.type === "expense")
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

    const pieChartData = Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount,
    }));

    return {
      totalExpenses,
      totalIncome,
      categoryData,
      pieChartData,
      categorySpending: categoryData
    };
  }, [transactions]);

  const { totalExpenses, totalIncome, pieChartData, categorySpending } = dashboardData;

  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/budgets");
      const data = await res.json();
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const refreshData = async () => {
    try {
      const [transactionsRes, budgetsRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/budgets")
      ]);
      const transactionsData = await transactionsRes.json();
      const budgetsData = await budgetsRes.json();
      setTransactions(transactionsData);
      setBudgets(budgetsData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data);
        await fetchBudgets();
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Personal Finance App</h1>
        <Button onClick={refreshData} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>
      
      {/* Dashboard Cards */}
      {!isLoading && (
        <DashboardCards
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
          budgets={budgets.map(budget => ({
            category: budget.category,
            amount: budget.amount,
            spent: categorySpending[budget.category] || 0,
          }))}
        />
      )}

      {/* Transaction Form */}
      <TransactionForm onAdd={handleAddTransaction} />
      
      {/* Charts and Budgets Section */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {pieChartData.length > 0 ? (
                <PieChart data={pieChartData} />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No expense data to display
                </p>
              )}
            </CardContent>
          </Card>

          {/* Monthly Expenses Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyBarChart transactions={transactions} />
            </CardContent>
          </Card>

          {/* Budget Manager */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetManager
                budgets={budgets}
                onBudgetChange={refreshData}
                categorySpending={categorySpending}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Transaction List */}
      {!isLoading && (
        <TransactionList
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      )}

      {/* Edit Transaction Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label>Amount (₹)</Label>
              <Input 
                type="number" 
                name="amount" 
                value={editForm.amount} 
                onChange={handleEditChange} 
                required 
                min={0}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input 
                type="date" 
                name="date" 
                value={editForm.date} 
                onChange={handleEditChange} 
                required 
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input 
                name="description" 
                value={editForm.description} 
                onChange={handleEditChange} 
                required 
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select 
                value={editForm.category} 
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select 
                value={editForm.type} 
                onValueChange={(value: "expense" | "income") => setEditForm({ ...editForm, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Transaction
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
