export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatYearMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

export function getCurrentYearMonth(): string {
  return formatYearMonth(new Date());
}

export function getCurrentBillingEndYearMonth(startDay: number): string {
  const today = new Date();
  const safeStartDay = Math.min(Math.max(startDay, 1), 28);

  if (safeStartDay === 1 || today.getDate() < safeStartDay) {
    return formatYearMonth(today);
  }

  return formatYearMonth(new Date(today.getFullYear(), today.getMonth() + 1, 1));
}

export type BillingPeriod = {
  startDate: string;
  endDate: string;
};

export function shiftBillingEndYearMonth(
  billingEndYearMonth: string,
  amount: number,
): string {
  const [yearText, monthText] = billingEndYearMonth.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  if (!year || !month) {
    return formatYearMonth(new Date());
  }

  return formatYearMonth(new Date(year, month - 1 + amount, 1));
}

export function isValidDateInput(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function normalizeDateInput(value: string): string | null {
  const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function getBillingPeriod(
  billingEndYearMonth: string,
  startDay: number,
): BillingPeriod {
  const [yearText, monthText] = billingEndYearMonth.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const safeStartDay = Math.min(Math.max(startDay, 1), 28);

  if (!year || !month) {
    return getBillingPeriod(getCurrentYearMonth(), safeStartDay);
  }

  if (safeStartDay === 1) {
    return {
      startDate: formatDateInput(new Date(year, month - 1, 1)),
      endDate: formatDateInput(new Date(year, month, 0)),
    };
  }

  return {
    startDate: formatDateInput(new Date(year, month - 2, safeStartDay)),
    endDate: formatDateInput(new Date(year, month - 1, safeStartDay - 1)),
  };
}

export function isDateInBillingPeriod(date: string, period: BillingPeriod): boolean {
  if (!isValidDateInput(date)) {
    return false;
  }

  return date >= period.startDate && date <= period.endDate;
}

export function formatBillingEndYearMonthLabel(billingEndYearMonth: string): string {
  const [year, month] = billingEndYearMonth.split('-');
  const monthNumber = Number(month);

  if (!/^\d{4}$/.test(year) || monthNumber < 1 || monthNumber > 12) {
    return billingEndYearMonth;
  }

  return `${year}年${monthNumber}月分`;
}
