const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String, required: true, minLength: 3, maxLength: 50 },
  
  firstName: { type: String, required: true, minLength: 3, maxLength: 50 },

  lastName: { type: String, minLength: 3, maxLength: 50 },

  emailId: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user.id }, "B", { expiresIn: "7d" });
  return token;
};

userSchema.methods.validatePassword = async function (userinputpassword) {
  const user = this;
  const hashPassword = user.password;

  const isPasswordValidated = await bcrypt.compare(
    userinputpassword,
    hashPassword
  );
  return isPasswordValidated;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
