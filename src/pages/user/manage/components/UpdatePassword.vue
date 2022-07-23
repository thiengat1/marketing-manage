<!--
 * @Description: update password form
 * @Author: code pro
 * @Date: 2022-06-11 14:44:54
 * @LastEditTime: 2022-06-25 23:13:53
 * @LastEditors: code pro
-->
<template>
  <div>
    <Dialog
      header="Cập nhật mật khẩu"
      v-model:visible="displayModal"
      :style="{ width: '50vw' }"
      :modal="true"
      class="p-fluid"
    >
      <div
        class="field p-input-icon-right"
        v-for="item in formItems"
        :key="item.name"
      >
        <label
          v-if="item.name !== 'username' && item.name !== 'old_password'"
          for="key"
          >{{ item.label }}</label
        >
        <label v-if="item.name === 'old_password' && isMe" for="key">{{
          item.label
        }}</label>
        <span class="relative">
          <div
            class="font-bold text-blue-500"
            v-if="item.name === 'username' && !isMe"
          >
            {{ username }}
          </div>
          <Password
            v-if="item.name !== 'username' && item.name !== 'old_password'"
            v-model.trim="formValue[item.name]"
            toggleMask
          ></Password>
          <Password
            v-if="item.name === 'old_password' && isMe"
            v-model.trim="formValue[item.name]"
            toggleMask
          ></Password>
        </span>
        <small
          class="p-error"
          v-if="
            submitted &&
            !formValue[item.name] &&
            item.name !== 'username' &&
            item.name !== 'old_password'
          "
          >{{ item.label }} không được trống.</small
        >
        <small
          class="p-error"
          v-if="
            submitted &&
            !formValue[item.name] &&
            item.name === 'old_password' &&
            isMe
          "
          >{{ item.label }} không được trống.</small
        >
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          @click="closeModal"
          class="p-button-text"
        />
        <Button label="Yes" icon="pi pi-check" @click="submitModal" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import {
  updateAnotherUserPassword,
  updatePassword,
} from '@/api/user/manage.js';
import { userRolesEnums } from '@/enums/common.js';
import { setToast } from '@/utils/auth';
export default {
  name: 'UpdatePassword',
  props: ['dialog', 'isMe'],
  data() {
    return {
      userRolesEnums,
    };
  },
  setup(props, context) {
    const displayModal = ref(false);
    const formValue = ref({});
    const submitted = ref(false);
    const username = ref('');

    const formItems = [
      { label: 'Tài khoản', name: 'username' },
      { label: 'Mật khẩu cũ', name: 'old_password' },
      { label: 'Mật khẩu mới', name: 'new_password' },
      { label: 'Nhập lại mật khẩu mới', name: 'repassword' },
    ];

    watch(displayModal, (newValue) => {
      if (newValue) {
        handleRefreshForm();
      }
    });

    function handleRefreshForm() {
      submitted.value = false;
      formValue.value = {};
    }

    function closeModal() {
      displayModal.value = false;
    }

    function submitModal() {
      submitted.value = true;
      let params = {};
      params = formValue.value;
      let checkValidate = handleCheckValidate(params);
      params.username = username.value;

      if (!checkValidate) {
        if (!checkPassNotMatch(params)) {
          setToast({
            type: 'error',
            code: 'Lỗi',
            message: 'Mật khẩu không khớp',
          });
          return;
        }
        let func = updateAnotherUserPassword;
        if (props.isMe) {
          func = updatePassword;
        }
        func(params).then(() => {
          context.emit('onSuccess');
          closeModal();
          setToast({
            type: 'success',
            code: 'Thành công',
            message: 'Cập nhật mật khẩu thành công',
          });
        });
      }
    }

    function handleCheckValidate(params) {
      let valid = false;
      let keyArr = Object.keys(params);
      if (keyArr.includes('username')) {
        if (props.isMe) {
          if (Object.values(params).length < 4) {
            valid = true;
          }
        } else {
          if (Object.values(params).length < 3) {
            valid = true;
          }
        }
      } else {
        if (props.isMe) {
          if (Object.values(params).length < 3) {
            valid = true;
          }
        } else {
          if (Object.values(params).length < 2) {
            valid = true;
          }
        }
      }

      return valid;
    }

    function checkIsPassword(name) {
      return name.includes('password');
    }

    function checkPassNotMatch(params) {
      return params.new_password === params.repassword;
    }

    return {
      displayModal,
      formValue,
      submitted,
      formItems,
      submitModal,
      closeModal,
      handleRefreshForm,
      handleCheckValidate,
      checkIsPassword,
      checkPassNotMatch,
      username,
    };
  },
};
</script>

<style lang="scss" scoped></style>
