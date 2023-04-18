import { createStore } from "vuex";
// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      count: 0,
      isFullscreen: false,
      buycarts: [],
      userInfo: {
        username: "",
        password: ""
      },
      goodType: "",
      searchKey: "",
      products: []
    };
  },
  mutations: {
    increment(state, payload) {
      state.count += payload;
    },
    setFullscreen(state, payload) {
      state.isFullscreen = payload;
    },
    addBuycarts(state, payload) {
      state.buycarts.push(payload);
    },
    addBuycartsAddress(state, address) {
      for (let i = 0; i < state.buycarts.length; i++) {
        state.buycarts[i].address = address;
      }
    },
    addBuycartsNum(state, payload) {
      state.buycarts[payload].num++;
    },
    clearBuyCart(state) {
      state.buycarts = [];
    },
    minusBuycartsNum(state, payload) {
      state.buycarts[payload].num--;
      if (state.buycarts[payload].num == 0) {
        state.buycarts.splice(payload, 1);
      }
    },
    confirmUser(state, userInfo) {
      state.userInfo.username = userInfo.username;
      state.userInfo.password = userInfo.password;
    },
    setGoodType(state, goodType) {
      state.goodType = goodType;
    },
    setSearch(state, searchKey) {
      state.searchKey = searchKey;
    },
    setProductData(state, products) {
      state.products = products;
    }
  },
  getters: {
    totalPrice(state) {
      let total = state.buycarts.reduce((pre, item) => {
        return pre + item.price * item.num;
      }, 0);
      return total;
    },
  },
  actions: {
    asyncAdd(store, payload) {
      setTimeout(() => {
        store.commit("increment", payload);
      }, 1000);
    },
  },
});

export default store;
