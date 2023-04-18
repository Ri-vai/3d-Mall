const UserService = require("../../services/web/UserService")
const jwt = require('jsonwebtoken');
const UserController = {
    login: async (req, res) => {
        const token = jwt.sign({ username: req.body.username }, 'dhfuihdfiuhdiufhu', { expiresIn: '1h' });
        console.log("🚀 ~ file: UserController.js:6 ~ login: ~ token:", token)

        var result = await UserService.login(req.body.username, req.body.password)
        if (result.length === 0) {
            res.send({
                code: "-1",
                error: "用户名密码不匹配"
            })
        } else {
            res.send({
                code: "200",
                token
            })
        }
    },
    signup: async (req, res) => {
        const { username, password, phone } = req.body;
        var result = await UserService.signup(username, password, phone);
        if (result.length === 0) {
            res.send({
                code: "-1",
                error: "注册失败"
            })
        } else {
            res.send({
                code: "200"
            })
        }
    },
    checkRepeat: async (req, res) => {
        const username = req.body.username;
        var result = await UserService.checkRepeat(username);
        if (result.length !== 0) {
            res.send({
                code: "200"
            })
        } else {
            res.send({
                code: "100"
            })
        }
    },
    submitOrder: async (req, res) => {
        const subOrderMsg = req.body;
        for (let i = 0; i < subOrderMsg.length; i++) {
            let { username,
                title,
                name,
                phone,
                address,
                num,
                price,
                totalPrice,
                time,
                imgsrc } = subOrderMsg[i];
            var result = await UserService.submitOrder(username, title, name, phone, address, num, price, totalPrice, time, imgsrc);
        }
        if (result.length !== 0) {
            res.send({
                code: "200"
            })
        } else {
            res.send({
                code: "100"
            })
        }
    },
    getOrder: async (req, res) => {
        const userMsg = req.body;
        let { username } = userMsg;
        var result = await UserService.getOrder(username);
        if (result.length !== 0) {
            res.send({
                result
            })
        } else {
            res.send({
                code: "100"
            })
        }
    },
    getGoods: async (req, res) => {
        let { type } = req.body;
        var result = await UserService.getGoods(type);
        if (result.length !== 0) {
            res.send({
                result
            })
        } else {
            res.send({
                code: "100"
            })
        }
    },
    searchGood: async (req, res) => {
        let { title } = req.body;
        var result = await UserService.searchGood(title);
        if (result.length !== 0) {
            res.send({
                result
            })
        } else {
            res.send({
                code: "100"
            })
        }
    }
}
module.exports = UserController