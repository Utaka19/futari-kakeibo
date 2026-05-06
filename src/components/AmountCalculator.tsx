import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AmountCalculatorProps = {
  onApply: (amount: string) => void;
};

const maxAmountDigits = 8;
const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '+'];

export function AmountCalculator({ onApply }: AmountCalculatorProps) {
  const [expression, setExpression] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const preview = calculateAddition(expression, { allowTrailingPlus: true });

  const appendKey = (key: string) => {
    setExpression((current) => {
      if (key !== '+' && getCurrentValueLength(current) >= maxAmountDigits) {
        setErrorMessage('各金額は8桁以内で入力してください。');
        return current;
      }

      setErrorMessage('');
      return `${current}${key}`;
    });
  };

  const backspace = () => {
    setExpression((current) => current.slice(0, -1));
    setErrorMessage('');
  };

  const clear = () => {
    setExpression('');
    setErrorMessage('');
  };

  const apply = () => {
    const result = calculateAddition(expression, { allowTrailingPlus: false });

    if (!result.isValid) {
      setErrorMessage('計算内容を確認してください。');
      return;
    }

    onApply(String(result.total));
    clear();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.display}>{expression || '0'}</Text>
      {!!expression && (
        <Text style={[styles.previewText, !preview.isValid && styles.previewErrorText]}>
          {preview.isValid
            ? `計算結果: ${preview.total}円`
            : preview.errorMessage}
        </Text>
      )}
      {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <View style={styles.keyGrid}>
        {keys.map((key) => (
          <Pressable key={key} style={styles.keyButton} onPress={() => appendKey(key)}>
            <Text style={styles.keyButtonText}>{key}</Text>
          </Pressable>
        ))}
        <Pressable style={[styles.keyButton, styles.clearButton]} onPress={backspace}>
          <Text style={styles.clearButtonText}>⌫</Text>
        </Pressable>
        <Pressable style={[styles.keyButton, styles.clearButton]} onPress={clear}>
          <Text style={styles.clearButtonText}>クリア</Text>
        </Pressable>
      </View>
      <Pressable style={styles.applyButton} onPress={apply}>
        <Text style={styles.applyButtonText}>決定</Text>
      </Pressable>
    </View>
  );
}

type CalculationResult =
  | {
      isValid: true;
      total: number;
    }
  | {
      errorMessage: string;
      isValid: false;
    };

function calculateAddition(
  expression: string,
  { allowTrailingPlus }: { allowTrailingPlus: boolean },
): CalculationResult {
  const targetExpression =
    allowTrailingPlus && expression.endsWith('+') ? expression.slice(0, -1) : expression;

  if (!targetExpression || targetExpression.includes('++') || targetExpression.endsWith('+')) {
    return {
      errorMessage: '計算式を確認してください。',
      isValid: false,
    };
  }

  const values = targetExpression.split('+');
  const total = values.reduce((sum, value) => {
    if (!/^\d+$/.test(value) || value.length > maxAmountDigits) {
      return Number.NaN;
    }

    return sum + Number(value);
  }, 0);

  if (!Number.isInteger(total) || total <= 0) {
    return {
      errorMessage: '計算式を確認してください。',
      isValid: false,
    };
  }

  if (String(total).length > maxAmountDigits) {
    return {
      errorMessage: '計算結果は8桁以内にしてください。',
      isValid: false,
    };
  }

  return {
    isValid: true,
    total,
  };
}

function getCurrentValueLength(expression: string): number {
  const values = expression.split('+');
  const currentValue = values[values.length - 1];

  return currentValue.length;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  display: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  previewText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  previewErrorText: {
    color: '#DC2626',
  },
  keyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keyButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 6,
    borderWidth: 1,
    flexBasis: '22%',
    flexGrow: 1,
    paddingVertical: 10,
  },
  keyButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  clearButton: {
    backgroundColor: '#F3F4F6',
  },
  clearButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  applyButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
