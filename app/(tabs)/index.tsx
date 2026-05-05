import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { Expense, Payer } from '@/src/types/expense';
import { calculateSettlement, formatYen } from '@/src/utils/settlement';

export default function HomeScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amountText, setAmountText] = useState('');
  const [payer, setPayer] = useState<Payer>('me');
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
      isShared,
      isSplit,
    };

    setExpenses((currentExpenses) => [newExpense, ...currentExpenses]);
    setAmountText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
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
          <Text style={styles.summaryText}>相手の支払い: {formatYen(settlement.partnerPaid)}円</Text>
          <Text style={styles.resultText}>
            {settlement.payer === null
              ? '精算は不要です'
              : `${settlement.payer === 'me' ? '自分' : '相手'}が${formatYen(
                  settlement.amount,
                )}円払う`}
          </Text>
        </View>

        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<Text style={styles.sectionTitle}>支出一覧</Text>}
          ListEmptyComponent={<Text style={styles.emptyText}>まだ支出がありません。</Text>}
          renderItem={({ item }) => <ExpenseItem expense={item} />}
          contentContainerStyle={styles.listContent}
        />
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

function ExpenseItem({ expense }: { expense: Expense }) {
  return (
    <View style={styles.expenseItem}>
      <View>
        <Text style={styles.expenseAmount}>{formatYen(expense.amount)}円</Text>
        <Text style={styles.expenseMeta}>支払者: {expense.payer === 'me' ? '自分' : '相手'}</Text>
      </View>
      <Text style={styles.expenseBadge}>
        {expense.isShared && expense.isSplit ? '折半対象' : '対象外'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  container: {
    flex: 1,
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
  segment: {
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 4,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
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
  listContent: {
    paddingBottom: 24,
    paddingTop: 16,
  },
  emptyText: {
    color: '#777777',
    fontSize: 14,
  },
  expenseItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 14,
  },
  expenseAmount: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '700',
  },
  expenseMeta: {
    color: '#666666',
    fontSize: 13,
    marginTop: 4,
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
});
