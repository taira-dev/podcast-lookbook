# Podcast Lookbook

ポッドキャスト動画の編集見本帳。参考YouTube10本から編集の型を選び、字幕・話題タイトル・ロゴ・名前ラベルなどを画面上で調整して見え方を確かめ、「依頼文をコピー」で編集依頼（日本語の依頼文＋設定JSON）を出す、1枚の静的HTMLです。

## 使い方

1. 左の「パターン」から型を選ぶ（10種）。右の「調整」に初期値が入り、真ん中のプレビューが変わる
2. ショット（引き・寄り・1人）と場面（通常・強調テロップ・冒頭のプロフィール）を切り替えて確認する
3. 「自分の画像を置く」で、今見ているショットの背景を手元の画像に差し替えられる（ブラウザ内だけ。どこにも送信しない）
4. 「参考動画を見る」で、参考YouTubeを該当シーンの秒数から再生する（公式の埋め込み）
5. 決まったら「依頼文をコピー」。依頼文と `style.json` がクリップボードに入る（コピーできない環境では画面のテキスト欄に出る）
6. 「このURLを共有」で、今の状態を含んだURLをコピーできる。URLを開けば同じ画面になる

## ファイル

- `index.html` … 本体（外部読み込みは Google Fonts のみ）
- `img/shot_wide.jpg` `img/shot_close.jpg` `img/shot_solo.jpg` … プレビュー用の見本コマ（AI生成・1920×1080・実在の人物ではない）

ローカルで試すときは `index.html` をブラウザで開くだけで動きます。

## 設定JSON（style.json）の形

```json
{
  "version": 1,
  "pattern": 3,
  "pattern_name": "白明朝",
  "ref": { "youtube_id": "...", "start_sec": 600 },
  "spec": {
    "cap":   { "on": true, "font": "mincho|gothic|maru", "size": 1.0, "bottom": 7, "color": "#FFFFFF",
               "spk": false, "spkMode": "fill|stroke", "c1": "#FFFFFF", "c2": "#FFF0A8", "stroke": "none|thin|thick",
               "shadow": "none|soft|hard", "plate": "none|band|white", "lines": 2 },
    "emph":  { "on": true, "style": "big|marker" },
    "title": { "on": true, "style": "band|white|dark", "pos": "tl|tr", "text": "..." },
    "logo":  { "on": true, "pos": "tr|tl|br|bl", "style": "plate|transparent", "size": 1.0 },
    "name":  { "on": false, "pos": "bl|br", "style": "white|dark" },
    "prof":  { "on": false, "style": "white|dark|timeline" },
    "digest": false,
    "cam": "auto|wide|split",
    "bgm": "none|light|ask"
  }
}
```

- `size` は字幕の高さの倍率（1.0 = 画面高の約5.8%）、`bottom` は画面下端からの位置（%）
- `spk` が true のとき、ホストは `c1`、ゲストは `c2` の色。`spkMode` が `fill` なら文字の色、`stroke` なら縁の色（文字は白）
- `cam` と `bgm` は依頼文に文字で入るだけで、プレビューには出ない（`split` は編集側で要相談）

## 公開

- Cloudflare Pages: `wrangler pages deploy . --project-name podcast-lookbook --branch main --commit-dirty=true`
- GitHub Pages: `main` ブランチのルートを公開

参考動画の著作権は各権利者に帰属します。参考はYouTubeの公式埋め込みで表示し、静止画の転載はしていません。
