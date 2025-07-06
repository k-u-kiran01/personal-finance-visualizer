import connectDB from "@/lib/dbconnect";
import { Transaction } from "@/models/transactions";

export const GET = async () => {
  await connectDB();
  const transactions = await Transaction.find();
  return new Response(JSON.stringify(transactions));
};

export const POST = async (req: Request) => {
  await connectDB();
  const { amount, date, description, category, type } = await req.json();
  const dateObj = new Date(date);
  const transaction = await Transaction.create({ 
    amount, 
    date: dateObj, 
    description, 
    category: category || "other",
    type: type || "expense"
  });
  return new Response(JSON.stringify(transaction));
};

export const DELETE = async (req: Request) => {
    await connectDB();
    const { id } = await req.json();
    
    try {
        await Transaction.findByIdAndDelete(id);
        return new Response(JSON.stringify({ message: "Transaction deleted" }));
    } catch (error) {
        return new Response(JSON.stringify({ message: "Transaction not found" }), { status: 404 });
    }
};

export const PUT = async (req: Request) => {
    await connectDB();
    const { id, amount, date, description, category, type } = await req.json();
    const dateObj = new Date(date);
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(id, { 
          amount, 
          date: dateObj, 
          description, 
          category: category || "other",
          type: type || "expense"
        }, { new: true });
        return new Response(JSON.stringify(updatedTransaction));
    } catch (error) {
        return new Response(JSON.stringify({ message: "Transaction not found" }), { status: 404 });
    }
}; 