<template>
  <suspense>
    <template #fallback>
      <div class="loading">
        <Loading></Loading>
      </div>
    </template>
    <template #default>
      <h1><HomeAsync></HomeAsync></h1>
    </template>
  </suspense>
</template>
<script setup>
import Loading from "../components/Loading.vue";
import { onMounted, defineAsyncComponent } from "vue";
const HomeAsync = defineAsyncComponent(() =>
  import("../components/HomeCom.vue")
);

onMounted(async () => {
  //   let result = await api.getHomepage();
  //   console.log(result);
});
</script>

<style lang="less" scoped></style>
