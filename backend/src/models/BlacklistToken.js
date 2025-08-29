import { model, Schema } from "mongoose";


const blacklistSchema = new Schema({
    token:{
        type:String,
        required:[true, "token is required."],
        unique:[true, "token must be unique."]
    },
    
    createAt:{
        type:Date,
        default:Date.now,
        expires:86400 // 24 hours in seconds
    }
});

const BlacklistToken = model("BlacklistToken", blacklistSchema);

export default BlacklistToken;
