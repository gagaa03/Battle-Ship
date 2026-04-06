繁體中文 | [English](./README.md)

# 戰艦遊戲（Battle-Ship）

經典海戰桌遊 **Battleship** 的瀏覽器版本，使用原生 JavaScript 與 Webpack 開發。

**線上試玩**：[https://gagaa03.github.io/Battle-Ship/](https://gagaa03.github.io/Battle-Ship/)

---

## 功能特色

- **單人模式** — 與電腦對手對決
- **雙人模式** — 本地雙人對戰，換手時顯示過場畫面，保護對方看不到你的棋盤
- **拖放放置船艦** — 以直覺的拖曳方式在棋盤上排列船艦
- **船艦旋轉** — 自由切換水平或垂直擺放方向
- **隨機攻擊策略** — 電腦以隨機方式攻擊，命中後會優先攻擊相鄰格
- **深色主題介面** — 簡潔美觀的 UI，搭配自訂字型與色彩標示

---

## 遊戲說明

### 放置船艦
1. 選擇遊戲模式（單人 或 雙人）
2. 將船艦拖曳到 10x10 的格子上
3. 切換旋轉按鈕改變船艦方向
4. 若想重新排列，可點擊重置清空棋盤

### 戰鬥
- 點擊對方棋盤上的格子進行攻擊
- **紅色** = 命中、**暗色** = 未命中、**綠色** = 己方船艦
- 命中可獲得額外一次攻擊機會
- 率先擊沉對方所有船艦者獲勝

### 船艦列表
| 船艦 | 長度 |
|------|------|
| 驅逐艦 | 4 格 |
| 潛水艇 | 3 格 |
| 巡邏艇 | 2 格 |

---

## 技術棧

| 工具 | 用途 |
|------|------|
| JavaScript（ES6 模組） | 核心遊戲邏輯 |
| Webpack 5 | 模組打包 |
| Babel | JavaScript 轉譯 |
| CSS（自訂屬性） | 樣式與深色主題 |
| HTML5 Drag API | 船艦拖放介面 |

---

## 快速開始

直接開啟[線上試玩](https://gagaa03.github.io/Battle-Ship/)即可，無需安裝任何工具。

若要在本機開發：

```bash
git clone https://github.com/gagaa03/Battle-Ship.git
cd Battle-Ship
npm install
npm start        # 開發伺服器，網址為 http://localhost:8080
npm run build    # 建置輸出至 dist/
npm run watch    # 檔案變更時自動重新建置
```

> 本機開發需安裝 [Node.js](https://nodejs.org/)。

---

## 專案結構

```
Battle-Ship/
├── src/
│   ├── main.js          # 遊戲控制器 — 處理 UI 事件與遊戲流程
│   ├── ship.js          # 船艦類別 — 追蹤長度、座標與受損狀態
│   ├── gameboard.js     # 棋盤類別 — 管理船艦放置與攻擊紀錄
│   ├── player.js        # 玩家類別 — 人類玩家與電腦玩家邏輯
│   ├── dom.js           # DOM 渲染 — 棋盤與訊息的畫面更新
│   ├── index.html       # HTML 模板
│   └── style.css        # 深色主題樣式
├── test/
│   ├── ship.test.js
│   ├── gameboard.test.js
│   └── player.test.js
├── dist/                # 編譯輸出目錄
├── webpack.config.js
└── package.json
```
