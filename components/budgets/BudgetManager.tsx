"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { TRANSACTION_CATEGORIES, getCategoryColor } from "@/lib/categories";

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
  year: number;
}

interface BudgetManagerProps {
  budgets: Budget[];
  onBudgetChange: () => void;
  categorySpending: Record<string, number>;
}

export function BudgetManager({ budgets, onBudgetChange, categorySpending }: BudgetManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    const [year, month] = formData.month.split("-");
    const budgetData = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      month,
      year: parseInt(year),
    };

    try {
      const url = editingBudget 
        ? "/api/budgets" 
        : "/api/budgets";
      
      const method = editingBudget ? "PUT" : "POST";
      const body = editingBudget 
        ? { ...budgetData, id: editingBudget._id }
        : budgetData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setEditingBudget(null);
        setFormData({ category: "", amount: "", month: new Date().toISOString().slice(0, 7) });
        onBudgetChange();
      }
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/budgets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        onBudgetChange();
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: `${budget.year}-${budget.month.padStart(2, "0")}`,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Monthly Budgets</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingBudget(null);
              setFormData({ category: "", amount: "", month: new Date().toISOString().slice(0, 7) });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? "Edit Budget" : "Add New Budget"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
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
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter budget amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <Label>Month</Label>
                <Input
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBudget ? "Update" : "Add"} Budget
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => {
          const spent = categorySpending[budget.category] || 0;
          const utilization = (spent / budget.amount) * 100;
          const category = TRANSACTION_CATEGORIES.find(cat => cat.value === budget.category);
          
          return (
            <Card key={budget._id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category?.icon}</span>
                    <CardTitle className="text-sm">{category?.label}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(budget)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(budget._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget: ₹{budget.amount.toLocaleString()}</span>
                    <span>Spent: ₹{spent.toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={Math.min(utilization, 100)} 
                    className="h-2"
                    style={{
                      backgroundColor: getCategoryColor(budget.category as any) + "20",
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{utilization.toFixed(1)}% used</span>
                    <span>₹{(budget.amount - spent).toLocaleString()} remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 