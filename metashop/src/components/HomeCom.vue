<template>
  <div class="homepage">
    <HomeSwiper :banner="data.banner"></HomeSwiper>
    <div class="live">
      <!-- <h1>乐享生活100+</h1> -->
      <div class="live-list">
        <div
          class="live-item"
          v-for="index in 4"
          :key="index"
          @click="toGoods(index)"
        >
          <div class="live-btn">
            <img
              :src="data.sports[index].menuThumbnail"
              :alt="data.sports[index].displayName"
            />
            <h3 style="margin-left: 30px">
              {{ data.sports[index].displayName }}
            </h3>
          </div>
        </div>
      </div>
      <!-- <a-button type="primary" size="large" @click="router.push('/product')"
        >立即享受生活</a-button
      > -->
    </div>
  </div>
</template>

<script setup>
import HomeSwiper from "./Home/HomeSwiper.vue";
import * as api from "../api/index";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";
let result = await api.getHomepage();
const router = useRouter();
const store = useStore();
const toGoods = async (index) => {
  switch (index) {
    case 1:
      store.commit("setGoodType", "clothing");
      break;
    case 2:
      store.commit("setGoodType", "furniture");
      break;
    case 3:
      store.commit("setGoodType", "toy");
      break;
    // case 4:
    //   store.commit("setGoodType", "sport");
    //   break;
    case 4:
      store.commit("setGoodType", "office");
      break;
  }
  if (store.state.goodType) {
    await axios
      .post("/webapi/user/getGoods", { type: store.state.goodType })
      .then((res) => {
        // data.products = res.data.result;
        store.commit("setProductData", res.data.result);
        store.commit("setGoodType", "");
      });
  }
  router.push("/product");
};
// const data = reactive({ banner: result.banner, sports: result.sports });
// console.log("🚀 ~ file: HomeCom.vue:38 ~ data:", data);
const data = reactive({
  banner: result.banner,
  sports: [
    {
      priority: 1,
      displayName: "生活用品",
      menuThumbnail:
        "https://pixl.decathlon.com.cn/s845248/k$9ecc7becd540b19634332e81339e0465/menuThumbnail_hiking.jpg",
      categoryLink: "/browse/c0-sports/c1-hiking/_/N-1obx6w9",
      childCategories: [
        {
          displayName: "男士",
          categoryLink: "/browse/c0-sports/c1-hiking/c2-man/_/N-qvs25p",
        },
        {
          displayName: "女士",
          categoryLink: "/browse/c0-sports/c1-hiking/c2-women/_/N-1c01zxg",
        },
        {
          displayName: "青少年",
          categoryLink:
            "/browse/c0-sports/c1-hiking/c2-children-hiking/_/N-yw9w9n",
        },
      ],
    },
    {
      priority: 2,
      displayName: "服饰包包",
      menuThumbnail:
        "https://pixl.decathlon.com.cn/s805053/k$0fb047e2ae8b0547b086970873a70dd8/menuThumbnail_basketball.jpg",
      categoryLink: "/browse/c0-sports/c1-fitness/_/N-ql2hky",
      childCategories: [
        {
          displayName: "有氧健身装备",
          categoryLink:
            "/browse/c0-sports/c1-fitness/c2-fitness-equipment/_/N-1lw7lni",
        },
        {
          displayName: "力量/塑形装备",
          categoryLink:
            "/browse/c0-sports/c1-fitness/c2-muscle-equipment/_/N-1fl1h1c",
        },
        {
          displayName: "运动食品",
          categoryLink: "/browse/c0-sports/c1-fitness/c2-jianshen/_/N-1h2y9r6",
        },
        {
          displayName: "男士服饰",
          categoryLink:
            "/browse/c0-sports/c1-fitness/c2-men-s-fitness/_/N-tbzced",
        },
        {
          displayName: "女士服饰",
          categoryLink:
            "/browse/c0-sports/c1-fitness/c2-women-fitness/_/N-fnm5kc",
        },
      ],
    },
    {
      priority: 3,
      displayName: "生活家居",
      menuThumbnail:
        "https://pixl.decathlon.com.cn/s830258/k$747d6d4b52562b31e6aea89313f3bb63/MenuThumbnail_Cycle+new2020aw.jpg",
      categoryLink: "/browse/c0-sports/c1-cycling/_/N-8txzvz",
      childCategories: [
        {
          displayName: "公路",
          categoryLink:
            "/browse/c0-sports/c1-cycling/c2-road-cycling/_/N-11awyt7",
        },
        {
          displayName: "儿童",
          categoryLink:
            "/browse/c0-sports/c1-cycling/c2-kids-learning-cycling/_/N-18eebxz",
        },
        {
          displayName: "山地",
          categoryLink:
            "/browse/c0-sports/c1-cycling/c2-mountain-bike-cycling/_/N-1o6kcxr",
        },
        {
          displayName: "经典城市",
          categoryLink:
            "/browse/c0-sports/c1-cycling/c2-city-cycling/_/N-13573ed",
        },
        {
          displayName: "折叠车",
          categoryLink:
            "/browse/c0-sports/c1-cycling/c2-intermodel-cycling/_/N-kf6z1w",
        },
        {
          displayName: "旅行",
          categoryLink:
            "/browse/c0-sports/c1-cycling/c2-hybrid-cycling/_/N-13fd5ff",
        },
      ],
    },
    {
      priority: 4,
      displayName: "玩具模型",
      menuThumbnail:
        "https://pixl.decathlon.com.cn/s805057/k$11955072bf2d33dc25878d85ffbfa1bd/menuThumbnail_skiing.jpg",
      categoryLink:
        "/browse/c0-sports/c1-skiing-snowboarding-sledging/_/N-1crhzc6",
      childCategories: [
        {
          displayName: "男士",
          categoryLink:
            "/browse/c0-sports/c1-skiing-snowboarding-sledging/c2-men/_/N-so50f8",
        },
        {
          displayName: "女士",
          categoryLink:
            "/browse/c0-sports/c1-skiing-snowboarding-sledging/c2-women/_/N-1ujpgrw",
        },
        {
          displayName: "青少年/婴幼儿",
          categoryLink:
            "/browse/c0-sports/c1-skiing-snowboarding-sledging/c2-kids/_/N-1h81nb",
        },
        {
          displayName: "冰雪限量",
          categoryLink:
            "/browse/c0-sports/c1-skiing-snowboarding-sledging/c2--/_/N-99jyye",
        },
      ],
    },
    {
      priority: 5,
      displayName: "办公用品",
      menuThumbnail:
        // "https://pixl.decathlon.com.cn/s805072/k$a908bc5e3be7688167337ae8e4c90187/menuThumbnail_football.jpg",
        "https://pixl.decathlon.com.cn/s858812/k$dd86201b131a0863ff87fcbd546b748f/menuThumbnail_fitness.jpg",

      categoryLink: "/browse/c0-sports/c1-football/_/N-16de8ae",
      childCategories: [
        {
          displayName: "青少年",
          categoryLink: "/browse/c0-sports/c1-football/c2-junior/_/N-nfonau",
        },
        {
          displayName: "成人",
          categoryLink: "/browse/c0-sports/c1-football/c2-adult/_/N-1ba8flf",
        },
        {
          displayName: "PUMA",
          categoryLink: "/browse/c0-sports/c1-football/c2-puma/_/N-1oi2603",
        },
      ],
    },
    // {
    //   priority: 6,
    //   displayName: "办公用品",
    //   menuThumbnail:
    //     "https://pixl.decathlon.com.cn/s805053/k$0fb047e2ae8b0547b086970873a70dd8/menuThumbnail_basketball.jpg",
    //   categoryLink: "/browse/c0-sports/c1-basketball/_/N-mosofv",
    //   childCategories: [
    //     {
    //       displayName: "NBA授权产品",
    //       categoryLink:
    //         "/browse/c0-sports/c1-basketball/c2-nbaproducts/_/N-yz1qj2",
    //     },
    //     {
    //       displayName: "篮球/篮板",
    //       categoryLink:
    //         "/browse/c0-sports/c1-basketball/c2-basketball/_/N-deq4vq",
    //     },
    //     {
    //       displayName: "运动护具",
    //       categoryLink:
    //         "/browse/c0-sports/c1-basketball/c2-protect/_/N-1u17g1q",
    //     },
    //     {
    //       displayName: "成人服饰",
    //       categoryLink: "/browse/c0-sports/c1-basketball/c2-adult/_/N-1tpeqkx",
    //     },
    //     {
    //       displayName: "青少年/儿童服饰",
    //       categoryLink: "/browse/c0-sports/c1-basketball/c2-jr/_/N-1t7eb7w",
    //     },
    //     {
    //       displayName: "WILSON篮球",
    //       categoryLink: "/browse/c0-sports/c1-basketball/c2-wilson/_/N-ni773r",
    //     },
    //   ],
    // },
  ],
});
console.log(result);
</script>

<style lang="less" scoped>
.homepage {
  padding-top: 46px;
  height: 575px;
  position: relative;
}

.live {
  width: 1200px;
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 40px;
  h1 {
    font-size: 30px;
  }

  .live-list {
    display: flex;
    flex-wrap: wrap;
    .live-item {
      width: 300px;
    }
    .live-btn {
      display: flex;
      height: 110px;
      width: 250px;
      background-color: #fff;
      border-radius: 8px 8px 25px 8px;
      margin-bottom: 30px;
      box-shadow: 5px 5px 5px #ccc;
      align-items: center;
      justify-content: center;
      position: relative;
      img {
        position: absolute;
        width: 90px;
        height: 100px;
        left: -15px;
        top: -15px;
      }
      h3 {
        font-weight: 900;
        font-size: 25px;
      }
    }
  }
}
</style>
