export const TRANSACTION_CATEGORIES = [
  { value: "food", label: "Food & Dining", color: "#FF6B6B", icon: "🍽️" },
  { value: "transport", label: "Transportation", color: "#4ECDC4", icon: "🚗" },
  { value: "shopping", label: "Shopping", color: "#45B7D1", icon: "🛍️" },
  { value: "entertainment", label: "Entertainment", color: "#96CEB4", icon: "🎬" },
  { value: "health", label: "Healthcare", color: "#FFEAA7", icon: "🏥" },
  { value: "education", label: "Education", color: "#DDA0DD", icon: "📚" },
  { value: "utilities", label: "Utilities", color: "#FFB347", icon: "⚡" },
  { value: "housing", label: "Housing", color: "#87CEEB", icon: "🏠" },
  { value: "income", label: "Income", color: "#98FB98", icon: "💰" },
  { value: "other", label: "Other", color: "#D3D3D3", icon: "📝" },
] as const;

export type CategoryType = typeof TRANSACTION_CATEGORIES[number]["value"];

export const getCategoryColor = (category: CategoryType) => {
  return TRANSACTION_CATEGORIES.find(cat => cat.value === category)?.color || "#D3D3D3";
};

export const getCategoryLabel = (category: CategoryType) => {
  return TRANSACTION_CATEGORIES.find(cat => cat.value === category)?.label || "Other";
};

export const getCategoryIcon = (category: CategoryType) => {
  return TRANSACTION_CATEGORIES.find(cat => cat.value === category)?.icon || "📝";
}; 