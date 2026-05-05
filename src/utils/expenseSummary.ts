import type { Expense, ExpenseCategory } from '@/src/types/expense';

export type CategoryTotal = {
  category: ExpenseCategory;
  amount: number;
};

export type ExpenseSummaryData = {
  totalAmount: number;
  mePaidAmount: number;
  partnerPaidAmount: number;
  sharedAmount: number;
  splitAmount: number;
  categoryTotals: CategoryTotal[];
};

export function calculateExpenseSummary(
  expenses: Expense[],
  categories: ExpenseCategory[],
): ExpenseSummaryData {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const mePaidAmount = expenses
    .filter((expense) => expense.payer === 'me')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const partnerPaidAmount = expenses
    .filter((expense) => expense.payer === 'partner')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const sharedAmount = expenses
    .filter((expense) => expense.isShared)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const splitAmount = expenses
    .filter((expense) => expense.isShared && expense.isSplit && !expense.isSettled)
    .reduce((sum, expense) => sum + expense.amount, 0);
  const categoryTotals = categories
    .map((category) => ({
      category,
      amount: expenses
        .filter((expense) => expense.category === category)
        .reduce((sum, expense) => sum + expense.amount, 0),
    }))
    .filter((item) => item.amount > 0);

  return {
    totalAmount,
    mePaidAmount,
    partnerPaidAmount,
    sharedAmount,
    splitAmount,
    categoryTotals,
  };
}
