const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY= process.env.JWT_SECRET_KEY;

const userSchema = new mongoose.Schema(
    {
        employeeId: { 
            type: String, 
            required: true,
            unique: true, 
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        avatarUrl: {
            type: String,
            required: false,
            default: "",
        },
        department: {
            type: String,
            enum: [
            "GM",
            "HR",
            "Internal Communication",
            "Sales",
            "Finance",
            "IT",
            "Admin",
            "Marketing",
            "Legal",
            ],
            required: true,
        },
        role: {
            type: String,
            enum: [
            "General Manager",
            "Manager",
            "Supervisor",
            "Senior Officer",
            "Officer",
            "Junior Officer",
            "Intern",
            ],
            required: true,
        },
        phone: {
            type: Number,
            required: false,
            default: "",
        },
        commendation: {
            type: Boolean,
            required: false,
            default: false,
        },
        tasks: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Task" }],
        commendationAction: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Commendation" }],
        commentCount: { 
            type: Number, 
            default:0 },
        postCount: { 
            type: Number, 
            default:0 },
        isDeleted: {
            type: Boolean,
            default:false,
            select: false
        },
    },
        {
            timestamps: true,
          }
        );

userSchema.methods.toJSON = function() {
    const users = this._doc;
    delete users.password;
    delete users.isDeleted;
    return users
}

userSchema.methods.generateToken = async function() {
    const accessToken = await jwt.sign({ _id:this._id}, JWT_SECRET_KEY, {
        expiresIn:"1d",
    });
    return accessToken;
}
const User = mongoose.model("User", userSchema);

module.exports = User;
