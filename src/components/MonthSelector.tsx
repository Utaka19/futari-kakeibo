import { StyleSheet, Text, View } from 'react-native';

import { formatBillingEndYearMonthLabel } from '@/src/utils/date';

type MonthSelectorProps = {
  isCurrentPeriod: boolean;
  selectedBillingEndYearMonth: string;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onGoToCurrentMonth: () => void;
};

export function MonthSelector({
  isCurrentPeriod,
  selectedBillingEndYearMonth,
  onPrevPeriod,
  onNextPeriod,
  onGoToCurrentMonth,
}: MonthSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.monthSwitcher}>
        <Text style={styles.monthButton} onPress={onPrevPeriod}>
          前の期間
        </Text>
        <Text style={styles.currentMonth}>
          {formatBillingEndYearMonthLabel(selectedBillingEndYearMonth)}
        </Text>
        <Text style={styles.monthButton} onPress={onNextPeriod}>
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
