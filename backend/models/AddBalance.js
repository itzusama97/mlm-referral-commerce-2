const mongoose = require("mongoose");

const addBalanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min:1
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AddBalance", addBalanceSchema);
