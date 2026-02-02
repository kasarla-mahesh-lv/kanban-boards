const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, default: "todo" }
});

  
    

  


const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    tasks: [taskSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
