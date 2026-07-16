---
title: "GZen.io について"
description: "GZen.io は Go 言語のアドボカシーブログ兼ポートフォリオサイトです — 技術記事、トーク、厳選リソースを提供します。"
layout: "single"
---

## Go アドボカシーとエンジニアリングの技法

GZen.io は **Go 言語アドボカシーハブ**です — 技術ブログ、GDE ポートフォリオ、そして Go エコシステム全体をカバーするリソース集です。Go のシンプルさ、並行処理、可読性という哲学に情熱を注ぐ開発者によって運営されています。

---

## 6つのコンテンツ領域

Go エンジニアリングの幅広い分野を、詳細な記事、ベンチマーク、実践的なパターンを通じて探求します：

- **TUI** — Bubble Tea、Charm エコシステム、ターミナル UI パターン、Cobra + Viper CLI 設計
- **Web アプリ** — net/http、Gin、Echo、Chi、Templ、HTMX、WebSocket リアルタイム通信
- **API** — REST、gRPC、Connect-Go、OpenAPI コード生成、gqlgen GraphQL
- **クラウド** — Cloudflare Workers (TinyGo/WASM)、GCP SDK、サーバーレス Go、Ko ミニマルコンテナ
- **AI SDK** — Go ADK、Gemini SDK、LangChain Go、PicoClaw 超軽量エージェント
- **一般 Go** — 並行処理パターン、ジェネリクス、テスト（ファジング、テーブル駆動）、プロファイリング、モジュール設計

---

## GDE ロードマップ

このサイトは **Google Developer Expert（Go 言語）** への道のりを記録しています — カンファレンス登壇、ワークショップ資料、コミュニティ貢献、公開コンテンツを含みます。スピーキングページでは過去のトークとスライドをアーカイブしています。

---

## 技術スタック

GZen.io 自体が Go のエンジニアリング原則を体現しています：

1. **静的サイト** — [Hugo](https://gohugo.io)（Go 製）で構築。ランタイム依存ゼロ、データベース不要、Cloudflare CDN で即時グローバル配信。
2. **モノレポ自動化** — Go 製のカスタム CLI [`gzen-tool`](https://github.com/divineforge/gzen) で管理。Goroutine による並列マルチサイトビルドを 200ms 未満で完了。
3. **超軽量 AI** — **PicoClaw**（Go 製、<10MB RAM）でコンテンツワークフローと翻訳パイプラインを自動化。

---

## サポート

コンテンツが役立つと感じられた方は、以下の方法でサポートをお願いします：

- [GitHub Sponsors](https://github.com/sponsors/divineforge)
- [Buy Me a Coffee](https://buymeacoffee.com/divineforge)

皆様のサポートが、より深い記事の執筆やオープンソースへの貢献、カンファレンス参加を可能にします。
