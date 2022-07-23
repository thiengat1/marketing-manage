<!--
 * @Description: login index
 * @Author: code pro
 * @Date: 2022-05-31 16:36:23
 * @LastEditTime: 2022-06-25 23:12:56
 * @LastEditors: code pro
-->
<template>
  <div class="login-container flex h-screen">
    <LoginBackground />
    <div
      class="login-form col-9 flex justify-content-center align-items-center flex-column relative"
    >
      <div class="login-form__logo text-center mb-3">
        <h2>TRANG QUẢN LÝ</h2>
      </div>

      <LoginUsername @onLoginViaOa="handleOnLoginViaOa" />
    </div>
  </div>
</template>

<script>
import LoginUsername from './components/LoginUsername.vue';
import LoginBackground from './components/LoginBackground.vue';
import { ref } from 'vue';

export default {
  name: 'Login',
  components: {
    LoginUsername,
    LoginBackground,
  },
  setup() {
    const isLoginDirect = ref(true);
    const LoginViaOaRef = ref(null);

    function handleLoginNotYou() {
      isLoginDirect.value = false;
    }

    function handleOnUpdateIsLoginDirect(value) {
      isLoginDirect.value = value;
    }

    function handleOnLoginViaOa() {
      LoginViaOaRef.value.displayModal = true;
    }

    return {
      isLoginDirect,
      LoginViaOaRef,
      handleLoginNotYou,
      handleOnUpdateIsLoginDirect,
      handleOnLoginViaOa,
    };
  },
  computed: {
    logoColor() {
      if (this.$appState.darkTheme) return 'white';
      return 'dark';
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  background: linear-gradient(180deg, #2e323f 0%, #0a061a 100%);
}

// .login-form::before {
//   background-image: url("../../../assets/login/bg-img.png");
//   background-size: 30% 30%;
//   background-repeat: no-repeat;
//   content: '';
//   display: block;
//   height: 100%;
//   position: absolute;
//   width: 100%;
// }

@media only screen and (max-width: 768px) {
  .login-container {
    padding: 24px !important;
  }

  .login-form {
    width: 100% !important;
    padding: 0 20%;
  }

  .login-form__title {
    display: block !important;
  }
}
</style>
