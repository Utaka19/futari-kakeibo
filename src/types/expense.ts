export type Payer = 'me' | 'partner';

export type Expense = {
  id: string;
  amount: number;
  payer: Payer;
  isShared: boolean;
  isSplit: boolean;
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
