<!--
 * @Description: User Manage
 * @Author: code pro
 * @Date: 2022-06-10 14:24:38
 * @LastEditTime: 2022-06-25 23:13:21
 * @LastEditors: code pro
-->
<template>
  <div>
    <TableData ref="tableDataRef" @onCreate="handleOnCreate" />
    <CreateForm ref="createFormRef" @onSuccess="handleSuccess" />
  </div>
</template>

<script>
import TableData from './components/TableData.vue';
import CreateForm from './components/CreateForm.vue';
import { setToast } from '@/utils/auth';
import { ref } from 'vue';
export default {
  name: 'UserManage',
  components: {
    TableData,
    CreateForm,
  },
  setup() {
    let dialog = ref(false);

    let createFormRef = ref('');
    let tableDataRef = ref('');

    function handleOnCreate() {
      createFormRef.value.displayModal = true;
    }

    function handleSuccess() {
      tableDataRef.value.init();
      setToast({
        type: 'success',
        code: 'Thành công',
        message: 'Thao tác thành công',
      });
    }

    return {
      dialog,
      tableDataRef,
      createFormRef,
      handleOnCreate,
      handleSuccess,
    };
  },
};
</script>

<style lang="scss" scoped></style>
