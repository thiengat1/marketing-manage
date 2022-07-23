<!--
 * @Description: menu
 * @Author: code pro
 * @Date: 2022-06-07 17:57:41
 * @LastEditTime: 2022-06-10 23:42:06
 * @LastEditors: code pro
-->
<template>
  <div class="layout-menu-container">
    <AppSubmenu
      :items="model"
      class="layout-menu"
      :root="true"
      @menuitem-click="onMenuItemClick"
      @keydown="onKeyDown"
    />
  </div>
</template>

<script>
import AppSubmenu from "./AppSubmenu";

export default {
  props: {
    model: Array,
  },
  methods: {
    onMenuItemClick(event) {
      this.$emit("menuitem-click", event);
    },
    onKeyDown(event) {
      const nodeElement = event.target;
      if (event.code === "Enter" || event.code === "Space") {
        nodeElement.click();
        event.preventDefault();
      }
    },
    bannerImage() {
      return this.$appState.darkTheme
        ? "images/banner-primeblocks-dark.png"
        : "images/banner-primeblocks.png";
    },
  },
  computed: {
    darkTheme() {
      return this.$appState.darkTheme;
    },
  },
  components: {
    AppSubmenu: AppSubmenu,
  },
};
</script>
