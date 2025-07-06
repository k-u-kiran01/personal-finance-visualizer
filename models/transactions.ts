import mongoose from "mongoose";

export const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    default: "other",
  },
  type: {
    type: String,
    enum: ["expense", "income"],
    required: true,
    default: "expense",
  },
});

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);