const mongoose = require("mongoose");
const { Schema } = mongoose;
const studentSchema = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
  },
  age: {
    type: Number,
    default: 18,
    max: [90, "活到老學到老?"],
    min: [0, "年齡不能小於零"],
  },
  major: {
    type: String,
    require: true,
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, "你的獎學金也太多了吧"],
    },
    other: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
