import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Expense name is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be positive"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Food", "Travel", "Shopping", "Bills", "Health", "Other"],
      default: "Other",
    },
    // ── date field: auto = current datetime, manual = user-picked date ──
    date: {
      type: Date,
      default: () => new Date(), // Auto current date+time if not provided
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    // ── TTL field: MongoDB auto-deletes document 30 days after this ──
    expiresAt: {
      type: Date,
      default: () => {
        const d = new Date();
        d.setDate(d.getDate() + 30); // 30 days from now
        return d;
      },
    },
  },
  {
    timestamps: true, // createdAt + updatedAt auto
  }
);

// ────────────────────────────────────────────────────────────────────────────
// TTL INDEX — MongoDB automatically deletes the document when
// the current time passes the value stored in `expiresAt`
// expireAfterSeconds: 0  →  delete exactly AT expiresAt time
// ────────────────────────────────────────────────────────────────────────────
expenseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
