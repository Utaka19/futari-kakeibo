import type { Expense, Settlement } from '@/src/types/expense';

export function calculateSettlement(expenses: Expense[]): Settlement {
  const splitExpenses = expenses.filter((expense) => expense.isShared && expense.isSplit);
  const targetTotal = splitExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const mePaid = splitExpenses
    .filter((expense) => expense.payer === 'me')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const partnerPaid = splitExpenses
    .filter((expense) => expense.payer === 'partner')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const eachShare = targetTotal / 2;
  const meBalance = mePaid - eachShare;

  if (meBalance > 0) {
    return {
      targetTotal,
      mePaid,
      partnerPaid,
      meShare: eachShare,
      partnerShare: eachShare,
      payer: 'partner',
      amount: meBalance,
    };
  }

  if (meBalance < 0) {
    return {
      targetTotal,
      mePaid,
      partnerPaid,
      meShare: eachShare,
      partnerShare: eachShare,
      payer: 'me',
      amount: Math.abs(meBalance),
    };
  }

  return {
    targetTotal,
    mePaid,
    partnerPaid,
    meShare: eachShare,
    partnerShare: eachShare,
    payer: null,
    amount: 0,
  };
}

export function formatYen(amount: number): string {
  return Math.round(amount).toLocaleString('ja-JP');
}
