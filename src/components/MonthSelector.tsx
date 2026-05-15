import { StyleSheet, Text, View } from 'react-native';

import { formatBillingMonthLabel } from '@/src/utils/date';

type MonthSelectorProps = {
  isCurrentPeriod: boolean;
  periodEndDate: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToCurrentMonth: () => void;
};

export function MonthSelector({
  isCurrentPeriod,
  periodEndDate,
  onPrevMonth,
  onNextMonth,
  onGoToCurrentMonth,
}: MonthSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.monthSwitcher}>
        <Text style={styles.monthButton} onPress={onPrevMonth}>
          前の期間
        </Text>
        <Text style={styles.currentMonth}>{formatBillingMonthLabel(periodEndDate)}</Text>
        <Text style={styles.monthButton} onPress={onNextMonth}>
          次の期間
        </Text>
      </View>
      {!isCurrentPeriod && (
        <Text style={styles.currentMonthButton} onPress={onGoToCurrentMonth}>
          現在の期間へ戻る
        </Text>
      )}
    </View>
  );
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
