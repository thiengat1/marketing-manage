<!--
 * @Description: toolbar
 * @Author: code pro
 * @Date: 2022-06-10 14:52:12
 * @LastEditTime: 2022-06-26 21:14:50
 * @LastEditors: Ian
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
        />
        <Filter v-model="filter" />
      </div>
      <div class="flex mb-2">
        <ExportData
          :header="header"
          :filter-val="fieldValue"
          :datas="handleExport"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import Filter from '@/components/filters/index.vue';
import ExportData from '@/components/DataExport/index.vue';
import { userRolesEnums } from '@/enums/common.js';
export default {
  name: 'TableToolbar',
  components: {
    Filter,
    ExportData,
  },
  props: ['handleGetExportData'],
  setup(props, context) {
    const filter = ref('');

    const header = ['Tài khoản', 'Tên', 'Cấp trên', 'Loại tài khoản'];

    const fieldValue = ['username', 'name', 'pid_username', 'types'];

    watch(filter, (newValue) => {
      context.emit('onFilter', newValue);
    });

    function handleTranslationCreate() {
      context.emit('onCreate');
    }

    function handleExport() {
      return new Promise((resolve, reject) => {
        // call API depend params then set data

        props
          .handleGetExportData()
          .then((response) => {
            let tamp = [];
            if (response) {
              tamp = response.map((item) => {
                let userType = userRolesEnums.find(
                  (role) => role.id === item.types
                );
                item.types = userType.name;
                return item;
              });
            }
            resolve(tamp);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }

    return {
      filter,
      handleTranslationCreate,
      header,
      fieldValue,
      handleExport,
    };
  },
};
</script>

<style lang="scss" scoped></style>
