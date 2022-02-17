const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: String,
    fullName: {type: String, unique: true},
    password: String,
    
    // slack login - optional
    //slackID: String,
    // google login - optional
    //googleID: String
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
