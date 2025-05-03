const mongoose=require("mongoose");
const  dotenv =require("dotenv").config()

const connectDB= async()=>{
        await mongoose.connect(
            process.env.CONNECTION_STRING
        );
};//mongoose.connect jo hai wo promise return krega to async await ka use krke asynchronous operation ko handle kia hai..


module.exports=connectDB;