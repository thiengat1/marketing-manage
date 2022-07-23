<template>
  <div class="captcha flex align-items-center">
    <div class="col-6">
      <span class="w-full">
        <InputText
          class="w-full"
          id="inputtext"
          type="text"
          :value="modelValue.value"
          placeholder="验证码"
          @input="
            (e) =>
              $emit('update:modelValue', {
                value: e.target.value,
                key: captchaKey,
              })
          "
        />
      </span>
    </div>
    <div class="captcha-img col-6">
      <img
        @click="handleRefreshCaptcha"
        class="w-full captcha-img-src"
        :src="captchaImg"
      />
    </div>
  </div>
</template>

<script>
import { createCaptcha } from '@/api/user/auth';
import { ref, onMounted, watch, computed } from 'vue';
export default {
  name: 'Captcha',
  props: ['modelValue', 'isRefreshCaptcha'],
  setup(props) {
    let captchaImg = ref('');
    let captchaKey = ref('');

    let isRefreshCapt = computed(() => {
      return props.isRefreshCaptcha;
    });

    onMounted(() => {
      handleGetCaptcha();
    });

    watch(isRefreshCapt, () => {
      handleRefreshCaptcha();
    });

    function handleGetCaptcha() {
      createCaptcha()
        .then((res) => {
          const { key, img } = res.data;
          captchaImg.value = img;
          captchaKey.value = key;
        })
        .catch((err) => {
          console.log('err', err);
        });
    }

    function handleRefreshCaptcha() {
      handleGetCaptcha();
    }

    return {
      captchaImg,
      captchaKey,
      handleGetCaptcha,
      handleRefreshCaptcha,
      isRefreshCapt,
    };
  },
};
</script>

<style lang="scss" scoped>
.captcha-img {
  max-height: 56px !important;
}
.captcha-img-src {
  height: 42px !important;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
}
</style>
