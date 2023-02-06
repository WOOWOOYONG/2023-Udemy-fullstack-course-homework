# Express + ejs 簡單練習

## 筆記

1. 送出表單時預設 method="GET"
2. 在 form 的 action 屬性在 route 加上 /example
3. req.query 是一個物件，包含 route 當中’?'後面的 key-value pair 包含在 form 內有設定 name 的值
4. 在 express 使用 app.get()當 route 為/example 時取出 req.query 的資料
5. res.render 套用取出的資料後送出 ejs page，將資料渲染到頁面
