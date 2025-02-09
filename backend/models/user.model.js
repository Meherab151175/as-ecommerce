import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		cartItems: [
			{
                quantity:{
                    type:Number,
                    default:1
                },
                productId:{
                    type:Schema.Types.ObjectId,
                    ref:"Product"
                }
            }
		],
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function(next) {
    if (!this.isModified("password")) return next();
    try {
        this .password = bcrypt.hashSync(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
})

userSchema.methods.comparePassword =async function (password){
    return bcrypt.compare(password, this.password);
}


const User = model("User", userSchema);

export default User;