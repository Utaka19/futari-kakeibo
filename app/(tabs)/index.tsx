import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

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

  const settlement = useMemo(() => calculateSettlement(expenses), [expenses]);

  const addExpense = () => {
    const amount = Number(amountText);

    if (!amountText || Number.isNaN(amount) || amount <= 0) {
      Alert.alert('入力エラー', '金額を1円以上で入力してください。');
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

    setExpenses((currentExpenses) => [newExpense, ...currentExpenses]);
    setAmountText('');
    setMemo('');
  };

  const deleteExpense = (id: string) => {
    setExpenses((currentExpenses) => currentExpenses.filter((expense) => expense.id !== id));
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

          <View style={styles.form}>
            <Text style={styles.label}>金額</Text>
            <TextInput
              value={amountText}
              onChangeText={setAmountText}
              keyboardType="number-pad"
              placeholder="例: 3200"
              style={styles.input}
            />

            <Text style={styles.label}>支払者</Text>
            <View style={styles.segment}>
              <SegmentButton active={payer === 'me'} label="自分" onPress={() => setPayer('me')} />
              <SegmentButton
                active={payer === 'partner'}
                label="相手"
                onPress={() => setPayer('partner')}
              />
            </View>

            <Text style={styles.label}>カテゴリ</Text>
            <View style={styles.categoryGrid}>
              {categories.map((item) => (
                <SegmentButton
                  key={item}
                  active={category === item}
                  label={item}
                  onPress={() => setCategory(item)}
                />
              ))}
            </View>

            <Text style={styles.label}>メモ</Text>
            <TextInput
              value={memo}
              onChangeText={setMemo}
              placeholder="例: ランチ"
              style={[styles.input, styles.memoInput]}
            />

            <Text style={styles.label}>日付</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="例: 2026-05-05"
              style={styles.input}
            />

            <ToggleRow label="共有" value={isShared} onValueChange={setIsShared} />
            <ToggleRow label="折半" value={isSplit} onValueChange={setIsSplit} />

            <Pressable style={styles.addButton} onPress={addExpense}>
              <Text style={styles.addButtonText}>追加</Text>
            </Pressable>
          </View>

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
          </View>

          <View style={styles.expenseList}>
            <Text style={styles.sectionTitle}>支出一覧</Text>
            {expenses.length === 0 ? (
              <Text style={styles.emptyText}>まだ支出がありません。</Text>
            ) : (
              expenses.map((item) => (
                <ExpenseItem key={item.id} expense={item} onDelete={deleteExpense} />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SegmentButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.segmentButton, active && styles.segmentButtonActive]} onPress={onPress}>
      <Text style={[styles.segmentButtonText, active && styles.segmentButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function ExpenseItem({
  expense,
  onDelete,
}: {
  expense: Expense;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.expenseItem}>
      <View style={styles.expenseContent}>
        <Text style={styles.expenseAmount}>{formatYen(expense.amount)}円</Text>
        <Text style={styles.expenseCategory}>
          {expense.category} / {expense.date}
        </Text>
        {!!expense.memo && <Text style={styles.expenseMemo}>{expense.memo}</Text>}
        <Text style={styles.expenseMeta}>支払者: {expense.payer === 'me' ? '自分' : '相手'}</Text>
      </View>
      <View style={styles.expenseActions}>
        <Text style={styles.expenseBadge}>
          {expense.isShared && expense.isSplit && !expense.isSettled ? '折半対象' : '対象外'}
        </Text>
        <Pressable style={styles.deleteButton} onPress={() => onDelete(expense.id)}>
          <Text style={styles.deleteButtonText}>削除</Text>
        </Pressable>
      </View>
    </View>
  );
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    gap: 12,
    padding: 16,
  },
  label: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F4F4F4',
    borderColor: '#DDDDDD',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 22,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  memoInput: {
    fontSize: 16,
  },
  segment: {
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    minWidth: 92,
    paddingVertical: 10,
  },
  segmentButtonActive: {
    backgroundColor: '#2563EB',
  },
  segmentButtonText: {
    color: '#555555',
    fontSize: 15,
    fontWeight: '700',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  toggleLabel: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 14,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
  expenseList: {
    paddingTop: 16,
  },
  emptyText: {
    color: '#777777',
    fontSize: 14,
  },
  expenseItem: {
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 14,
  },
  expenseContent: {
    flex: 1,
    paddingRight: 12,
  },
  expenseAmount: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '700',
  },
  expenseCategory: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },
  expenseMemo: {
    color: '#555555',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  expenseMeta: {
    color: '#666666',
    fontSize: 13,
    marginTop: 4,
  },
  expenseActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  expenseBadge: {
    backgroundColor: '#EEF2F7',
    borderRadius: 6,
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  deleteButtonText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '700',
  },
});
