import Expense from "../models/Expense.js";

// GET /api/expenses — All expenses (newest first)
export const getExpenses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/expenses/summary — Dashboard stats
export const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    const avg = count > 0 ? Math.round(total / count) : 0;

    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

    let topCategory = "—";
    let topAmount = 0;
    Object.entries(categoryMap).forEach(([cat, amount]) => {
      if (amount > topAmount) { topAmount = amount; topCategory = cat; }
    });

    res.status(200).json({
      success: true,
      data: { total, count, avg, topCategory, topAmount, categoryBreakdown: categoryMap },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/expenses — Create new expense
export const createExpense = async (req, res) => {
  try {
    const { name, amount, category, date, note } = req.body;

    // If user provides a date → use that, else auto = now
    const expenseDate = date ? new Date(date) : new Date();

    // expiresAt = 30 days from the expense date
    const expiresAt = new Date(expenseDate);
    expiresAt.setDate(expiresAt.getDate() + 30);

    const expense = await Expense.create({
      name,
      amount,
      category,
      date: expenseDate,
      note: note || "",
      expiresAt,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/expenses/:id — Update expense
export const updateExpense = async (req, res) => {
  try {
    // If date updated → recalculate expiresAt too
    if (req.body.date) {
      const newDate = new Date(req.body.date);
      req.body.expiresAt = new Date(newDate);
      req.body.expiresAt.setDate(req.body.expiresAt.getDate() + 30);
    }
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/expenses/:id — Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: "Expense not found" });
    res.status(200).json({ success: true, message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
