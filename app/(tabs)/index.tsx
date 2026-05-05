import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ExpenseForm } from '@/src/components/ExpenseForm';
import { ExpenseList } from '@/src/components/ExpenseList';
import { ExpenseSummary } from '@/src/components/ExpenseSummary';
import { STORAGE_KEYS } from '@/src/constants/storage';
import type { Expense, ExpenseCategory, Payer } from '@/src/types/expense';
import { calculateSettlement, formatYen } from '@/src/utils/settlement';

const categories: ExpenseCategory[] = ['食費', '日用品', '交通費', 'その他'];

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amountText, setAmountText] = useState('');
  const [payer, setPayer] = useState<Payer>('me');
  const [category, setCategory] = useState<ExpenseCategory>('食費');
  const [memo, setMemo] = useState('');
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [isShared, setIsShared] = useState(true);
  const [isSplit, setIsSplit] = useState(true);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const settlement = useMemo(() => calculateSettlement(expenses), [expenses]);
  const sortedExpenses = useMemo(
    () => [...expenses].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    [expenses],
  );
  const expenseSummary = useMemo(() => calculateExpenseSummary(expenses), [expenses]);
  const hasSettlementTarget = settlement.targetTotal > 0;

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem(STORAGE_KEYS.expenses);

        if (!storedExpenses) {
          return;
        }

        const parsedExpenses = JSON.parse(storedExpenses);

        if (Array.isArray(parsedExpenses)) {
          setExpenses(parsedExpenses);
        }
      } catch (error) {
        console.warn('支出データの読み込みに失敗しました。', error);
        setExpenses([]);
      }
    };

    loadExpenses();
  }, []);

  const resetForm = () => {
    setAmountText('');
    setPayer('me');
    setCategory('食費');
    setMemo('');
    setDate(formatDateInput(new Date()));
    setIsShared(true);
    setIsSplit(true);
    setEditingExpenseId(null);
  };

  const submitExpense = () => {
    const amount = Number(amountText);

    if (!amountText || Number.isNaN(amount) || amount <= 0) {
      Alert.alert('入力エラー', '金額を1円以上で入力してください。');
      return;
    }

    if (editingExpenseId) {
      setExpenses((currentExpenses) => {
        const nextExpenses = currentExpenses.map((expense) => {
          if (expense.id !== editingExpenseId) {
            return expense;
          }

          return {
            ...expense,
            amount,
            payer,
            category,
            memo: memo.trim(),
            date,
            isShared,
            isSplit,
          };
        });
        saveExpenses(nextExpenses);

        return nextExpenses;
      });
      resetForm();
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount,
      payer,
      category,
      memo: memo.trim(),
      date,
      isShared,
      isSplit,
      isSettled: false,
    };

    setExpenses((currentExpenses) => {
      const nextExpenses = [newExpense, ...currentExpenses];
      saveExpenses(nextExpenses);

      return nextExpenses;
    });
    resetForm();
  };

  const startEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setAmountText(String(expense.amount));
    setPayer(expense.payer);
    setCategory(expense.category);
    setMemo(expense.memo);
    setDate(expense.date);
    setIsShared(expense.isShared);
    setIsSplit(expense.isSplit);
  };

  const deleteExpense = (id: string) => {
    setExpenses((currentExpenses) => {
      const nextExpenses = currentExpenses.filter((expense) => expense.id !== id);
      saveExpenses(nextExpenses);

      return nextExpenses;
    });

    if (editingExpenseId === id) {
      resetForm();
    }
  };

  const unsettleExpense = (id: string) => {
    setExpenses((currentExpenses) => {
      const nextExpenses = currentExpenses.map((expense) => {
        if (expense.id === id) {
          return {
            ...expense,
            isSettled: false,
          };
        }

        return expense;
      });
      saveExpenses(nextExpenses);

      return nextExpenses;
    });
  };

  const settleCurrentExpenses = () => {
    setExpenses((currentExpenses) => {
      const nextExpenses = currentExpenses.map((expense) => {
        if (expense.isShared && expense.isSplit && !expense.isSettled) {
          return {
            ...expense,
            isSettled: true,
          };
        }

        return expense;
      });
      saveExpenses(nextExpenses);

      return nextExpenses;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>ふたり家計簿</Text>
            <Text style={styles.subtitle}>使ったその場で登録して、折半額を自動計算します。</Text>
          </View>

          <ExpenseSummary
            totalAmount={expenseSummary.totalAmount}
            sharedAmount={expenseSummary.sharedAmount}
            splitAmount={expenseSummary.splitAmount}
            categoryTotals={expenseSummary.categoryTotals}
          />

          <ExpenseForm
            amountText={amountText}
            payer={payer}
            category={category}
            memo={memo}
            date={date}
            isShared={isShared}
            isSplit={isSplit}
            isEditing={!!editingExpenseId}
            categories={categories}
            onAmountTextChange={setAmountText}
            onPayerChange={setPayer}
            onCategoryChange={setCategory}
            onMemoChange={setMemo}
            onDateChange={setDate}
            onIsSharedChange={setIsShared}
            onIsSplitChange={setIsSplit}
            onSubmit={submitExpense}
            onCancelEdit={resetForm}
          />

          <View style={styles.summary}>
            <Text style={styles.sectionTitle}>精算</Text>
            <Text style={styles.summaryText}>対象合計: {formatYen(settlement.targetTotal)}円</Text>
            <Text style={styles.summaryText}>自分の支払い: {formatYen(settlement.mePaid)}円</Text>
            <Text style={styles.summaryText}>
              相手の支払い: {formatYen(settlement.partnerPaid)}円
            </Text>
            <Text style={styles.resultText}>
              {settlement.payer === null
                ? '精算は不要です'
                : `${settlement.payer === 'me' ? '自分' : '相手'}が${formatYen(
                    settlement.amount,
                  )}円払う`}
            </Text>
            <Pressable
              disabled={!hasSettlementTarget}
              style={[styles.settleButton, !hasSettlementTarget && styles.settleButtonDisabled]}
              onPress={settleCurrentExpenses}>
              <Text
                style={[
                  styles.settleButtonText,
                  !hasSettlementTarget && styles.settleButtonTextDisabled,
                ]}>
                精算済みにする
              </Text>
            </Pressable>
          </View>

          <ExpenseList
            expenses={sortedExpenses}
            onDelete={deleteExpense}
            onEdit={startEditExpense}
            onUnsettle={unsettleExpense}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async function saveExpenses(expenses: Expense[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
  } catch (error) {
    console.warn('支出データの保存に失敗しました。', error);
  }
}

function calculateExpenseSummary(expenses: Expense[]) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
    sharedAmount,
    splitAmount,
    categoryTotals,
  };
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 18,
    paddingBottom: 14,
  },
  title: {
    color: '#222222',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  summary: {
    backgroundColor: '#EAF2FF',
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  summaryText: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 22,
  },
  resultText: {
    color: '#0F3D7A',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  settleButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    marginTop: 14,
    paddingVertical: 12,
  },
  settleButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  settleButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  settleButtonTextDisabled: {
    color: '#6B7280',
  },
});
