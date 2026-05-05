import { StyleSheet, Text, View } from 'react-native';

import type { CategoryTotal, ExpenseSummaryData } from '@/src/utils/expenseSummary';
import { formatYen } from '@/src/utils/settlement';

export function ExpenseSummary({
  totalAmount,
  mePaidAmount,
  partnerPaidAmount,
  sharedAmount,
  splitAmount,
  categoryTotals,
  meCategoryTotals,
  partnerCategoryTotals,
}: ExpenseSummaryData) {
  return (
    <>
      <View style={styles.summaryCards}>
        <SummaryCard label="合計支出" amount={totalAmount} />
        <SummaryCard label="自分の支払合計" amount={mePaidAmount} />
        <SummaryCard label="相手の支払合計" amount={partnerPaidAmount} />
        <SummaryCard label="共有支出" amount={sharedAmount} />
        <SummaryCard label="折半対象" amount={splitAmount} />
      </View>

      {categoryTotals.length > 0 && (
        <View style={styles.categorySummary}>
          <Text style={styles.sectionTitle}>カテゴリ別合計</Text>
          <CategoryTotalList items={categoryTotals} />
          <Text style={styles.subsectionTitle}>自分のカテゴリ別合計</Text>
          <CategoryTotalList items={meCategoryTotals} />
          <Text style={styles.subsectionTitle}>相手のカテゴリ別合計</Text>
          <CategoryTotalList items={partnerCategoryTotals} />
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

function CategoryTotalList({ items }: { items: CategoryTotal[] }) {
  if (items.length === 0) {
    return <Text style={styles.emptyText}>まだ支出がありません</Text>;
  }

  return (
    <>
      {items.map((item) => (
        <View key={item.category} style={styles.categoryTotalRow}>
          <Text style={styles.categoryTotalLabel}>{item.category}</Text>
          <Text style={styles.categoryTotalAmount}>{formatYen(item.amount)}円</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexGrow: 1,
    flexBasis: '30%',
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
  subsectionTitle: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },
  emptyText: {
    color: '#777777',
    fontSize: 13,
    paddingVertical: 8,
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
