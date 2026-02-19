const Joi = require("joi");
const mongoose = require("mongoose");

exports.createHistorySchema = Joi.object({
  taskId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid Task ID");
      }
      return value;
    }),

  activity: Joi.string()
    .trim()
    .min(3)
    .required()
    .messages({
      "string.empty": "Activity cannot be empty",
      "string.min": "Activity must be at least 3 characters",
      "any.required": "Activity is required"
    })
});
