<!--
 * @Description: 
 * @Author: code pro
 * @Date: 2022-06-08 16:32:27
 * @LastEditTime: 2022-06-16 22:56:40
 * @LastEditors: Ian
-->
<template>
  <AppLoading />
  <GlobalToast />
  <ConfirmDialog></ConfirmDialog>
  <router-view></router-view>
</template>

<script>
import EventBus from "./AppEventBus";
import AppLoading from "@/components/loading";
import GlobalToast from "@/components/global-toast";

export default {
  themeChangeListener: null,
  components: {
    AppLoading,
    GlobalToast,
  },
  mounted() {
    this.themeChangeListener = (event) => {
      const elementId = "theme-link";
      const linkElement = document.getElementById(elementId);
      const cloneLinkElement = linkElement.cloneNode(true);
      const newThemeUrl = linkElement
        .getAttribute("href")
        .replace(this.$appState.theme, event.theme);

      cloneLinkElement.setAttribute("id", elementId + "-clone");
      cloneLinkElement.setAttribute("href", newThemeUrl);
      cloneLinkElement.addEventListener("load", () => {
        linkElement.remove();
        cloneLinkElement.setAttribute("id", elementId);
      });
      linkElement.parentNode.insertBefore(
        cloneLinkElement,
        linkElement.nextSibling
      );

      this.$appState.theme = event.theme;
      this.$appState.darkTheme = event.dark;
    };

    EventBus.on("theme-change", this.themeChangeListener);
  },
  beforeUnmount() {
    EventBus.off("theme-change", this.themeChangeListener);
  },
};
</script>
