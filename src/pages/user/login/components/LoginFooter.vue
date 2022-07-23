<!--
 * @Description: login footer
 * @Author: code pro
 * @Date: 2022-06-02 15:18:43
 * @LastEditTime: 2022-06-25 23:13:09
 * @LastEditors: code pro
-->
<template>
  <div
    class="login-form__footer flex flex-column text-center absolute bottom-0 mb-1 text-sm"
  >
    <span class="mt-1">
      <span class="login-form__footer-copy text-green-600">COPYRIGHT</span>
      <span>© 2022</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'LoginFooter',
};
</script>

<style lang="scss" scoped>
.login-form__footer-contact {
  color: #0d4280;
}
</style>
