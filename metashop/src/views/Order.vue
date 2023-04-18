
<template>
  <a-list
    style="padding-top: 50px"
    item-layout="vertical"
    size="large"
    :pagination="pagination"
    :data-source="listData"
    :bordered="true"
  >
    <!-- <template #footer>
      <div>
        <b>ant design vue</b>
        footer part
      </div>
    </template> -->
    <template #renderItem="{ item }">
      <a-list-item key="item.id">
        <template #extra>
          <img height="150" alt="logo" :src="item.imgsrc" />
        </template>
        <!-- <a-list-item-meta :description="item.name">
          <template #title>
            <a>{{ item.title }}*{{ item.num }}</a>
          </template>
          <template #avatar><a-avatar :src="item.avatar" /></template>
        </a-list-item-meta> -->
        <div style="font-weight: 600; font-size: x-large; color: #333399">
          {{ item.title }}&nbsp;<a style="color: #ff0033">*{{ item.num }}</a>
        </div>
        <div style="font-weight: 300; font-size: medium; color: gray">
          收货信息：{{ item.name }}&nbsp;&nbsp;&nbsp;{{
            item.phone
          }}&nbsp;&nbsp;&nbsp;{{ item.address }}
        </div>
        <div style="font-weight: 300; font-size: medium; color: gray">
          单价：￥{{ item.price }}
        </div>
        <div style="font-weight: 300; font-size: medium; color: gray">
          总价：￥{{ item.totalPrice }}
        </div>
        <div style="font-weight: 300; font-size: medium; color: gray">
          {{ item.time }}
        </div>
      </a-list-item>
    </template>
  </a-list>
</template>

<script>
import {
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import axios from "axios";

export default defineComponent({
  components: {
    StarOutlined,
    LikeOutlined,
    MessageOutlined,
  },
  setup() {
    const state = reactive({
      listData: "",
    });
    // for (let i = 0; i < 23; i++) {
    //   listData.push({
    //     href: "https://www.antdv.com/",
    //     title: `ant design vue part ${i}`,
    //     avatar: "https://joeschmoe.io/api/v1/random",
    //     description:
    //       "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    //     content:
    //       "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    //   });
    // }
    const store = useStore();
    onMounted(async () => {
      await getOrderMsg();
    });

    function getOrderMsg() {
      axios.post("/webapi/user/getOrder", store.state.userInfo).then((res) => {
        console.log(res.data);
        // for (let i = 0; i < res.data.result.length; i++) {
        //   state.listData.push(res.data.result[i]);
        // }
        state.listData = res.data.result;
        // if (res1.data.code == "200") {
        //   showToast({
        //     message: "注册成功",
        //     position: top,
        //   });

        //   router.push("/");
        // }
      });
    }
    const pagination = {
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 10,
    };
    const actions = [
      {
        type: "StarOutlined",
        text: "156",
      },
      {
        type: "LikeOutlined",
        text: "156",
      },
      {
        type: "MessageOutlined",
        text: "2",
      },
    ];
    return {
      ...toRefs(state),
      pagination,
      actions,
    };
  },
});
</script>