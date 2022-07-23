<!--
 * @Description: user create form
 * @Author:code pro
 * @Date: 2022-06-11 14:44:54
 * @LastEditTime: 2022-06-26 21:47:30
 * @LastEditors: Ian
-->
<template>
  <div>
    <Dialog
      header="Thêm mới"
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
        <label for="key">{{ item.label }}</label>
        <span class="relative">
          <Dropdown
            v-model="formValue[item.name]"
            :options="userRolesNotAdminEnums"
            optionLabel="name"
            optionValue="id"
            placeholder="Mời chọn"
            v-if="item.name === 'types'"
          />
          <InputText
            v-else-if="!checkIsPassword(item.name)"
            :id="'key' + item.name"
            v-model.trim="formValue[item.name]"
            required="true"
            autofocus
            :class="{
              'p-invalid': submitted && !formValue[item.name],
            }"
          />
          <Password
            v-else
            v-model.trim="formValue[item.name]"
            toggleMask
          ></Password>
        </span>
        <small class="p-error" v-if="submitted && !formValue[item.name]"
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
import { createUser } from '@/api/user/manage.js';
import { userRolesEnums, userRolesNotAdminEnums } from '@/enums/common.js';
import { setToast } from '@/utils/auth';
export default {
  name: 'CreateForm',
  props: ['dialog'],
  data() {
    return {
      userRolesEnums,
      userRolesNotAdminEnums,
    };
  },
  setup(props, context) {
    const displayModal = ref(false);
    const formValue = ref({});
    const submitted = ref(false);

    const formItems = [
      { label: 'Loại tài khoản', name: 'types' },
      { label: 'Tài khoản', name: 'username' },
      { label: 'Tên người dùng', name: 'name' },
      { label: 'Mật khẩu', name: 'password' },
      { label: 'Nhập lại mật khẩu', name: 'repassword' },
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
      let params = formValue.value;
      let checkValidate = handleCheckValidate(params);
      if (!checkValidate) {
        if (!checkPassNotMatch(params)) {
          setToast({
            type: 'error',
            code: 'Lỗi',
            message: 'Mật khẩu không khớp',
          });
          return;
        }
        createUser(params).then(() => {
          context.emit('onSuccess');
          closeModal();
        });
      }
    }

    function handleCheckValidate(params) {
      let valid = false;
      if (Object.values(params).length < 5) {
        valid = true;
      }

      return valid;
    }

    function checkIsPassword(name) {
      return name.includes('password');
    }

    function checkPassNotMatch(params) {
      return params.password === params.repassword;
    }

    function handleDisableOptions(e) {
      const adminType = 99; //admin
      if (e.id === adminType) {
        return true;
      }
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
      handleDisableOptions,
    };
  },
};
</script>

<style lang="scss" scoped></style>
