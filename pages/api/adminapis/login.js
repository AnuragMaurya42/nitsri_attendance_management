import Admin from "@/models/Admin";
import connectDb from "@/middleware/mongoose";
import bcrypt from 'bcrypt';


const handler=async(req,res)=>{
    const jwt = require('jsonwebtoken');
   if(req.method=='POST')
    {
        try {
            const {email,userId,code}=req.body;
            const existingAdmin=await Admin.findOne({email:email})
            const userMatch = bcrypt.compareSync(existingAdmin.userid,userId);

            if(userMatch)
            {
                if(existingAdmin.logincode==code){
                 var token = jwt.sign({userid:existingAdmin.userid,email: existingAdmin.email, adminname: existingAdmin.adminname }, process.env.NEXT_PUBLIC_JWT_SECRET3);
                res.status(200).json({Success:true,SuccessMessage:'Success! Your email has been verified.',token:token})
                }else
                {
                    res.status(400).json({Success:false,ErrorCode:400,ErrorMessage:'Verification failed. The code you provided is incorrect'})    
                }
            }
            else
            {
                res.status(400).json({Success: false, ErrorCode: 400, ErrorMessage: "This userId is not recognized. You have tampered with the URL. Kindly return back to the previous page."});
            }
        } catch (error) {
            res.status(500).json({ Success: false, ErrorCode: error.code, ErrorMessage: error.message });   
        }
    }
    else
    {
        res.status(405).json({ Success: false, ErrorCode: 405, ErrorMessage: "Method Not Allowed!" });
    }
}
  
export default connectDb(handler);