const mongoose = require("mongoose")
const Schema = mongoose.Schema

//good模型==>good集合
const GoodType = {
    title: String,
    modelPath: String,
    modelName: String,
    desc: Array,
    price: Number,
    imgsrc: String,
    type: String,
}
const GoodModel = mongoose.model("goods", new Schema(GoodType))
module.exports = GoodModel