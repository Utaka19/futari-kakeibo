import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Settlement } from '@/src/types/expense';
import { formatYen } from '@/src/utils/settlement';

type SettlementSummaryProps = {
  settlement: Settlement;
  canSettle: boolean;
  onSettle: () => void;
};

export function SettlementSummary({ settlement, canSettle, onSettle }: SettlementSummaryProps) {
  return (
    <View style={styles.summary}>
      <Text style={styles.sectionTitle}>精算</Text>
      <Text style={styles.summaryText}>対象合計: {formatYen(settlement.targetTotal)}円</Text>
      <Text style={styles.summaryText}>自分の支払い: {formatYen(settlement.mePaid)}円</Text>
      <Text style={styles.summaryText}>相手の支払い: {formatYen(settlement.partnerPaid)}円</Text>
      <Text style={styles.resultText}>
        {settlement.payer === null
          ? '精算は不要です'
          : `${settlement.payer === 'me' ? '自分' : '相手'}が${formatYen(
              settlement.amount,
            )}円払う`}
      </Text>
      <Pressable
        disabled={!canSettle}
        style={[styles.settleButton, !canSettle && styles.settleButtonDisabled]}
        onPress={onSettle}>
        <Text style={[styles.settleButtonText, !canSettle && styles.settleButtonTextDisabled]}>
          精算済みにする
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: '#EAF2FF',
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  summaryText: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 22,
  },
  resultText: {
    color: '#0F3D7A',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  settleButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    marginTop: 14,
    paddingVertical: 12,
  },
  settleButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  settleButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  settleButtonTextDisabled: {
    color: '#6B7280',
  },
});
