<!--
 * @Description: user create form
 * @Author: code pro
 * @Date: 2022-06-11 14:44:54
 * @LastEditTime: 2022-06-25 23:12:38
 * @LastEditors: code pro
-->
<template>
  <div>
    <Dialog
      :header="isAdd ? 'Thêm mới' : 'Sửa'"
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
          <Calendar
            v-if="item.name === 'month'"
            id="icon"
            v-model="formValues[item.name]"
            view="month"
            dateFormat="yy-mm"
            :showIcon="true"
          />
          <InputNumber
            v-else-if="item.name === 'logout_days'"
            :id="'key' + item.name"
            v-model="formValues[item.name]"
            required="true"
            autofocus
            :minFractionDigits="0"
            :class="{
              'p-invalid': submitted && !formValues[item.name],
            }"
          />
          <InputText
            v-else-if="item.name !== 'total_money'"
            :id="'key' + item.name"
            v-model.trim="formValues[item.name]"
            required="true"
            autofocus
            :class="{
              'p-invalid': submitted && !formValues[item.name],
            }"
          />

          <InputNumber
            v-else
            :id="'key' + item.name"
            v-model="formValues[item.name]"
            required="true"
            autofocus
            mode="decimal"
            :minFractionDigits="0"
            :class="{
              'p-invalid': submitted && !formValues[item.name],
            }"
          />
        </span>
        <small
          v-if="
            !['month', 'logout_days'].includes(item.name) &&
            ((v$[item.name].$invalid && submitted) ||
              v$[item.name].$pending.$response)
          "
          class="p-error"
          >{{
            v$[item.name].required.$message.replace('Value', item.label)
          }}</small
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
import { reactive, ref, watch, computed } from 'vue';
import { createAgentManage, updateAgentManage } from '@/api/agent/manage.js';
import { userRolesEnums } from '@/enums/common.js';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { convertToMonth } from '@/utils/common';
export default {
  name: 'CreateForm',
  props: ['dialog'],
  data() {
    return {
      userRolesEnums,
    };
  },
  setup(props, context) {
    const displayModal = ref(false);
    let formValues = reactive({});
    const submitted = ref(false);
    const isAdd = ref(true);
    const rules = computed(() => {
      return {
        agency: {
          required: helpers.withMessage('Value không được trống', required),
        },
        player_username: {
          required: helpers.withMessage('Value không được trống', required),
        },
        full_name: {
          required: helpers.withMessage('Value không được trống', required),
        },
        phone: {
          required: helpers.withMessage('Value không được trống', required),
        },
        total_money: {
          required: helpers.withMessage('Value không được trống', required),
        },
      };
    });
    const v$ = useVuelidate(rules, formValues);

    const formItems = [
      { label: 'Đại lý', name: 'agency' },
      { label: 'Tài khoản hội viên', name: 'player_username' },
      { label: 'Họ tên', name: 'full_name' },
      { label: 'Số điện thoại', name: 'phone' },
      { label: 'Tháng', name: 'month' },
      { label: 'Số ngày không đăng  nhập', name: 'logout_days' },
      { label: 'Thắng thua trong tháng', name: 'total_money' },
    ];

    watch(displayModal, (newValue) => {
      if (newValue && isAdd.value) {
        handleRefreshForm();
      }
    });

    function handleRefreshForm() {
      submitted.value = false;
      formValues.id = undefined;
      formValues.agency = undefined;
      formValues.player_username = undefined;
      formValues.full_name = undefined;
      formValues.phone = undefined;
      formValues.total_money = undefined;
      formValues.month = undefined;
      formValues.logout_days = undefined;
    }

    function closeModal() {
      displayModal.value = false;
    }

    function setFormValues(row) {
      formValues.id = row.id;
      formValues.agency = row.agency;
      formValues.player_username = row.player_username;
      formValues.full_name = row.full_name;
      formValues.phone = row.phone;
      formValues.total_money = parseFloat(row.total_money);
      formValues.logout_days = row.logout_days;
      formValues.month = row.month;
    }

    function submitModal() {
      submitted.value = true;
      let params = formValues;
      params.month = params.month ? convertToMonth(params.month) : '';
      if (!v$.value.$invalid) {
        let func = createAgentManage;
        if (!isAdd.value) {
          func = updateAgentManage;
        }
        func(params).then(() => {
          context.emit('onSuccess');
          closeModal();
        });
      }
    }

    return {
      displayModal,
      formValues,
      submitted,
      formItems,
      submitModal,
      closeModal,
      handleRefreshForm,
      setFormValues,
      isAdd,
      v$,
    };
  },
};
</script>

<style lang="scss" scoped></style>
