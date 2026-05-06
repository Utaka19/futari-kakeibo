import { StyleSheet, Text, View } from 'react-native';

import { getCurrentYearMonth } from '@/src/utils/date';

type MonthSelectorProps = {
  selectedYearMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToCurrentMonth: () => void;
};

export function MonthSelector({
  selectedYearMonth,
  onPrevMonth,
  onNextMonth,
  onGoToCurrentMonth,
}: MonthSelectorProps) {
  const isCurrentMonth = selectedYearMonth === getCurrentYearMonth();

  return (
    <View style={styles.container}>
      <View style={styles.monthSwitcher}>
        <Text style={styles.monthButton} onPress={onPrevMonth}>
          前の月
        </Text>
        <Text style={styles.currentMonth}>{formatJapaneseYearMonth(selectedYearMonth)}</Text>
        <Text style={styles.monthButton} onPress={onNextMonth}>
          次の月
        </Text>
      </View>
      {!isCurrentMonth && (
        <Text style={styles.currentMonthButton} onPress={onGoToCurrentMonth}>
          今月へ戻る
        </Text>
      )}
    </View>
  );
}

function formatJapaneseYearMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const monthNumber = Number(month);

  if (!year || !monthNumber) {
    return yearMonth;
  }

  return `${year}年${monthNumber}月`;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  monthSwitcher: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthButton: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  currentMonth: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  currentMonthButton: {
    alignSelf: 'center',
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
    paddingVertical: 4,
  },
});
