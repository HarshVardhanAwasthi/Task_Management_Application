const express = require('express')
const dotenv=require('dotenv').config()

const connectDB=require("./config/database")
const cookieParser = require("cookie-parser");

const app = express()
const port = process.env.PORT

app.use(express.json());
app.use(cookieParser());

const authRouter=require("./routes/auth.js");

app.use("/",authRouter);

connectDB().then(()=>{
    console.log("database connection is succesfull!!")
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
})
.catch((err)=>{
  console.log("database connot be connected!!",err)
})