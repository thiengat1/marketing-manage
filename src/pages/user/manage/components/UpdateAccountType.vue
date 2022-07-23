<!--
 * @Description: user create form
 * @Author: code pro
 * @Date: 2022-06-11 14:44:54
 * @LastEditTime: 2022-06-26 21:48:35
 * @LastEditors: Ian
-->
<template>
  <div>
    <Dialog
      header="Chỉnh sửa"
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
            v-model="formValues[item.name]"
            :options="userRolesNotAdminEnums"
            optionLabel="name"
            optionValue="id"
            placeholder="Mời chọn"
            v-if="item.name === 'types'"
          />

          <div class="text-primary" v-else-if="item.name === 'username'">
            {{ `[${name}] ${username}` }}
          </div>
          <InputText
            v-else-if="item.name === 'pid_username'"
            :id="'key' + item.name"
            v-model="formValues[item.name]"
            required="true"
            autofocus
            :class="{
              'p-invalid': submitted && !formValues[item.name],
            }"
          />
        </span>
        <small
          class="p-error"
          v-if="submitted && !formValues[item.name] && item.name !== 'username'"
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
import { ref, reactive } from 'vue';
import { updateAccountTypes } from '@/api/user/manage.js';
import { userRolesEnums, userRolesNotAdminEnums } from '@/enums/common.js';
export default {
  name: 'UpdateAccountType',
  props: ['dialog'],
  data() {
    return {
      userRolesEnums,
      userRolesNotAdminEnums,
    };
  },
  setup(props, context) {
    const displayModal = ref(false);
    let formValues = reactive({});
    const submitted = ref(false);
    const username = ref('');
    const name = ref('');
    const pid_username = ref('');
    const pid_name = ref('');

    const rowData = ref({});

    const formItems = [
      { label: 'Tài khoản', name: 'username' },
      { label: 'Cấp trên', name: 'pid_username' },
      { label: 'Loại tài khoản', name: 'types' },
    ];

    function closeModal() {
      displayModal.value = false;
    }

    function setFormValues(row) {
      let obj = userRolesEnums.find((item) => item.name === row.types);
      username.value = row.username;
      pid_name.value = row.pid_name;
      name.value = row.name;
      formValues.types = obj.id;
      formValues.pid_username = row.pid_username;
    }

    function submitModal() {
      let params = {
        username: username.value,
        pid_username: formValues.pid_username,
        types: formValues.types,
      };
      submitted.value = true;
      let checkValidate = handleCheckValidate(params);
      if (checkValidate) {
        return;
      }
      updateAccountTypes(params).then(() => {
        context.emit('onSuccess');
        closeModal();
      });
    }

    function handleCheckValidate(params) {
      let valid = false;
      if (Object.values(params).filter((item) => item !== '').length < 3) {
        valid = true;
      }

      return valid;
    }

    function handleDisableOptions(e) {
      const adminType = 99; //admin
      if (e.id === adminType) {
        return true;
      }
    }

    return {
      displayModal,
      formValues,
      submitted,
      formItems,
      submitModal,
      closeModal,
      handleCheckValidate,
      rowData,
      setFormValues,
      username,
      pid_username,
      pid_name,
      name,
      handleDisableOptions,
    };
  },
};
</script>

<style lang="scss" scoped></style>
