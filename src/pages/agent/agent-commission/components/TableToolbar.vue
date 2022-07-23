<!--
 * @Description: toolbar
 * @Author: code pro
 * @Date: 2022-06-10 14:52:12
 * @LastEditTime: 2022-06-25 23:12:31
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
        />
        <Filter v-model="filter" />
      </div>
      <div class="flex mb-2">
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
import Filter from '@/components/filters/index.vue';
import ExportData from '@/components/DataExport/index.vue';

export default {
  name: 'TableToolbar',
  components: {
    Filter,
    ExportData,
  },
  props: ['handleGetExportData'],
  setup(props, context) {
    const filter = ref('');

    const header = [
      'Đại lý',
      'Mức 1 (0-100tr)',
      'Mức 2 (100tr-500tr)',
      'Mức 3 (500tr-1 tỷ)',
      'Mức 4 (Trên 1 tỷ)',
    ];

    const fieldValue = ['agency', 'level1', 'level2', 'level3', 'level4'];

    watch(filter, (newValue) => {
      context.emit('onFilter', newValue);
    });

    function handleTranslationCreate() {
      context.emit('onCreate');
    }

    return {
      filter,
      handleTranslationCreate,
      header,
      fieldValue,
    };
  },
};
</script>

<style lang="scss" scoped></style>
