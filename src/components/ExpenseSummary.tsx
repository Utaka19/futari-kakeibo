import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMeCategoryOpen, setIsMeCategoryOpen] = useState(false);
  const [isPartnerCategoryOpen, setIsPartnerCategoryOpen] = useState(false);

  return (
    <>
      <View style={styles.summaryCards}>
        <SummaryCard label="合計支出" amount={totalAmount} />
        <SummaryCard label="自分の支払合計" amount={mePaidAmount} />
        <SummaryCard label="相手の支払合計" amount={partnerPaidAmount} />
      </View>

      <Pressable
        style={styles.detailToggle}
        onPress={() => setIsDetailOpen((current) => !current)}>
        <Text style={styles.detailToggleText}>
          {isDetailOpen ? '詳細を閉じる' : '詳細を見る'}
        </Text>
      </Pressable>

      {isDetailOpen && (
        <View style={styles.detailSummary}>
          <View style={styles.summaryCards}>
            <SummaryCard label="共有支出" amount={sharedAmount} />
            <SummaryCard label="折半対象" amount={splitAmount} />
          </View>

          <View style={styles.categorySummary}>
            <CollapsibleCategoryTotal
              isOpen={isCategoryOpen}
              items={categoryTotals}
              title="カテゴリ別合計"
              onToggle={() => setIsCategoryOpen((current) => !current)}
            />
            <CollapsibleCategoryTotal
              isOpen={isMeCategoryOpen}
              items={meCategoryTotals}
              title="自分のカテゴリ別合計"
              onToggle={() => setIsMeCategoryOpen((current) => !current)}
            />
            <CollapsibleCategoryTotal
              isOpen={isPartnerCategoryOpen}
              items={partnerCategoryTotals}
              title="相手のカテゴリ別合計"
              onToggle={() => setIsPartnerCategoryOpen((current) => !current)}
            />
          </View>
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

function CollapsibleCategoryTotal({
  isOpen,
  items,
  title,
  onToggle,
}: {
  isOpen: boolean;
  items: CategoryTotal[];
  title: string;
  onToggle: () => void;
}) {
  return (
    <View style={styles.categorySection}>
      <Pressable style={styles.categoryHeader} onPress={onToggle}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.toggleText}>{isOpen ? '閉じる' : '開く'}</Text>
      </Pressable>
      {isOpen && <CategoryTotalList items={items} />}
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
  detailToggle: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  detailToggleText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  detailSummary: {
    marginTop: 2,
  },
  categorySummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 12,
    padding: 16,
  },
  categorySection: {
    borderTopColor: '#EEEEEE',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  categoryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '700',
  },
  toggleText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
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
