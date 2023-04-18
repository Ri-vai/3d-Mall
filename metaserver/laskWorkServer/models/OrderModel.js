const mongoose = require("mongoose")
const Schema = mongoose.Schema

//order模型==>order集合
const OrderType = {
    username: String,
    title: String,
    name: String,
    phone: String,
    address: String,
    num: Number,
    price: Number,
    totalPrice: Number,
    time: String,
    imgsrc: String
}
const OrderModel = mongoose.model("order", new Schema(OrderType))
module.exports = OrderModel