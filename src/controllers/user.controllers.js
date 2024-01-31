import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const registerUser = asyncHandler( async (req,res,next)=>{
    const {username, email,password} = req.body
    // check for emptyness
    if([email,username,password].some((field)=>{
        field?.trim() === "";
    })){
        throw new ApiError(400,"All fields are required")
    }
    //check for duplicate
    const existedUser = User.findOne({
        $or :[{username},{email}]
    })
    
    if (existedUser){
        throw new ApiError(400,"User with email or username already exists")
    }
     const avatarLocalPath = req.files?.avatar[0]?.path
     const coverImagePath = req.files?.coverImage[0]?.path

     if (!avatarLocalPath){
        throw new ApiError (400,"Avatar file is required")
     }
    
     const avatar = await uploadOnCloudinary(avatarLocalPath)
     const coverImage = await uploadOnCloudinary(coverImagePath)



    //creation of User in database



    const user = await User.create({
        email,
        username:username.toLowerCase(),
        password,
        avatar,coverImage

    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")


    if (!createdUser){
        throw new ApiError(500,"Something went wrong while registering a user")
    }




  return res.status(200).json(new ApiResponse(200,createdUser,"user registerd successfully"))

})
export {registerUser}