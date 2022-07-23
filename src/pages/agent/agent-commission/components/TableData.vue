<!--
 * @Description: table data
 * @Author: code pro
 * @Date: 2022-06-10 14:35:29
 * @LastEditTime: 2022-06-25 23:12:21
 * @LastEditors: code pro
-->
<template>
  <div class="card">
    <DataTable
      :value="data"
      :paginator="true"
      :rows="rows"
      :paginatorTemplate="paginatorTemplate"
      :rowsPerPageOptions="rowsPerPageOptions"
      responsiveLayout="scroll"
      :breakpoint="breakPoint"
      :currentPageReportTemplate="currentPageReportTemplate"
      class="editable-cells-table"
      paginatorPosition="bottom"
      dataKey="id"
      @page="pageChange"
      :totalRecords="totalRecords"
      :lazy="true"
      v-model:filters="filters"
      filterDisplay="menu"
      @filter="handleOnFilterWithVariable($event)"
      :scrollable="scrollHeight ? true : false"
      :scrollHeight="scrollHeight ? scrollHeight - 30 + 'px' : null"
    >
      <template #header>
        <TableToolbar
          @onCreate="handleOnCreateUser"
          @onFilter="handleFilterData"
          :handleGetExportData="handleGetExportData"
        />
      </template>
      <Column
        v-for="col of columns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
        style="width: 17%"
        :showFilterMatchModes="false"
      >
        <template #filter="{ filterModel }" v-if="col.field === 'agency'">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Đại lý"
          />
        </template>
        <template #body="{ data, field }">
          <span>{{
            field === 'agency' ? data[field] : `${data[field]}%`
          }}</span>
        </template>
      </Column>
      <Column :exportable="false" style="min-width: 10%">
        <template #body="slotProps">
          <div class="flex flex-direction-row">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-primary mr-2"
              @click="handleUpdate(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              @click="handleDelete(slotProps.data)"
            />
          </div>
        </template>
      </Column>
      <template #paginatorstart>
        <Button
          type="button"
          icon="pi pi-refresh"
          class="p-button-text"
          @click="init()"
        />
      </template>
    </DataTable>
    <CreateForm ref="CreateFormRef" @onSuccess="init()" />
  </div>
</template>

<script>
import { useInitTable } from '@/hooks/init-table';
import { ref, onMounted } from 'vue';
import { useInitConfirm } from '@/hooks/use-confirm.js';
import { setToast } from '@/utils/auth';
import TableToolbar from './TableToolbar.vue';
import { FilterMatchMode } from 'primevue/api';
import { listApi, deleteCommissionConfig } from '@/api/agent/commission.js';
import CreateForm from './CreateForm.vue';
export default {
  name: 'TableData',
  components: {
    TableToolbar,
    CreateForm,
  },
  data() {
    return {};
  },
  setup(props, context) {
    const {
      data,
      totalRecords,
      rows,
      paginatorTemplate,
      rowsPerPageOptions,
      responsiveLayout,
      currentPageReportTemplate,
      getTableHeaders,
      pageChange,
      setUrl,
      setParams,
      init,
      toFilter,
      breakPoint,
      scrollHeight,
      reRender,
      handleGetExportData,
    } = useInitTable();

    const { confirmProcess } = useInitConfirm();
    const currentRow = ref({});
    const shadowRow = ref({});

    const CreateFormRef = ref('');

    const columns = [
      { field: 'agency', header: 'Đại lý' },
      { field: 'level1', header: 'Mức 1 (0-100tr)' },
      { field: 'level2', header: 'Mức 2 (100tr-500tr)' },
      { field: 'level3', header: 'Mức 3 (500tr-1 tỷ)' },
      { field: 'level4', header: 'Mức 4 (Trên 1 tỷ)' },
    ];

    const filters = ref({
      agency: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    onMounted(() => {
      handleInitData();
    });

    function handleInitData() {
      setUrl(listApi.getAgentConfigUrl);
      setParams({ is_paginate: 1 });
      init();
    }

    function handleDelete(row) {
      confirmProcess({
        header: 'Xác nhận',
        message: 'Bạn chắc chắn muốn xoá không',
        acceptCb: () => handleDoDelete(row),
      });
    }

    function handleDoDelete(row) {
      let params = { id: row.id };
      deleteCommissionConfig(params).then(() => {
        init();
        setToast({
          type: 'success',
          code: 'Thành công',
          message: 'Xoá thành công',
        });
      });
    }

    function handleOnCreateUser() {
      context.emit('onCreate');
    }

    function handleOnFilterWithVariable() {
      const params = {
        agency: filters.value.agency.value,
      };
      setParams(params);
      toFilter();
    }

    function handleUpdate(row) {
      CreateFormRef.value.displayModal = true;
      CreateFormRef.value.isAdd = false;
      CreateFormRef.value.setFormValues(row);
    }

    function handleFilterData(value) {
      filters.value = {
        agency: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
      if (typeof value === 'string') {
        setParams({ value: value });
      } else {
        setParams({ value: '' });
      }
      toFilter();
    }

    return {
      data,
      totalRecords,
      rows,
      paginatorTemplate,
      rowsPerPageOptions,
      responsiveLayout,
      currentPageReportTemplate,
      getTableHeaders,
      pageChange,
      columns,
      currentRow,
      shadowRow,
      setUrl,
      setParams,
      init,
      handleDelete,
      confirmProcess,
      handleDoDelete,
      handleOnCreateUser,
      filters,
      handleOnFilterWithVariable,
      toFilter,
      scrollHeight,
      breakPoint,
      CreateFormRef,
      handleUpdate,
      handleFilterData,
      reRender,
      handleGetExportData,
    };
  },
};
</script>

<style lang="scss" scoped></style>
