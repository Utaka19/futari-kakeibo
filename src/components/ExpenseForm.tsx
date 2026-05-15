import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { AmountCalculator } from '@/src/components/AmountCalculator';
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
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const applyCalculatedAmount = (amount: string) => {
    onAmountTextChange(amount);
    setIsCalculatorOpen(false);
  };

  return (
    <View style={styles.form}>
      {isEditing && <Text style={styles.editingText}>支出を編集中です</Text>}

      <View style={styles.formRow}>
        <Text style={styles.rowLabel}>金額</Text>
        <View style={styles.rowContent}>
          <View style={styles.amountRow}>
            <TextInput
              value={amountText}
              onChangeText={onAmountTextChange}
              keyboardType="number-pad"
              maxLength={8}
              placeholder="例: 3200"
              style={[styles.input, styles.amountInput, amountErrorMessage && styles.inputError]}
            />
            <Pressable
              style={styles.calculatorButton}
              onPress={() => setIsCalculatorOpen((current) => !current)}>
              <Text style={styles.calculatorButtonText}>計算</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {!!amountErrorMessage && <Text style={styles.errorText}>{amountErrorMessage}</Text>}
      {isCalculatorOpen && <AmountCalculator onApply={applyCalculatedAmount} />}

      <View style={styles.formRow}>
        <Text style={styles.rowLabel}>支払者</Text>
        <View style={[styles.rowContent, styles.segment]}>
          <SegmentButton active={payer === 'me'} label="自分" onPress={() => onPayerChange('me')} />
          <SegmentButton
            active={payer === 'partner'}
            label="相手"
            onPress={() => onPayerChange('partner')}
          />
        </View>
      </View>

      <View style={styles.formRow}>
        <Text style={styles.rowLabel}>日付</Text>
        <TextInput
          value={date}
          onChangeText={onDateChange}
          maxLength={10}
          placeholder="例: 2026-05-05"
          style={[
            styles.input,
            styles.compactInput,
            styles.rowContent,
            dateErrorMessage && styles.inputError,
          ]}
        />
      </View>
      {!!dateErrorMessage && <Text style={styles.errorText}>{dateErrorMessage}</Text>}

      <View style={styles.categoryGroup}>
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
      </View>

      <View style={styles.formRow}>
        <Text style={styles.rowLabel}>メモ</Text>
        <TextInput
          value={memo}
          onChangeText={onMemoChange}
          placeholder="例: ランチ"
          style={[styles.input, styles.compactInput, styles.memoInput, styles.rowContent]}
        />
      </View>

      <ToggleRow label="ふたりの支出" value={isShared} onValueChange={onIsSharedChange} />
      {isShared && <ToggleRow label="精算対象" value={isSplit} onValueChange={onIsSplitChange} />}

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
    gap: 9,
    marginTop: 16,
    padding: 14,
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
    fontSize: 13,
    fontWeight: '700',
  },
  formRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  rowLabel: {
    color: '#333333',
    fontSize: 13,
    fontWeight: '700',
    width: 54,
  },
  rowContent: {
    flex: 1,
  },
  amountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  amountInput: {
    flex: 1,
  },
  calculatorButton: {
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    minWidth: 64,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  calculatorButtonText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#F4F4F4',
    borderColor: '#DDDDDD',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 18,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  compactInput: {
    fontSize: 15,
    paddingVertical: 8,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
  memoInput: {
    fontSize: 14,
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
    gap: 6,
  },
  categoryGroup: {
    gap: 7,
  },
  segmentButton: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    minWidth: 92,
    paddingVertical: 8,
  },
  segmentButtonActive: {
    backgroundColor: '#2563EB',
  },
  segmentButtonText: {
    color: '#555555',
    fontSize: 14,
    fontWeight: '700',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 38,
  },
  toggleLabel: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 8,
    marginTop: 2,
    paddingVertical: 12,
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
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '700',
  },
});
