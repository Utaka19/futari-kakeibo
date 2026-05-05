import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ExpenseForm } from '@/src/components/ExpenseForm';
import { ExpenseList } from '@/src/components/ExpenseList';
import { ExpenseSummary } from '@/src/components/ExpenseSummary';
import { SettlementSummary } from '@/src/components/SettlementSummary';
import { loadExpenses, saveExpenses } from '@/src/storage/expensesStorage';
import type { Expense, ExpenseCategory, Payer } from '@/src/types/expense';
import { formatDateInput, formatYearMonth, shiftYearMonth } from '@/src/utils/date';
import { calculateExpenseSummary } from '@/src/utils/expenseSummary';
import { calculateSettlement } from '@/src/utils/settlement';

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
  const [selectedYearMonth, setSelectedYearMonth] = useState(formatYearMonth(new Date()));

  const visibleExpenses = useMemo(
    () => expenses.filter((expense) => expense.date.startsWith(selectedYearMonth)),
    [expenses, selectedYearMonth],
  );
  const settlement = useMemo(() => calculateSettlement(visibleExpenses), [visibleExpenses]);
  const sortedExpenses = useMemo(
    () =>
      [...visibleExpenses].sort(
        (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
      ),
    [visibleExpenses],
  );
  const expenseSummary = useMemo(
    () => calculateExpenseSummary(visibleExpenses, categories),
    [visibleExpenses],
  );
  const hasSettlementTarget = settlement.targetTotal > 0;

  useEffect(() => {
    const restoreExpenses = async () => {
      setExpenses(await loadExpenses());
    };

    restoreExpenses();
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
        if (
          expense.date.startsWith(selectedYearMonth) &&
          expense.isShared &&
          expense.isSplit &&
          !expense.isSettled
        ) {
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

          <View style={styles.monthSwitcher}>
            <Text style={styles.monthButton} onPress={() => setSelectedYearMonth((current) => shiftYearMonth(current, -1))}>
              前の月
            </Text>
            <Text style={styles.currentMonth}>{selectedYearMonth}</Text>
            <Text style={styles.monthButton} onPress={() => setSelectedYearMonth((current) => shiftYearMonth(current, 1))}>
              次の月
            </Text>
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

          <SettlementSummary
            settlement={settlement}
            canSettle={hasSettlementTarget}
            onSettle={settleCurrentExpenses}
          />

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
  monthSwitcher: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 12,
  },
  monthButton: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  currentMonth: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
});
