<!--
 * @Description: user create form
 * @Author: code pro
 * @Date: 2022-06-11 14:44:54
 * @LastEditTime: 2022-06-25 23:12:14
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
          <InputText
            v-if="item.name === 'agency'"
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
            :minFractionDigits="1"
            :class="{
              'p-invalid': submitted && !formValues[item.name],
            }"
          />
        </span>
        <small
          v-if="
            (v$[item.name].$invalid && submitted) ||
            v$[item.name].$pending.$response
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
import { computed, reactive, ref, watch } from 'vue';
import {
  createCommissionConfig,
  updateCommissionConfig,
} from '@/api/agent/commission.js';
import { userRolesEnums } from '@/enums/common.js';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
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
        level1: {
          required: helpers.withMessage('Value không được trống', required),
        },
        level2: {
          required: helpers.withMessage('Value không được trống', required),
        },
        level3: {
          required: helpers.withMessage('Value không được trống', required),
        },
        level4: {
          required: helpers.withMessage('Value không được trống', required),
        },
      };
    });
    const v$ = useVuelidate(rules, formValues);

    const formItems = [
      { label: 'Đại lý', name: 'agency' },
      { label: 'Mức 1 (0-100tr)', name: 'level1' },
      { label: 'Mức 2 (100tr-500tr)', name: 'level2' },
      { label: 'Mức 3 (500tr-1 tỷ)', name: 'level3' },
      { label: 'Mức 4 (Trên 1 tỷ)', name: 'level4' },
    ];

    watch(displayModal, (newValue) => {
      if (newValue && isAdd.value) {
        handleRefreshForm();
      }
    });

    function handleRefreshForm() {
      submitted.value = false;
      formValues.id = '';
      formValues.agency = '';
      formValues.level1 = undefined;
      formValues.level2 = undefined;
      formValues.level3 = undefined;
      formValues.level4 = undefined;
    }

    function closeModal() {
      displayModal.value = false;
    }

    function setFormValues(row) {
      formValues.id = row.id;
      formValues.agency = row.agency;
      formValues.level1 = row.level1;
      formValues.level2 = row.level2;
      formValues.level3 = row.level3;
      formValues.level4 = row.level4;
    }

    function submitModal() {
      submitted.value = true;
      let params = formValues;
      if (!v$.value.$invalid) {
        let func = createCommissionConfig;
        if (!isAdd.value) {
          func = updateCommissionConfig;
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
