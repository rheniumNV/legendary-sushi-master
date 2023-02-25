```mermaid
sequenceDiagram
    ns->>server:connect
    server->>gm:new
    server-->>ns:ok
    ns->>server:init
    server->>gm:init
    server->>ns:clean
    loop
        server->>gm:updateRequest
    end
    loop
        ns->>server:resync
        ns->>server:gameEvent
        server->>ns:update
        ns->>server:updateFinish
    end
    server->>ns:report
    server->>ns:disconnect
    server->>gm:delete

```

- 多言語対応
- 両手使えるようにする。
- 地下コンベア
- 設計図追加イベント
- 設計図ビジュアル
- 支払い
- 壁のアップグレード
- お客さんの量を調整
- メニュー追加イベント
- 配置エラー処理
