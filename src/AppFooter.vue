<!--
 * @Description: 
 * @Author: code pro
 * @Date: 2022-06-07 17:57:41
 * @LastEditTime: 2022-06-19 17:45:02
 * @LastEditors: code pro
-->
<template>
  <div class="layout-footer">
    <img alt="Logo" :src="footerImage()" height="20" class="mr-2" />
    © Copy right
    <span class="font-medium ml-2">ku66.org</span>
  </div>
</template>

<script>
export default {
  name: "AppFooter",
  methods: {
    footerImage() {
      return this.$appState.darkTheme
        ? "images/logo/logo.png"
        : "images/logo/logo.png";
    },
  },
  computed: {
    darkTheme() {
      return this.$appState.darkTheme;
    },
  },
};
</script>
