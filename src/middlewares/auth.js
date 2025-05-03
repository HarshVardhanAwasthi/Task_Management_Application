const  jwt=require("jsonwebtoken");
const User=require("../model/user")
const dotenv=require("dotenv").config()

const userauth=async (req,res,next)=>{
    try
    {    
        const {token}=req.cookies;

        if(!token){
            return res.status(401).send("Please Login!!");
        }

        console.log("Received Token:", token);

        // Token verification with debug
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log("Decoded JWT:", decoded);
        } catch (err) {
          console.log("Token verification failed:", err.message);
          return res.status(401).send("Invalid Token: " + err.message);
        }

        const decodedobj=await jwt.verify(token,process.env.JWT_SECRET);
        

        const {_id}=decodedobj;
        console.log("decodedbj:",_id)

        const user=await User.findById(_id);

        if(!user){
            throw new Error("No user found...");
        }
        req.user=user;
        next();
    }
    catch(error)
    {
        res.status(400).send("Error:"+error.message);
    }
}

module.exports=userauth;
