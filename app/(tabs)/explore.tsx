import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const screens = ['支出追加画面', '精算サマリー画面', '支出一覧画面'];
const nextScreens = ['履歴詳細画面', 'パートナー設定画面', '月次レポート画面'];

export default function MvpScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>MVP構成</Text>
        <Text style={styles.description}>
          最初は支出をその場で登録し、共有かつ折半の支出だけを精算対象にします。
        </Text>

        <Section title="今回実装する画面" items={screens} />
        <Section title="次に追加しやすい画面" items={nextScreens} />

        <View style={styles.note}>
          <Text style={styles.noteTitle}>データ管理</Text>
          <Text style={styles.noteText}>
            MVPではFirebaseを使わず、画面内のuseStateで支出配列を管理します。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <Text key={item} style={styles.item}>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
  container: {
    padding: 20,
  },
  title: {
    color: '#222222',
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    color: '#666666',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 18,
    padding: 16,
  },
  sectionTitle: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  item: {
    color: '#333333',
    fontSize: 15,
    lineHeight: 28,
  },
  note: {
    backgroundColor: '#EAF2FF',
    borderRadius: 8,
    marginTop: 18,
    padding: 16,
  },
  noteTitle: {
    color: '#0F3D7A',
    fontSize: 16,
    fontWeight: '700',
  },
  noteText: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
});
