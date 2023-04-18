<template>
  <div class="loading" v-show="data.isLoading">
    <Loading :progress="data.progress"></Loading>
  </div>
  <div class="product" v-show="!data.isLoading" id="product">
    <div
      class="desc"
      :class="{ active: data.descIndex == i }"
      v-if="data.products[data.pIndex]"
      v-for="(desc, i) in data.products[data.pIndex].desc"
      :key="i"
    >
      <h1 class="title">{{ desc.title }}</h1>
      <p class="content">{{ desc.content }}</p>
    </div>
    <div class="prod-list" :class="{ hidden: store.state.isFullscreen }">
      <h1><SketchOutlined></SketchOutlined>产品推荐</h1>
      <div class="products">
        <div
          class="prod-item"
          :class="{ active: pI == data.pIndex }"
          v-for="(prod, pI) in data.products"
          :key="pI"
          @click="changeModel(prod, pI)"
        >
          <div class="prod-title">
            {{ prod.title }}
          </div>
          <div class="img">
            <img :src="prod.imgsrc" :alt="prod.title" />
          </div>
          <a-button type="primary" block @click.stop="addBuycart(prod)">
            <template #icon>
              <ShoppingCartOutlined></ShoppingCartOutlined>
            </template>
            加入购物车
          </a-button>
        </div>
      </div>
    </div>
    <div class="scene-list" :class="{ hidden: store.state.isFullscreen }">
      <h3><RadarChartOutlined></RadarChartOutlined> 切换使用场景</h3>

      <div class="scenes">
        <div
          class="scene-item"
          v-for="(scene, index) in data.scenes"
          :key="index"
          @click="changeHdr(scene, index)"
        >
          <img
            :class="{ active: index == data.sceneIndex }"
            :src="`./files/hdr/${scene}.jpg`"
            :alt="scene"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loading from "../components/Loading.vue";
import {
  SketchOutlined,
  RadarChartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons-vue";
import { showToast } from "vant";
import "vant/es/toast/style";
import { useRoute } from "vue-router";
import { onMounted, reactive, watch } from "vue";
import * as api from "../api/index.js";
import { useStore } from "vuex";
import axios from "axios";
import Base3d from "../utils/Base3d";
const route = useRoute();
const store = useStore();
// console.log(route);
const data = reactive({
  products: [] || this.store.state.products,
  isLoading: true,
  scenes: [],
  pIndex: 0,
  sceneIndex: 0,
  base3d: {},
  descIndex: 0,
  progress: 0,
});
function LoadingFinish() {
  data.isLoading = false;
}
onMounted(async () => {
  // if (store.state.goodType) {
  //   await axios
  //     .post("/webapi/user/getGoods", { type: store.state.goodType })
  //     .then((res) => {
  //       data.products = res.data.result;
  //       store.commit("setGoodType", "");
  //     });
  // } else {
  //   await axios
  //     .post("/webapi/user/searchGood", { title: store.state.searchKey })
  //     .then((res) => {
  //       data.products = res.data.result;
  //     });
  // }
  data.products = store.state.products;
  data.scenes = ["000", "080", "079", "077", "076", "067"];
  data.base3d = new Base3d(
    "#product",
    LoadingFinish,
    data.products[0].modelName
  );
  //根据模型加载中事件获取模型加载进度
  data.base3d.onProgress((e) => {
    let progressNum = e.loaded / e.total;
    progressNum = progressNum.toFixed(2) * 100;
    data.progress = progressNum;
  });
});
watch(
  () => store.state.products,
  (newVal, oldVal) => {
    data.products = newVal;
    changeModel(data.products[0], 0);
  }
);
function changeModel(prod, pI) {
  data.pIndex = pI;
  data.base3d.setModel(prod.modelName);
}
//切换场景
function changeHdr(scene, index) {
  data.sceneIndex = index;
  data.base3d.setEnvMap(scene);
}
function addBuycart(prod) {
  if (!store.state.userInfo.username) {
    showToast({
      message: "请先登录后再进行购物哦！",
      position: top,
    });
    return;
  }
  let product = { ...prod, num: 1 };
  let index = 0;
  let isExist = store.state.buycarts.some((item, i) => {
    if (product.id == item.id) {
      index = i;
      return true;
    } else {
      return false;
    }
  });
  if (isExist) {
    store.commit("addBuycartsNum", index);
  } else {
    store.commit("addBuycarts", product);
  }
  showToast({
    message: "加入购物车成功",
    position: top,
  });
}
window.addEventListener("mousewheel", (e) => {
  //   console.log(e);
  if (e.deltaY > 0) {
    store.commit("setFullscreen", true);
  }

  if (e.deltaY < 0) {
    store.commit("setFullscreen", false);
  }
});

// window.addEventListener("mousewheel", (e) => {
//   let duration = data.base3d.animateAction._clip.duration;
//   let time = data.base3d.animateAction.time;
//   let index = Math.floor((time / duration) * 4);
//   data.descIndex = index;
// });
</script>

<style lang="less" scoped>
.desc {
  position: fixed;
  z-index: 100000;
  background-color: rgba(255, 255, 255, 0.5);
  width: 600px;
  top: 100px;
  left: 50%;
  margin-left: -300px;
  transition: all 0.5s;

  transform: translate(-100vw, 0);
  padding: 15px;
}
.desc.active {
  transform: translate(0, 0);
}
.prod-list {
  width: 300px;
  height: 100vh;
  padding: 60px 0 0;
  position: fixed;
  z-index: 100000;
  transition: all 0.5s;
  background-color: rgba(255, 255, 255, 0.8);
  left: 0;
  top: 0;
  overflow: scroll;
  h1 {
    font-size: 20px;
    font-weight: 900;
    padding: 10px 25px 0;
  }
  .products {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .prod-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 250px;
      background-color: #fff;
      border-radius: 20px;
      overflow: hidden;
      margin: 10px 0;
      box-shadow: 2px 2px 5px #666;
      transition: all 0.3s;
      &.active {
        box-shadow: 2px 2px 5px #666, 0px 0px 10px red;
      }
      &:hover {
        transform: translate(0px, -5px);
        box-shadow: 2px 2px 5px #666, 0px 0px 10px orangered;
        // background-color: orange;
      }
      img {
        width: 190px;
      }
      .prod-title {
        padding: 0 20px;
      }
    }
  }
}
// 滚动条
.prod-list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.prod-list::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.523);
  background: #cac9c9;
}
.prod-list::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ffffff;
}
.prod-list.hidden {
  transform: translate(-100%, 0);
}
.scene-list {
  width: 300px;
  height: 100vh;
  padding: 60px 0 0;
  position: fixed;
  z-index: 100000;
  transition: all 0.5s;
  background-color: rgba(255, 255, 255, 0.8);
  right: 0;
  top: 0;
  overflow: scroll;
  h3 {
    font-size: 20px;
    font-weight: 900;
    padding: 0 30px;
  }
  .scenes {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .scene-item {
    padding: 6px 0;

    img {
      width: 250px;
      border-radius: 10px;
      box-shadow: 2px 2px 10px #666;
      transition: all 0.3s;
      &.active {
        box-shadow: 2px 2px 5px #666, 0px 0px 10px red;
      }
      &:hover {
        transform: translate(0px, -5px);
        box-shadow: 2px 2px 5px #666, 0px 0px 10px orangered;
      }
    }
  }
}
.scene-list.hidden {
  transform: translate(100%, 0);
}
</style>
