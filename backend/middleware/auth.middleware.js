import User from "../models/user.model.js";

export const privateRoute = async(req,res,next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            return res.status(401).json({message:"Unauthorized - No access token"});
        }

        try {
            const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken.userId);

        if(!user){
            return res.status(401).json({message:"User not found!"});
        }

        req.user = user;
        next()
        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({message:"Unauthorized - Access token expired"});
            }
            throw error
        }
    } catch (error) {
        console.log(`Error in occured when privateRoute ==> ${error}`);
        return res.status(500).json({message:'Unauthorized - Invalid access token',error:error.message});
    }
};

export const adminRoute = async(req,res,next) => {
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        return res.status(401).json({message:"Access denied - admin only!"});
    }
}