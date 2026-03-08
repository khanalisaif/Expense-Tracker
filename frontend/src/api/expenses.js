import axios from "axios";

const api = axios.create({ baseURL: "https://expense-tracker-1-vc0h.onrender.com/api" });

export const fetchExpenses = (category) =>
  api.get("/expenses", { params: category && category !== "All" ? { category } : {} });

export const fetchSummary = () => api.get("/expenses/summary");

export const addExpense = (data) => api.post("/expenses", data);

export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
