const mongoose = require("mongoose");

const db_url = "mongodb://localhost:27017/";
const transactionSchema = new mongoose.Schema({}, { strict: false });
const Transaction = mongoose.model("Transaction", transactionSchema);

async function fixTransactions() {
  await mongoose.connect(db_url);
  await Transaction.updateMany(
    { category: { $exists: false } },
    { $set: { category: "other" } }
  );
  await Transaction.updateMany(
    { type: { $exists: false } },
    { $set: { type: "expense" } }
  );
  console.log("All transactions updated!");
  process.exit();
}

fixTransactions();