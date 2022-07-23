<!--
 * @Description: loading
 * @Author: code pro
 * @Date: 2022-06-08 13:45:16
 * @LastEditTime: 2022-06-25 23:11:41
 * @LastEditors: code pro
-->
<template>
  <div class="app-loading" v-if="loading">
    <ProgressSpinner />
  </div>
</template>

<script>
import ProgressSpinner from 'primevue/progressspinner';
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'Loading',
  components: {
    ProgressSpinner,
  },
  setup() {
    const store = useStore();

    const loading = computed(() => store.state.auth.globalLoading);

    return {
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.app-loading {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($color: #000000, $alpha: 0.3);
  z-index: 3000;
}
</style>
