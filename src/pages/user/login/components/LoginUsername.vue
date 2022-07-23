<!--
 * @Description: login with user
 * @Author: code pro
 * @Date: 2022-06-02 15:12:57
 * @LastEditTime: 2022-06-25 23:13:15
 * @LastEditors: code pro
-->
<template>
  <div class="login-form__with-username text-center col-4">
    <form @submit.prevent="handleLoginSubmit(!v$.$invalid)" class="p-fluid">
      <div class="field col-12 relative">
        <span class="p-float-label p-input-icon-left w-full">
          <i class="pi pi-user" />
          <InputText class="w-full" type="text" v-model="username" />
          <label for="inputtext">Tài khoản</label>
        </span>
        <small
          v-if="
            (v$.username.$invalid && submitted) ||
            v$.username.$pending.$response
          "
          class="p-error absolute left-0 ml-3"
          >{{
            v$.username.required.$message.replace('Value', 'Tài khoản')
          }}</small
        >
      </div>
      <div class="field col-12 relative">
        <span class="p-float-label p-input-icon-left w-full relative">
          <i class="pi pi-lock" />
          <InputText
            class="w-full"
            :type="isShowPass ? 'text' : 'password'"
            v-model="password"
          />
          <label for="inputtext">Mật khẩu</label>
          <i
            @click="handleIsShowPassword"
            v-if="!isShowPass"
            class="show-pass pi pi-eye absolute right-0 mr-2"
          />
          <i
            @click="handleIsShowPassword"
            v-else
            class="show-pass pi pi-eye-slash absolute right-0 mr-2"
          />
        </span>
        <small
          v-if="
            (v$.password.$invalid && submitted) ||
            v$.password.$pending.$response
          "
          class="p-error absolute left-0 ml-3"
          >{{
            v$.password.required.$message.replace('Value', 'Mật khẩu')
          }}</small
        >
      </div>
      <Captcha
        v-if="isCaptcha"
        v-model="captcha"
        :isRefreshCaptcha="isRefreshCaptcha"
      />
      <div class="login-btn mt-4">
        <Button type="submit" class="w-full uppercase" label="login" />
      </div>
    </form>
  </div>
</template>

<script>
import Captcha from '@/components/captcha';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { required, helpers } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { setToast } from '@/utils/auth';

export default {
  name: 'LoginUsername',
  components: {
    Captcha,
  },
  validations() {
    return {
      username: {
        required: helpers.withMessage('Value không được trống', required),
      },
      password: {
        required: helpers.withMessage('Value không được trống', required),
      },
    };
  },
  setup() {
    const store = useStore();
    // eslint-disable-next-line no-unused-vars
    const router = useRouter();
    const v$ = useVuelidate();

    const username = ref('');
    const password = ref('');
    const isShowPass = ref(false);
    const submitted = ref(false);
    const isRefreshCaptcha = ref(false);

    let captcha = ref({ value: '', key: '' });

    const isCaptcha = computed(() => store.state.auth.isCaptcha);

    function handleLoginSubmit(isFormValid) {
      submitted.value = true;
      if (!isFormValid) {
        return;
      }
      const captchaResult = captcha.value;

      if (isCaptcha.value && !captchaResult.value) {
        setToast({
          type: 'error',
          code: '',
          message: '请输入验证码',
        });
        return;
      }

      let params = {
        username: username.value,
        password: password.value,
        captcha: captchaResult,
      };
      store
        .dispatch('auth/login', params)
        .then(() => {
          router.go('/');
          window.location.reload();
        })
        .catch((err) => {
          isRefreshCaptcha.value = !isRefreshCaptcha.value;
          console.log('err', err);
        });
    }

    function handleIsShowPassword() {
      isShowPass.value = !isShowPass.value;
    }

    return {
      v$,
      username,
      password,
      captcha,
      isShowPass,
      isCaptcha,
      submitted,
      isRefreshCaptcha,
      handleLoginSubmit,
      handleIsShowPassword,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-btn {
  padding: 0 7px;
}

.show-pass {
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
}

@media only screen and (max-width: 768px) {
  .login-form__with-username {
    width: 100% !important;
  }
}
</style>
