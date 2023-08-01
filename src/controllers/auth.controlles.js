import asyncHandler from "../service/asyncHandler";
import CustomError from "../utils/CustomError";
import User from "../models/user.schema.js"

export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true
}

/******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
 ******************************************************/ 

//sign up user
export const signUp = asyncHandler(async(req, res) => {
    //get data from user
    const {name, email, password } = req.body
    //validation
    if (!name || !email || !password) {
        throw new CustomError("pleasse add all field",400)
    }
    //check if user already exist or not
   const existingUser = await User.findOne({email})
   if (existingUser) {
    throw new CustomError("user already exist",400)
   }
   //if not find ,user is signing for first time
    const user = await User.create({
    name,
    email,
    password
   })
   const token = user.getJWTtoken()
   //safety
   user.password = undefined

   //store that token in users cookies
   res.cookie("token", token, cookieOptions)

    // send back a response to user
    res.status(200).json({
        success: true,
        token,
        user,
    })
})

/*********************************************************
 * @LOGIN
 * @route http://localhost:5000/api/auth/login
 * @description User Login Controller for signing in the user
 * @returns User Object
 *********************************************************/

export const login = asyncHandler( async(req,res) =>{
    //get data from user
   const {email,password} = req.body
   // validation
   if (!email || !password) {
    throw new CustomError("please fill all details",400)
   }
   // check user details
   const user = User.findOne({email}).select(+password)
   // user not found 
   if (!user) {
    throw new CustomError("invalid user",400)
   }
    //if email match then check for password
  const isPasswordMatched =  user.comparepassword(password)

if (isPasswordMatched) {
   const token = user.getJWTtoken()
   user.password = undefined
   res.cookie("token",token, cookieOptions )
   return res.status(200).json({
    success: true,
    token,
    user
   })
    
}
throw new CustomError("password is wrong",400)
})
/**********************************************************
 * @LOGOUT
 * @route http://localhost:5000/api/auth/logout
 * @description User Logout Controller for logging out the user
 * @description Removes token from cookies
 * @returns Success Message with "Logged Out"
 **********************************************************/

export const logout = asyncHandler(async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})