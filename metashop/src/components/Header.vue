<template>
  <div class="header" :class="{ hidden: store.state.isFullscreen }">
    <div class="logo" @click="router.push('/')">
      <img src="../assets/img/logo_rect.jpg" alt="logo" />
    </div>
    <a-input-search
      v-model:value="data.value"
      placeholder="搜索商品或商品号"
      class="input-search"
      @search="onSearch"
    />
    <a-menu v-model:selectedKeys="data.current" mode="horizontal">
      <a-menu-item key="help" @click="router.push('/')">
        <template #icon>
          <HomeFilled />
        </template>
        主页
      </a-menu-item>
      <a-menu-item
        key="account"
        v-if="!store.state.userInfo.username"
        @click="router.push('/login')"
      >
        <template #icon>
          <UserOutlined />
        </template>
        登录
      </a-menu-item>
      <!-- <a-sub-menu
        
        key="account"
        
      >
        <template #icon>
          <UserOutlined />
        </template>
        <template #title>账户</template>
      </a-sub-menu> -->
      <a-sub-menu v-if="store.state.userInfo.username">
        <template #icon>
          <UserOutlined />
        </template>
        <template #title>{{ store.state.userInfo.username }}</template>
        <a-menu-item-group title="个人管理">
          <a-menu-item @click="router.push('/order')"
            ><div class="title">个人订单</div></a-menu-item
          >
          <a-menu-item @click="outLogin()"
            ><div class="title">退出登录</div></a-menu-item
          >
        </a-menu-item-group>
      </a-sub-menu>
      <a-sub-menu v-if="store.state.userInfo.username" key="buycart">
        <template #icon>
          <CarOutlined />
        </template>
        <template #title>购物车</template>
        <a-menu-item-group title="购物商品">
          <a-menu-item v-if="store.state.buycarts[0]">
            <a-input
              v-model:value="data.orderMsg.orderPersonMsg.address"
              placeholder="输入订单地址"
              class="input-search"
              @click.stop="tipEnterAddress()"
            />
          </a-menu-item>
          <a-menu-item v-if="store.state.buycarts[0]">
            <a-input
              v-model:value="data.orderMsg.orderPersonMsg.phone"
              placeholder="输入联系方式"
              class="input-search"
              @click.stop="tipEnterAddress()"
            />
          </a-menu-item>
          <a-menu-item v-if="store.state.buycarts[0]">
            <a-input
              v-model:value="data.orderMsg.orderPersonMsg.name"
              placeholder="输入收件人名字"
              class="input-search"
              @click.stop="tipEnterAddress()"
            />
          </a-menu-item>
          <a-menu-item v-for="(item, i) in store.state.buycarts" :key="item.id">
            <div class="prod-item">
              <div class="left">
                <img :src="item.imgsrc" :alt="item.title" />
              </div>
              <div class="middle">
                <div class="title">{{ item.title }}</div>
                <div class="content">
                  <span class="num">数量：{{ item.num }}</span>
                  <div class="control">
                    <span
                      class="btn"
                      @click.stop="store.commit('addBuycartsNum', i)"
                      >+</span
                    >
                    <span
                      class="btn"
                      @click.stop="store.commit('minusBuycartsNum', i)"
                      >-</span
                    >
                  </div>
                </div>
              </div>
              <div class="right">
                <div class="price">¥ {{ item.price * item.num }}</div>
              </div>
            </div>
          </a-menu-item>
          <a-menu-item key="totalPrice">
            <div class="total">
              <span>总价：</span>
              <span class="num"> ¥ {{ store.getters.totalPrice }}</span>
            </div>
          </a-menu-item>
          <a-menu-item v-if="store.state.buycarts[0]">
            <a-button @click.stop="submitOrder" type="primary" block
              >提交订单</a-button
            >
          </a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { onMounted, reactive } from "vue";
import axios from "axios";
import { showToast } from "vant";
import "vant/es/toast/style";
import {
  ShopOutlined,
  UserOutlined,
  CarOutlined,
  QuestionCircleOutlined,
  HomeFilled,
} from "@ant-design/icons-vue";
import HomeCom from "./HomeCom.vue";
const store = useStore();
const router = useRouter();
const data = reactive({
  value: "",
  current: ["help"],
  orderMsg: {
    orderPersonMsg: {
      address: "",
      phone: "",
      name: "",
    },
  },
  subOrderMsg: {},
});
onMounted(async () => {
  if (sessionStorage.getItem("userInfo")) {
    store.commit("confirmUser", JSON.parse(sessionStorage.getItem("userInfo")));
  }
});
const onSearch = async () => {
  await axios
    .post("/webapi/user/searchGood", { title: data.value })
    .then((res) => {
      store.commit("setProductData", res.data.result);
    });
  router.replace("/product");
};
const outLogin = () => {
  data.orderMsg.orderPersonMsg = {};
  store.commit("clearBuyCart");
  sessionStorage.removeItem("userInfo");
  store.commit("confirmUser", {});
  router.replace("/");
};
const tipEnterAddress = () => {
  // store.commit("confirmUser", {});
  console.log("尝试输入信息");
};
const getDate = () => {
  var date = new Date();
  var year = date.getFullYear(); //  返回的是年份
  var month = date.getMonth() + 1; //  返回的月份上个月的月份，记得+1才是当月
  var dates = date.getDate(); //  返回的是几号
  var hour = date.getHours();
  var minute = date.getMinutes();
  var time = year + "-" + month + "-" + dates + " " + hour + ":" + minute;
  return time;
};
const submitOrder = () => {
  // store.commit("confirmUser", {});
  if (!data.orderMsg.orderPersonMsg.address) {
    showToast({
      message: "请输入订单地址",
      position: top,
    });
  } else if (!data.orderMsg.orderPersonMsg.phone) {
    showToast({
      message: "请输入联系方式",
      position: top,
    });
  } else if (!data.orderMsg.orderPersonMsg.name) {
    showToast({
      message: "请输入收件人姓名",
      position: top,
    });
  } else {
    data.subOrderMsg = store.state.buycarts;
    for (let i = 0; i < data.subOrderMsg.length; i++) {
      data.subOrderMsg[i].address = data.orderMsg.orderPersonMsg.address;
      data.subOrderMsg[i].phone = data.orderMsg.orderPersonMsg.phone;
      data.subOrderMsg[i].name = data.orderMsg.orderPersonMsg.name;
      data.subOrderMsg[i].username = store.state.userInfo.username;
      data.subOrderMsg[i].totalPrice =
        data.subOrderMsg[i].price * data.subOrderMsg[i].num;
      data.subOrderMsg[i].time = getDate();
    }
    axios.post("/webapi/user/submitOrder", data.subOrderMsg).then((res) => {
      console.log(res.data);
      if (res.data.code == "200") {
        // store.commit("confirmUser", data.loginFormData);

        store.commit("clearBuyCart");
        showToast({
          message: "提交订单成功",
          position: top,
        });
        // router.push("/");
      } else {
        showToast({
          message: "提交订单失败",
          position: top,
        });
      }
    });
  }
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 1000000;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 0 10px #ccc;
  transition: all 0.5s;
}
.header.hidden {
  transform: translate(0, -100%);
}

.logo {
  margin-right: 20px;
  img {
    height: 50px;
  }
}
.input-search {
  display: flex;
  flex: 1;
  height: 40px;
  align-items: center;
}
</style>
