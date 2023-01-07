const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student");
const methodOverride = require("method-override");

mongoose
  .connect("mongodb://127.0.0.1:27017/example")
  .then(() => {
    console.log("成功連結MongoDB......");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//取得所有學生資料
app.get("/students", async (req, res) => {
  try {
    const studentData = await Student.find({}).exec();
    // return res.send(studentData);
    return res.render("student", { studentData });
  } catch (err) {
    //server錯誤
    return res.status(500).send("尋找資料時發生錯誤");
  }
});

//新增學生資料頁面
app.get("/students/new", (req, res) => {
  return res.render("new-student-form");
});

//取得特定學生資料
app.get("/students/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    let foundStudent = await Student.findOne({
      //   _id: _id,
      _id,
    }).exec();
    if (foundStudent !== null) {
      return res.render("student-page", { foundStudent });
    } else {
      return res.render(400).render("student-not-found");
    }
  } catch (err) {
    return res.status(400).render("student-not-found");
  }
});

//編輯學生資料頁面
app.get("/students/:_id/edit", async (req, res) => {
  const { _id } = req.params;
  try {
    const foundStudent = await Student.findOne({
      _id,
    }).exec();
    if (foundStudent !== null) {
      return res.render("edit-student", { foundStudent });
    } else {
      return res.render(400).render("student-not-found");
    }
  } catch (err) {
    return res.status(400).render("student-not-found");
  }
});

//新增學生資料
app.post("/students", async (req, res) => {
  try {
    const { name, age, major, merit, other } = req.body;
    const newStudent = new Student({
      name,
      age,
      major,
      scholarship: {
        merit,
        other,
      },
    });
    const savedStudent = await newStudent.save();
    // return res.send({
    //   msg: "資料新增成功",
    //   savedObject: savedStudent,
    // });
    return res.render("student-save-success", { savedStudent });
  } catch (err) {
    //user 輸入錯誤
    return res.status(400).render("student-save-fail");
  }
});

//修改學生資料
app.put("/students/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, age, major, merit, other } = req.body;
    const newData = await Student.findOneAndUpdate(
      { _id },
      { name, age, major, scholarship: { merit, other } },
      //put request要求使用者提供所有數據
      //根據提供數據來更新資料庫內的資料
      //例如只提供年齡，其他屬性就會被更新為空字串
      { new: true, runValidators: true, overwrite: true }
    );

    // res.send({ msg: "成功更新學生資料", updatedData: newData });
    return res.render("student-update-success", { newData });
  } catch (err) {
    return res.status(400).send(err.messgae);
  }
});

//修改特定學生資料
//可以只提供特定屬性修改
app.patch("/students/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const newObj = new NewData();
    const studentObj = req.body;
    // for (let property in studentObj) {
    //   newObj.setProperty(property, studentObj[property]);
    // }
    Object.keys(studentObj).forEach((property) => {
      newObj.setProperty(property, studentObj[property]);
    });

    const newData = await Student.findOneAndUpdate({ _id }, newObj, {
      new: true,
      runValidators: true,
      //不能寫overwrite: true
    });
    res.send({ msg: "成功更新學生資料", updatedData: newData });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

class NewData {
  constructor() {}
  setProperty(key, value) {
    if (key !== "merit" && key !== "other") {
      this[key] = value;
    } else {
      this[`scholarship.${key}`] = value;
    }
  }
}

//刪除學生資料
app.delete("/students/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const deleteResult = await Student.deleteOne({ _id });
    // return res.send(deleteResult);
    res.render("student-delete-success");
  } catch (err) {
    return res.status(500).send("無法刪除資料");
  }
});

app.listen(3000, () => {
  console.log("server is running on port 3000...");
});
