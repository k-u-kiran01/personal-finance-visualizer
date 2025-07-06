# Personal Finance Visualizer

A modern, responsive web application for tracking personal finances, built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## 🚀 Features

### Stage 1: Basic Transaction Tracking
- Add, edit, and delete transactions (amount, date, description)
- Transaction list view with month-wise grouping
- Monthly expenses bar chart (Recharts)
- Basic form validation and error handling

### Stage 2: Categories
- Predefined categories for transactions (with icons)
- Category-wise pie chart
- Dashboard with summary cards: total expenses, income, net, budget used
- Recent transactions list

### Stage 3: Budgeting
- Set monthly category budgets
- Budget vs actual comparison chart (progress bars)
- Simple spending insights

## 🛠️ Stack
- **Frontend:** Next.js 14, React 18, TypeScript
- **UI:** shadcn/ui, Tailwind CSS, Lucide Icons
- **Charts:** Recharts
- **Backend:** Next.js API routes
- **Database:** MongoDB (Mongoose)

## 📦 Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/k-u-kiran01/personal-finance-visualizer
   cd personal-finance-visualizer
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env.local` file:
     ```env
     MONGODB_URI= <your-mongodb-connection>
     ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open in your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment
- Deploy easily to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- Set your `MONGODB_URI` in the deployment environment variables.


## ❗ Notes
- **No authentication:** This app is for demo/personal use only. Do not use for sensitive data.
- **No login/signup:** Per evaluation requirements.

## 📄 License
[MIT](LICENSE)

---

**Made with ❤️ using Next.js, shadcn/ui, and MongoDB.**
