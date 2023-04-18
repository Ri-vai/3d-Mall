const mongoose = require("mongoose")
const Schema = mongoose.Schema

//user模型==>user集合
const UserType = {
    username: String,
    password: String,
    email: String,
    role: Number //普通用户1
}
const UserModel = mongoose.model("user", new Schema(UserType))
module.exports = UserModel