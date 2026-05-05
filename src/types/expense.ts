export type Payer = 'me' | 'partner';
export type ExpenseCategory = '食費' | '日用品' | '交通費' | 'その他';

export type Expense = {
  id: string;
  amount: number;
  payer: Payer;
  category: ExpenseCategory;
  memo: string;
  date: string;
  isShared: boolean;
  isSplit: boolean;
  isSettled: boolean;
};

export type Settlement = {
  targetTotal: number;
  mePaid: number;
  partnerPaid: number;
  meShare: number;
  partnerShare: number;
  payer: Payer | null;
  amount: number;
};
