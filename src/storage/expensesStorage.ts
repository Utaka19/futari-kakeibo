import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/src/constants/storage';
import type { Expense } from '@/src/types/expense';

export async function loadExpenses(): Promise<Expense[]> {
  try {
    const storedExpenses = await AsyncStorage.getItem(STORAGE_KEYS.expenses);

    if (!storedExpenses) {
      return [];
    }

    const parsedExpenses = JSON.parse(storedExpenses);

    if (Array.isArray(parsedExpenses)) {
      return parsedExpenses;
    }
  } catch (error) {
    console.warn('支出データの読み込みに失敗しました。', error);
  }

  return [];
}

export async function saveExpenses(expenses: Expense[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
  } catch (error) {
    console.warn('支出データの保存に失敗しました。', error);
  }
}
