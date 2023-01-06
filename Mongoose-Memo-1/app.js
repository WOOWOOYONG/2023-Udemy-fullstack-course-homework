const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;

app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/example")
  .then(() => {
    console.log("成功連結MongoDB......");
  })
  .catch((err) => {
    console.log(err);
  });

//設定Schema
//Schema Validators可以設定驗證
// const studentSchema = new Schema({
//   name: { type: String, required: [true, "名稱為必填"] },
//   age: { type: Number, min: [0, "年齡不能小於0"] },
//   major: String,
//   scholarship: {
//     merit: { type: Number, default: 0 },
//     other: { type: Number, default: 0 },
//   },
// });

//When you call mongoose.model() on a schema, Mongoose compiles a model for you.
//mongoose.model()的第一個參數是String,為collection名稱，
//必須以大寫開頭，且為單數形式
// const Student = mongoose.model("Student", studentSchema);

//# 新增資料

//constructor 建構新物件
// const newObject = new Student({
//   name: "Ben",
//   age: 24,
//   major: "Mathematics",
//   scholarship: {
//     merit: 6000,
//     other: 7000,
//   },
// });

// 儲存到mongodb
// .save() return a promise
// newObject
//   .save()
//   .then((saveObject) => {
//     console.log("資料已經儲存，儲存的資料是: ");
//     console.log(saveObject);
//   })
//   .catch((err) => console.log(err));

//# 查詢資料

//Model.find()
//找到所有符合的物件
//在瀏覽器上顯示
// app.get("/", async (req, res) => {
//   try {
//     //加上.exec() return a promise
//     let data = await Student.find().exec();
//     res.send(data);
//   } catch (err) {
//     console.log(err);
//   }
// });

//Model.findOne()查詢特定資料
//找到第一個符合的物件
// app.get("/", async (req, res) => {
//   try {
//     //加上.exec() return a promise
//     let data = await Student.findOne({ name: "John" }).exec();
//     res.send(data);
//   } catch (err) {
//     console.log(err);
//   }
// });

//# 更新資料

//Model.updateOne(filter,update,options)
//不會管Schema的設定 （年齡可以更新成小於0的數字)
//options物件可設定run Validators避免此情況
// Student.updateOne({ name: "Amy" }, { age: -10 }, {runValidators: true}) //更新失敗，年齡不能小於0
//   .exec()
//   .then((msg) => {
//     console.log(msg);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//Model.findOneAndUpdate(condition,update,options)
//找到第一個符合condition條件的物件，並且更新為update的值
//預設修改成功後回傳修改前的資料
//可設定new:true 修改成功後會回傳修改成功的資料

// Student.findOneAndUpdate(
//   { name: "John" },
//   { name: "John Lennon" },
//   { rundValidators: true, new: true }
// )
//   .exec()
//   .then((newData) => {
//     console.log(newData);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//# 刪除資料

//Model.deleteOne()
//刪除第一筆符合的資料
// Student.deleteOne({ name: "Ben" })
//   .exec()
//   .then((msg) => {
//     //回傳刪除筆數 deleteCount: 1
//     console.log(msg);
//   })
//   .catch((err) => console.log(err));

//Model.deleteMany()
//刪除所有符合的資料

//# Instance method(實例方法)
//在collection內所有的document都可以使用的method

// const studentSchema = new Schema(
//   {
//     name: { type: String, required: [true, "名稱為必填"] },
//     age: { type: Number, min: [0, "年齡不能小於0"] },
//     major: String,
//     scholarship: {
//       merit: { type: Number, default: 0 },
//       other: { type: Number, default: 0 },
//     },
//   },
//   {
//     methods: {
//       printTotalScholarship() {
//         return this.scholarship.merit + this.scholarship.other;
//       },
//     },
//   }
// );

// Student.find({})
//   .exec()
//   .then((arr) =>
//     arr.forEach((student) => {
//       console.log(
//         `${student.name}的獎學金總額是${student.printTotalScholarship()}`
//       );
//     })
//   )
//   .catch((err) => {
//     console.log(err);
//   });

//# Statics (靜態方法)
//針對Schema整體，不屬於Mongoose Model內部的documents
//例如查詢所有主修CS的學生

// const studentSchema = new Schema(
//   {
//     name: { type: String, required: [true, "名稱為必填"] },
//     age: { type: Number, min: [0, "年齡不能小於0"] },
//     major: String,
//     scholarship: {
//       merit: { type: Number, default: 0 },
//       other: { type: Number, default: 0 },
//     },
//   },
//   {
//     statics: {
//       findAllmajorStudents(major) {
//         //this 是 Student Schema
//         //return a promise
//         return this.find({ major: major }).exec();
//       },
//     },
//   }
// );

// Student.findAllmajorStudents("CS")
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//Schema vs Model
// 1.每個Schema映射到一個MongoDB中的Collection，而Model是包裝Schema的容器
// 2.Schema可以用來定義Collection的document架構，包含默認值、最大長度、最大值、最小值等
// 3.Schema所對應到的Collection提供了一個接口，可以用Model來對Collection進行新增、查詢、更新、刪除紀錄等功能
// 4.Model就像是SQL中的table，而Schema是create table的步驟
