import { StyleSheet, Text, View } from 'react-native';

import type { ExpenseCategory } from '@/src/types/expense';
import { formatYen } from '@/src/utils/settlement';

export type CategoryTotal = {
  category: ExpenseCategory;
  amount: number;
};

type ExpenseSummaryProps = {
  totalAmount: number;
  sharedAmount: number;
  splitAmount: number;
  categoryTotals: CategoryTotal[];
};

export function ExpenseSummary({
  totalAmount,
  sharedAmount,
  splitAmount,
  categoryTotals,
}: ExpenseSummaryProps) {
  return (
    <>
      <View style={styles.summaryCards}>
        <SummaryCard label="合計支出" amount={totalAmount} />
        <SummaryCard label="共有支出" amount={sharedAmount} />
        <SummaryCard label="折半対象" amount={splitAmount} />
      </View>

      {categoryTotals.length > 0 && (
        <View style={styles.categorySummary}>
          <Text style={styles.sectionTitle}>カテゴリ別合計</Text>
          {categoryTotals.map((item) => (
            <View key={item.category} style={styles.categoryTotalRow}>
              <Text style={styles.categoryTotalLabel}>{item.category}</Text>
              <Text style={styles.categoryTotalAmount}>{formatYen(item.amount)}円</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function SummaryCard({ label, amount }: { label: string; amount: number }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryCardLabel}>{label}</Text>
      <Text style={styles.summaryCardAmount}>{formatYen(amount)}円</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCards: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flex: 1,
    minHeight: 78,
    padding: 12,
  },
  summaryCardLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryCardAmount: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  categorySummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  categoryTotalRow: {
    alignItems: 'center',
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  categoryTotalLabel: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '700',
  },
  categoryTotalAmount: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
});
