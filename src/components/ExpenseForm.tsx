import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import type { ExpenseCategory, Payer } from '@/src/types/expense';

type ExpenseFormProps = {
  amountText: string;
  payer: Payer;
  category: ExpenseCategory;
  memo: string;
  date: string;
  isShared: boolean;
  isSplit: boolean;
  isEditing: boolean;
  amountErrorMessage: string;
  dateErrorMessage: string;
  categories: ExpenseCategory[];
  onAmountTextChange: (value: string) => void;
  onPayerChange: (value: Payer) => void;
  onCategoryChange: (value: ExpenseCategory) => void;
  onMemoChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onIsSharedChange: (value: boolean) => void;
  onIsSplitChange: (value: boolean) => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
};

export function ExpenseForm({
  amountText,
  payer,
  category,
  memo,
  date,
  isShared,
  isSplit,
  isEditing,
  amountErrorMessage,
  dateErrorMessage,
  categories,
  onAmountTextChange,
  onPayerChange,
  onCategoryChange,
  onMemoChange,
  onDateChange,
  onIsSharedChange,
  onIsSplitChange,
  onSubmit,
  onCancelEdit,
}: ExpenseFormProps) {
  return (
    <View style={styles.form}>
      {isEditing && <Text style={styles.editingText}>支出を編集中です</Text>}

      <Text style={styles.label}>金額</Text>
      <TextInput
        value={amountText}
        onChangeText={onAmountTextChange}
        keyboardType="number-pad"
        placeholder="例: 3200"
        style={[styles.input, amountErrorMessage && styles.inputError]}
      />
      {!!amountErrorMessage && <Text style={styles.errorText}>{amountErrorMessage}</Text>}

      <Text style={styles.label}>支払者</Text>
      <View style={styles.segment}>
        <SegmentButton active={payer === 'me'} label="自分" onPress={() => onPayerChange('me')} />
        <SegmentButton
          active={payer === 'partner'}
          label="相手"
          onPress={() => onPayerChange('partner')}
        />
      </View>

      <Text style={styles.label}>カテゴリ</Text>
      <View style={styles.categoryGrid}>
        {categories.map((item) => (
          <SegmentButton
            key={item}
            active={category === item}
            label={item}
            onPress={() => onCategoryChange(item)}
          />
        ))}
      </View>

      <Text style={styles.label}>メモ</Text>
      <TextInput
        value={memo}
        onChangeText={onMemoChange}
        placeholder="例: ランチ"
        style={[styles.input, styles.memoInput]}
      />

      <Text style={styles.label}>日付</Text>
      <TextInput
        value={date}
        onChangeText={onDateChange}
        placeholder="例: 2026-05-05"
        style={[styles.input, dateErrorMessage && styles.inputError]}
      />
      {!!dateErrorMessage && <Text style={styles.errorText}>{dateErrorMessage}</Text>}

      <ToggleRow label="共有" value={isShared} onValueChange={onIsSharedChange} />
      <ToggleRow label="折半" value={isSplit} onValueChange={onIsSplitChange} />

      <Pressable style={styles.addButton} onPress={onSubmit}>
        <Text style={styles.addButtonText}>{isEditing ? '保存' : '追加'}</Text>
      </Pressable>
      {isEditing && (
        <Pressable style={styles.cancelButton} onPress={onCancelEdit}>
          <Text style={styles.cancelButtonText}>編集キャンセル</Text>
        </Pressable>
      )}
    </View>
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

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    gap: 12,
    marginTop: 16,
    padding: 16,
  },
  editingText: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    color: '#92400E',
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 8,
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
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
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
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '700',
  },
});
