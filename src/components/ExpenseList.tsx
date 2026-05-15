import { StyleSheet, Text, View } from 'react-native';

import { ExpenseItem } from '@/src/components/ExpenseItem';
import type { Expense } from '@/src/types/expense';

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
});
