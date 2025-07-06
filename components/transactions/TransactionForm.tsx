import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRANSACTION_CATEGORIES } from "@/lib/categories";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: "expense" | "income";
}

export function TransactionForm({ onAdd }: { onAdd: (tx: Transaction) => void }) {
  const [form, setForm] = useState({
    amount: 0,
    date: "",
    description: "",
    category: "other",
    type: "expense" as "expense" | "income",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: form.amount,
        date: form.date,
        description: form.description,
        category: form.category,
        type: form.type,
      }),
    });
    const data = await res.json();
    onAdd(data);
    setForm({ amount: 0, date: "", description: "", category: "other", type: "expense" });
  };

  return (
    <Card className="max-w-xl mx-auto my-4">
      <CardHeader>Add Transaction</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Amount (₹)</Label>
            <Input type="number" name="amount" value={form.amount} onChange={handleChange} required min={0}/>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" name="date" value={form.date} onChange={handleChange} required />
          </div>
          <div>
            <Label>Description</Label>
            <Input name="description" value={form.description} onChange={handleChange} required />
          </div>
          <div>
            <Label>Category</Label>
            <Select 
              value={form.category} 
              onValueChange={(value) => setForm({ ...form, category: value })}
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
              value={form.type} 
              onValueChange={(value: "expense" | "income") => setForm({ ...form, type: value })}
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
          <Button type="submit" className="w-full">Add</Button>
        </form>
      </CardContent>
    </Card>
  );
} 