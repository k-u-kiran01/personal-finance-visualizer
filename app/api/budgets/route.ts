import connectDB from "@/lib/dbconnect";
import { Budget } from "@/models/budgets";

export const GET = async () => {
  await connectDB();
  const budgets = await Budget.find();
  return new Response(JSON.stringify(budgets));
};

export const POST = async (req: Request) => {
  await connectDB();
  const { category, amount, month, year } = await req.json();
  const budget = await Budget.create({ category, amount, month, year });
  return new Response(JSON.stringify(budget));
};

export const PUT = async (req: Request) => {
  await connectDB();
  const { id, category, amount, month, year } = await req.json();
  await Budget.findByIdAndUpdate(id, { category, amount, month, year });
  return new Response(JSON.stringify({ message: "Budget updated" }));
};

export const DELETE = async (req: Request) => {
  await connectDB();
  const { id } = await req.json();
  await Budget.findByIdAndDelete(id);
  return new Response(JSON.stringify({ message: "Budget deleted" }));
}; 