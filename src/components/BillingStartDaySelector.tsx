import { Pressable, StyleSheet, Text, View } from 'react-native';

type BillingStartDaySelectorProps = {
  billingStartDay: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function BillingStartDaySelector({
  billingStartDay,
  onDecrease,
  onIncrease,
}: BillingStartDaySelectorProps) {
  const canDecrease = billingStartDay > 1;
  const canIncrease = billingStartDay < 28;

  return (
    <View style={styles.billingControls}>
      <Pressable disabled={!canDecrease} onPress={onDecrease}>
        <Text style={[styles.billingButton, !canDecrease && styles.billingButtonDisabled]}>
          -1日
        </Text>
      </Pressable>
      <Text style={styles.billingTitle}>開始日: {billingStartDay}日</Text>
      <Pressable disabled={!canIncrease} onPress={onIncrease}>
        <Text style={[styles.billingButton, !canIncrease && styles.billingButtonDisabled]}>
          +1日
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  billingControls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  billingButton: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  billingButtonDisabled: {
    color: '#9CA3AF',
  },
  billingTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
});
