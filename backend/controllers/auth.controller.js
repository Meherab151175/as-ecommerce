import { redis } from "../lib/radis.js";
import User from "../models/user.model.js";

import jwt from "jsonwebtoken";

const generateTokens = (userId)=>{
    const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:"15m"
    });

    const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:"7d"
    });
    return {accessToken,refreshToken};
}

const storeRefreshToken = async (userId, refreshToken)=>{
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX", 60 * 60 * 24 * 7);
}

const setCookies = (res,accessToken,refreshToken)=>{
    res.cookie("accessToken",accessToken,{httpOnly:true,secure:true,sameSite:"none",maxAge: 15 * 60 * 1000});
    res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:true,sameSite:"strict",maxAge: 7 * 24 * 60 * 60 * 1000});
}

export const signup =async (req, res) => {
    const {name,email,password} = req.body;

    try {
        const isUserExists = await User.findOne({email});
        if(isUserExists){
            return res.status(400).json({message:"User already exists"});
        }

        const user = await User.create({name,email,password});

        // authenticate

        // generate tokens
        const {accessToken,refreshToken} = generateTokens(user._id);
        // store refreshToken in redis
        await storeRefreshToken(user._id,refreshToken);

        setCookies(res,accessToken,refreshToken)

        return res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        });
    } catch (error) {
        console.log(`Error in occured when signup ==> ${error}`);
        return res.status(500).json({message:error.message});
    }
};

export const login =async (req, res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if(user && (await user.comparePassword(password))){
            const {accessToken,refreshToken} = generateTokens(user._id);
            await storeRefreshToken(user._id,refreshToken);
            setCookies(res,accessToken,refreshToken)    
            
            return res.status(200).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            });
        }
    } catch (error) {
        console.log(`Error in occured when login ==> ${error}`);
        res.status(500).json({message:'Something went wrong',error:error.message});
    }
};

export const logout =async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;       
        if(refreshToken){
            const decodedToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decodedToken.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log(`Error in occured when logout ==> ${error}`);
        res.status(500).json({message:'Something went wrong',error:error.message});
    }
};

export const refreshToken =async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({message:"Unauthorized"});
        }

        const decodedToken = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token:${decodedToken.userId}`);
        if(storedToken !== refreshToken){
            return res.status(401).json({message:"Unauthorized"});
        }

        const accessToken = jwt.sign({userId:decodedToken.userId},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"15m"
        });
        res.cookie("accessToken",accessToken,{httpOnly:true,secure:true,sameSite:"strict",maxAge: 15 * 60 * 1000});
        res.status(200).json({message:"Token refreshed successfully"});
    } catch (error) {
        console.log(`Error in occured when refreshToken ==> ${error}`);
        return res.status(500).json({message:'Something went wrong',error:error.message});
    }
};



export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};