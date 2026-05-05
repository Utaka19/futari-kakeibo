# ふたり家計簿

「ふたり家計簿」は、あとでまとめて計算しなくていい家計簿アプリです。

カップル・夫婦で使うことを想定し、使ったその場で支出を記録して、あとでどちらがいくら払えばよいかを自動で計算します。

## コンセプト

- あとでまとめて計算しなくていい家計簿
- カップル・夫婦で使う
- その場で支出を記録し、精算を自動計算する

## 現在の機能

- 支出追加
- 支払者選択
- 共有ON/OFF
- 折半ON/OFF
- 精算計算
- 支出一覧
- AsyncStorage保存

## 技術構成

- React Native（Expo）
- Expo Router
- AsyncStorage

## インストール手順

1. 依存関係をインストールします。

   ```bash
   npm install
   ```

2. 開発サーバーを起動します。

   ```bash
   npx expo start
   ```

3. 表示された案内に従って、iOSシミュレーター、Androidエミュレーター、Expo Go、またはWebで起動します。

## よく使うコマンド

```bash
npm run lint
```

コードのLintチェックを実行します。

```bash
npx tsc --noEmit
```

TypeScriptの型チェックを実行します。

```bash
npx expo start
```

Expoの開発サーバーを起動します。

## 主なファイル構成

```text
app/
  (tabs)/
    index.tsx      # 家計簿のメイン画面
    explore.tsx    # MVP構成メモ画面

src/
  constants/
    storage.ts     # AsyncStorageのキー
  types/
    expense.ts     # 支出データの型
  utils/
    settlement.ts  # 精算計算ロジック
```

## データ保存

支出データはAsyncStorageに保存しています。

現在はFirebaseなどの外部バックエンドは使っていません。アプリ内のローカル保存だけで動くシンプルな構成です。

## 開発方針

- 初心者でも読みやすいコードにする
- できるだけシンプルに実装する
- 既存のExpo Router構成を維持する
- 機能を小さく追加して確認しやすくする
