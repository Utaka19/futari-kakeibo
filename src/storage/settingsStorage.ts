import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/src/constants/storage';

const DEFAULT_BILLING_START_DAY = 1;

export async function loadBillingStartDay(): Promise<number> {
  try {
    const storedBillingStartDay = await AsyncStorage.getItem(STORAGE_KEYS.billingStartDay);
    const billingStartDay = Number(storedBillingStartDay);

    if (isValidBillingStartDay(billingStartDay)) {
      return billingStartDay;
    }
  } catch (error) {
    console.warn('開始日設定の読み込みに失敗しました。', error);
  }

  return DEFAULT_BILLING_START_DAY;
}

export async function saveBillingStartDay(billingStartDay: number) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.billingStartDay, String(billingStartDay));
  } catch (error) {
    console.warn('開始日設定の保存に失敗しました。', error);
  }
}

function isValidBillingStartDay(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 28;
}
