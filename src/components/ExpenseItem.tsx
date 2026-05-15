import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Expense } from '@/src/types/expense';
import { formatYen } from '@/src/utils/settlement';

type ExpenseItemProps = {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
  onUnsettle: (id: string) => void;
};

type ExpenseBadge = {
  label: string;
  type: 'personal' | 'settled' | 'shared' | 'splitTarget';
};

export function ExpenseItem({ expense, onDelete, onEdit, onUnsettle }: ExpenseItemProps) {
  const badge = getExpenseBadge(expense);

  return (
    <View style={[styles.expenseItem, expense.isSettled && styles.expenseItemSettled]}>
      <View style={styles.expenseMainRow}>
        <Text style={styles.expenseCategory}>{expense.category}</Text>
        <Text style={styles.expenseAmount}>{formatYen(expense.amount)}円</Text>
      </View>

      <View style={styles.expenseMetaRow}>
        <Text style={styles.expenseMeta}>
          {expense.date} / 支払者: {expense.payer === 'me' ? '自分' : '相手'}
        </Text>
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
      </View>

      {!!expense.memo && <Text style={styles.expenseMemo}>{expense.memo}</Text>}

      <View style={styles.expenseActions}>
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
  expenseItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  expenseItemSettled: {
    backgroundColor: '#F3F4F6',
  },
  expenseMainRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  expenseAmount: {
    color: '#222222',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  expenseCategory: {
    color: '#222222',
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  expenseMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  expenseMemo: {
    color: '#555555',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
  expenseMeta: {
    color: '#666666',
    flex: 1,
    fontSize: 11,
  },
  expenseActions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  expenseBadge: {
    backgroundColor: '#EEF2F7',
    borderRadius: 999,
    color: '#374151',
    fontSize: 10,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
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
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  unsettleButton: {
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  unsettleButtonText: {
    color: '#075985',
    fontSize: 10,
    fontWeight: '700',
  },
  editButton: {
    backgroundColor: '#FFFBEB',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  editButtonText: {
    color: '#92400E',
    fontSize: 10,
    fontWeight: '700',
  },
  deleteButtonText: {
    color: '#991B1B',
    fontSize: 10,
    fontWeight: '700',
  },
});
