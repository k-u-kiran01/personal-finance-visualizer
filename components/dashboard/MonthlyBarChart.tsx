import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Transaction } from "@/components/transactions/helpers";

function getMonthlyExpenses(transactions: Transaction[]) {
  const monthly: Record<string, number> = {};
  transactions.forEach(tx => {
    if (tx.type !== "expense") return;
    const date = new Date(tx.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthly[key] = (monthly[key] || 0) + tx.amount;
  });
  // Convert to array and sort by date
  return Object.entries(monthly)
    .map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' }),
      amount
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

export function MonthlyBarChart({ transactions }: { transactions: Transaction[] }) {
  const data = getMonthlyExpenses(transactions);
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
          <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      {data.length === 0 && <p className="text-center text-muted-foreground py-8">No expense data to display</p>}
    </div>
  );
} 