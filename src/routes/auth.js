const express = require("express");

const authRouter = express.Router();

const bcrypt = require("bcrypt");
const User = require("../model/user");

authRouter.post("/signup", async (req, res) => {
    try {
      const { userName, firstName, lastName, emailId, password } = req.body;
  
      // Check if the email already exists
      const existingUser = await User.findOne({ emailId });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash the password
      const hashPass = await bcrypt.hash(password, 10);
  
      // Create the new user
      const newUser = new User({
        userName,
        firstName,
        lastName,
        emailId,
        password: hashPass,
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Generate JWT Token
      const token = await newUser.getJWT();
  
      // Set the token as a cookie (Optional: if you want to send the token in cookies)
      res.cookie("token", token, { expires: new Date(Date.now() + 90000000), httpOnly: true });
  
      // Respond with the new user data
      res.status(201).json({ message: "User created successfully", data: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
  

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  const user = await User.findOne({ emailId: emailId });

  try {
    if (!user) {
      throw new Error("Invalid Credential");
    }
    const ispass = await user.validatePassword(password); 


    if (ispass) {
      const token = await user.getJWT(); 
        
      res.cookie("token", token, { expires: new Date(Date.now() + 900000) }); 
      console.log("Cookie set:", token);
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
