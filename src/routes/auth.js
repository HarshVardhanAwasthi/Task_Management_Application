const express = require("express");

const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../model/user");


authRouter.post("/signup", async (req, res) => {
  try {

    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const hashpass = await bcrypt.hash(password, 10);

    const savedUser = new User({
      firstName,
      lastName,
      emailId,
      password: hashpass,
      age,
      gender,
    });

    const token = await savedUser.getJWT(); 

    res.cookie("token", token, { expires: new Date(Date.now() + 90000000) }); 
    if (savedUser) {
      await savedUser.save();
      res.json({ message: "account created successfully", data: savedUser });
    } else {
      res.status(404).send("not a valid details");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  const user = await User.findOne({ emailId: emailId });

  try {
    if (!user) {
      throw new Error("Invalid Credential");
    }
    const ispass = await user.validatePassword(password); //we are using schema methods to make code more readable and encapsulate

    //writing await is very important otherwise ispass it will not work and user can login with wrong password also ,as as you come on this function it will go there to compare and callstack mein synchronous kaam hota isko bhejdega eventloop ke paas aur aage bdh jaega jab compre hoke result milga tb tk kaam(login) ho chuka hoga...

    if (ispass) {
      const token = await user.getJWT(); //we are using schema methods to make code more readable and encapsulate

      res.cookie("token", token, { expires: new Date(Date.now() + 900000) }); //Cookies are commonly used to store the JWT token on the client side.
      res.send(user);
    } else {
      throw new Error("Invalid Credential");
    }
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

//this is logout api logic is just remove the token of that user from the browser thats it, once token is not available user has to login again...

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logut  successfull!!");
});

module.exports = authRouter;