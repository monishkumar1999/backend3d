import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/jwt.js";


export const createAdmin = async (req, res) => {
  try {
    if(!req.body){
        return res.status(400).json({ success: false, error: "Request body is missing" });
    }
    console.log("Request Body:", req.body); // Debugging line
  const { name, password } = req.body;

  const hashedpassword =await bcrypt.hash(password,10)
  if(!name){
    return  res.status(400).json({ success: false, error: "Name is required" });
  }
  
  if(!password){
    return res.status(400).json({  success: false,error: "Password is required" });
  }

   const newAdmin = await Admin.create({
      name,
      password:hashedpassword
    });

    return res.json({
      success: true
    });

  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login=async (req,res)=>{

  const admin = await Admin.findOne(
    {
        where:req.name
    }
  );
 const token = createToken({ id: admin.id });

 res.cookie("token", token, {
   httpOnly: true,
   secure: process.env.NODE_ENV === "production",
   sameSite: "strict",
 });
    
 return res.json({ success: true, token });
};