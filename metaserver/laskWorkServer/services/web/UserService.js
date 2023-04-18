const UserModel = require("../../models/UserModel")
const OrderModel = require("../../models/OrderModel")
const GoodModel = require("../../models/GoodModel")
const UserService = {
    login: async (username, password) => {
        return UserModel.find({
            username,
            password
        })
    },
    signup: async (username, password, phone) => {
        return UserModel.create({
            username,
            password,
            phone
        })
    },
    checkRepeat: async (username) => {
        return UserModel.find({
            username
        })
    },
    submitOrder: async (username, title, name, phone, address, num, price, totalPrice, time, imgsrc) => {
        return OrderModel.create({
            username, title, name, phone, address, num, price, totalPrice, time, imgsrc
        })
    },
    getOrder: async (username) => {
        return OrderModel.find({
            username
        })
    },
    getGoods: async (type) => {
        return GoodModel.find({
            type
        })
    },
    searchGood: async (title) => {
        return GoodModel.find({
            title: {
                $regex: title
            }
        })
    }
}
module.exports = UserService