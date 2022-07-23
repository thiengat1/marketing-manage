<!--
 * @Description: login background
 * @Author: code pro
 * @Date: 2022-06-02 16:18:32
 * @LastEditTime: 2022-06-25 23:13:03
 * @LastEditors: code pro
-->
<template>
  <div
    class="login-bg col-3 p-0 h-full h-screen m-auto flex justify-content-center align-items-center relative"
  >
    <div class="w-full h-screen">
      <img class="w-full h-full" src="@/assets/login/login-bg.jpeg" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginBackground',
};
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 768px) {
  .login-bg {
    display: none !important;
  }
}
</style>
