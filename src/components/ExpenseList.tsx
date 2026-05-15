import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Expense } from '@/src/types/expense';
import { formatYen } from '@/src/utils/settlement';

type ExpenseListProps = {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  onUnsettle: (id: string) => void;
};

export function ExpenseList({ expenses, onDelete, onEdit, onUnsettle }: ExpenseListProps) {
  return (
    <View style={styles.expenseList}>
      <Text style={styles.sectionTitle}>支出一覧</Text>
      {expenses.length === 0 ? (
        <Text style={styles.emptyText}>まだ支出がありません。</Text>
      ) : (
        expenses.map((item) => (
          <ExpenseItem
            key={item.id}
            expense={item}
            onDelete={onDelete}
            onEdit={onEdit}
            onUnsettle={onUnsettle}
          />
        ))
      )}
    </View>
  );
}

function ExpenseItem({
  expense,
  onDelete,
  onEdit,
  onUnsettle,
}: {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  onUnsettle: (id: string) => void;
}) {
  const badge = getExpenseBadge(expense);

  return (
    <View style={[styles.expenseItem, expense.isSettled && styles.expenseItemSettled]}>
      <View style={styles.expenseContent}>
        <Text style={styles.expenseAmount}>{formatYen(expense.amount)}円</Text>
        <Text style={styles.expenseCategory}>
          {expense.category} / {expense.date}
        </Text>
        {!!expense.memo && <Text style={styles.expenseMemo}>{expense.memo}</Text>}
        <Text style={styles.expenseMeta}>支払者: {expense.payer === 'me' ? '自分' : '相手'}</Text>
      </View>
      <View style={styles.expenseActions}>
        <Text
          style={[
            styles.expenseBadge,
            badge.type === 'splitTarget' && styles.expenseBadgeTarget,
            badge.type === 'shared' && styles.expenseBadgeShared,
            badge.type === 'personal' && styles.expenseBadgePersonal,
            badge.type === 'settled' && styles.expenseBadgeSettled,
          ]}>
          {badge.label}
        </Text>
        {expense.isSettled && (
          <Pressable style={styles.unsettleButton} onPress={() => onUnsettle(expense.id)}>
            <Text style={styles.unsettleButtonText}>未精算に戻す</Text>
          </Pressable>
        )}
        <Pressable style={styles.editButton} onPress={() => onEdit(expense)}>
          <Text style={styles.editButtonText}>編集</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={() => onDelete(expense.id)}>
          <Text style={styles.deleteButtonText}>削除</Text>
        </Pressable>
      </View>
    </View>
  );
}

type ExpenseBadge = {
  label: string;
  type: 'personal' | 'settled' | 'shared' | 'splitTarget';
};

function getExpenseBadge(expense: Expense): ExpenseBadge {
  if (expense.isSettled) {
    return {
      label: '精算済み',
      type: 'settled',
    };
  }

  if (expense.isShared && expense.isSplit) {
    return {
      label: '精算対象',
      type: 'splitTarget',
    };
  }

  if (expense.isShared) {
    return {
      label: 'ふたりの支出',
      type: 'shared',
    };
  }

  return {
    label: '個人支出',
    type: 'personal',
  };
}

const styles = StyleSheet.create({
  expenseList: {
    paddingTop: 16,
  },
  sectionTitle: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
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
  expenseItemSettled: {
    backgroundColor: '#F3F4F6',
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
  expenseBadgeTarget: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
  },
  expenseBadgeShared: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  expenseBadgePersonal: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
  },
  expenseBadgeSettled: {
    backgroundColor: '#E5E7EB',
    color: '#6B7280',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  unsettleButton: {
    backgroundColor: '#E0F2FE',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  unsettleButtonText: {
    color: '#075985',
    fontSize: 12,
    fontWeight: '700',
  },
  editButton: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  editButtonText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '700',
  },
  deleteButtonText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '700',
  },
});
