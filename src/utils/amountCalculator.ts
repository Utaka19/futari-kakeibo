export const maxAmountDigits = 8;

export type AmountCalculationResult =
  | {
      result: number;
      success: true;
    }
  | {
      error: string;
      success: false;
    };

export function calculateAddition(
  expression: string,
  { allowTrailingPlus }: { allowTrailingPlus: boolean },
): AmountCalculationResult {
  const targetExpression =
    allowTrailingPlus && expression.endsWith('+') ? expression.slice(0, -1) : expression;

  if (!targetExpression || targetExpression.includes('++') || targetExpression.endsWith('+')) {
    return {
      error: '計算式を確認してください。',
      success: false,
    };
  }

  const values = targetExpression.split('+');
  const total = values.reduce((sum, value) => {
    if (!isValidAmountPart(value)) {
      return Number.NaN;
    }

    return sum + Number(value);
  }, 0);

  if (!Number.isInteger(total) || total <= 0) {
    return {
      error: '計算式を確認してください。',
      success: false,
    };
  }

  if (isOverMaxDigits(String(total))) {
    return {
      error: '計算結果は8桁以内にしてください。',
      success: false,
    };
  }

  return {
    result: total,
    success: true,
  };
}

export function getCurrentAmountPartLength(expression: string): number {
  const values = expression.split('+');
  const currentValue = values[values.length - 1];

  return currentValue.length;
}

export function formatCalculatorExpression(expression: string): string {
  return expression
    .split('+')
    .map((value) => (value ? Number(value).toLocaleString('ja-JP') : ''))
    .join(' + ');
}

function isValidAmountPart(value: string): boolean {
  return /^\d+$/.test(value) && !isOverMaxDigits(value);
}

function isOverMaxDigits(value: string): boolean {
  return value.length > maxAmountDigits;
}
