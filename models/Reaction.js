const mongoose = require("mongoose");
const reactionSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.SchemaTypes.ObjectId, ref: "User"
        },
        targetType: {
            type:String, 
            enum: ["Post","Comment"],
            required: true
        },
        targetId: {
            type: mongoose.SchemaTypes.ObjectId,
            required:true,
            refPath:"targetType"
        },
        emoji:{
            type:String,
            enum:["heart"],
            required:true
        },
    },
    {
        timestamps: true
    }
    );

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;