import { StyleSheet, Text, View } from 'react-native';

type MonthSelectorProps = {
  selectedYearMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function MonthSelector({
  selectedYearMonth,
  onPrevMonth,
  onNextMonth,
}: MonthSelectorProps) {
  return (
    <View style={styles.monthSwitcher}>
      <Text style={styles.monthButton} onPress={onPrevMonth}>
        前の月
      </Text>
      <Text style={styles.currentMonth}>{formatJapaneseYearMonth(selectedYearMonth)}</Text>
      <Text style={styles.monthButton} onPress={onNextMonth}>
        次の月
      </Text>
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
  monthSwitcher: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 12,
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
});
