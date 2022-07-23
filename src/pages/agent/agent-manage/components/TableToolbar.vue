<!--
 * @Description: toolbar
 * @Author: code pro
 * @Date: 2022-06-10 14:52:12
 * @LastEditTime: 2022-06-25 23:12:51
 * @LastEditors: code pro
-->
<template>
  <div>
    <div class="flex justify-content-between flex-wrap">
      <div class="flex mb-2">
        <Button
          label="Thêm mới"
          icon="pi pi-plus"
          class="p-button-success mr-4"
          @click="handleTranslationCreate"
          v-if="permission"
        />
        <Filter v-model="filter" />
      </div>
      <div class="flex mb-2">
        <FileUpload
          mode="basic"
          :maxFileSize="1000000"
          label="Import"
          chooseLabel="Import"
          class="mr-2 inline-block"
          @uploader="onUploader"
          :customUpload="true"
          :auto="true"
        />
        <ExportData
          :header="header"
          :filter-val="fieldValue"
          :datas="handleGetExportData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { importExcel } from '@/api/agent/manage.js';
import Filter from '@/components/filters/index.vue';
import { setToast } from '@/utils/auth';
import ExportData from '@/components/DataExport/index.vue';
export default {
  name: 'TableToolbar',
  components: {
    Filter,
    ExportData,
  },
  props: ['permission', 'handleGetExportData'],
  setup(props, context) {
    const filter = ref('');

    const header = [
      'Đại lý',
      'Tài khoản hội viên',
      'Họ tên',
      'Số điện thoại',
      'Tháng',
      'Số ngày không đăng  nhập',
      'Thắng thua trong tháng',
    ];

    const fieldValue = [
      'agency',
      'player_username',
      'full_name',
      'phone',
      'month',
      'logout_days',
      'total_money',
    ];

    watch(filter, (newValue) => {
      context.emit('onFilter', newValue);
    });

    function handleTranslationCreate() {
      context.emit('onCreate');
    }

    function onUploader(file) {
      const formData = new FormData();
      formData.append('file', file.files[0]);
      importExcel(formData).then(() => {
        context.emit('uploadSuccess');
        setToast({
          type: 'success',
          code: 'Thành công',
          message: 'Thành công',
        });
      });
    }

    return {
      filter,
      handleTranslationCreate,
      onUploader,
      header,
      fieldValue,
    };
  },
};
</script>

<style lang="scss" scoped></style>
