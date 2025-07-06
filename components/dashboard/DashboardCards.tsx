import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Wallet, Target } from "lucide-react";

interface DashboardCardsProps {
  totalExpenses: number;
  totalIncome: number;
  budgets: Array<{
    category: string;
    amount: number;
    spent: number;
  }>;
}

export function DashboardCards({ totalExpenses, totalIncome, budgets }: DashboardCardsProps) {
  const netAmount = totalIncome - totalExpenses;
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</div>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</div>
        </CardContent>
      </Card>

      {/* Net Amount */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
          <Wallet className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{netAmount.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Budget Utilization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
          <Target className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{budgetUtilization.toFixed(1)}%</div>
          <Progress value={budgetUtilization} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            ₹{totalSpent.toLocaleString()} / ₹{totalBudget.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 