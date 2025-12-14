import mongoose, { Schema, Document } from "mongoose";



export interface Message extends Document {
    content: string;
    createdAt: Date;
}



const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        requred: true,
        default: Date.now
    }
})


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    verificationCode: string;
    verificationCodeExpiry: Date;
    isVerified: boolean;
    isReceivngMessages: boolean;
    messages: Message[];
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    verificationCode: {
        type: String,
        required: true
    },
    verificationCodeExpiry: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isReceivngMessages: {
        type: Boolean,
        required: true,
        default: false
    },
    messages: [messageSchema]
})

export default mongoose.model<User>("User", userSchema);
