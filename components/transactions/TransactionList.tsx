import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { getCategoryLabel } from "@/lib/categories";
import { Transaction, groupTransactionsByMonth, isCategoryType } from "./helpers";
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Book,
  Lightbulb,
  Home,
  DollarSign,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TRANSACTION_CATEGORIES = [
  { value: "food", label: "Food & Dining", icon: Utensils },
  { value: "transport", label: "Transportation", icon: Car },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "entertainment", label: "Entertainment", icon: Film },
  { value: "health", label: "Healthcare", icon: HeartPulse },
  { value: "education", label: "Education", icon: Book },
  { value: "utilities", label: "Utilities", icon: Lightbulb },
  { value: "housing", label: "Housing", icon: Home },
  { value: "income", label: "Income", icon: DollarSign },
  { value: "other", label: "Other", icon: Tag },
] as const;

const getCategoryIconComponent = (categoryValue: string) => {
  const category = TRANSACTION_CATEGORIES.find(cat => cat.value === categoryValue) || TRANSACTION_CATEGORIES.find(cat => cat.value === "other");
  return category?.icon || Tag;
};

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}) {
  const grouped = groupTransactionsByMonth(transactions);
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    // Sort by year and month descending
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    const dateA = new Date(`${monthA} 1, ${yearA}`);
    const dateB = new Date(`${monthB} 1, ${yearB}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Card className="max-w-xl mx-auto my-6">
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
        {sortedKeys.length === 0 && <p className="text-muted-foreground">No transactions</p>}
        {sortedKeys.map((key) => (
          <div key={key} className="mb-4">
            <div className="font-semibold text-base mb-2">{key}</div>
            <ul className="space-y-2">
              {grouped[key].map((tx) => (
                <li
                  key={tx._id}
                  className="flex justify-between items-center p-2 border rounded-md"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = getCategoryIconComponent(tx.category);
                        return <Icon className="w-5 h-5 mr-2" />;
                      })()}
                      <Badge variant="outline" className="mr-2">
                        {isCategoryType(tx.category) ? getCategoryLabel(tx.category) : getCategoryLabel("other")}
                      </Badge>
                      <p className="font-medium">{tx.description}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()} • {isCategoryType(tx.category) ? getCategoryLabel(tx.category) : getCategoryLabel("other")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <MoreVertical className="w-5 h-5 text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(tx)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(tx._id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 