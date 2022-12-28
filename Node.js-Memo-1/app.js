const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  //模擬從database取得資料
  const party = [
    { name: "凌晨晚餐", level: 66, classes: "劍士" },
    { name: "鈣質不足", level: 77, classes: "法師" },
    { name: "森林男孩", level: 88, classes: "盜賊" },
  ];
  res.render("index", { party });
});

app.get("/example", (req, res) => {
  //從req.query解構出name,level,classes
  let { name, level, classes } = req.query;
  //傳送至回應頁面
  res.render("response", { name, level, classes });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
