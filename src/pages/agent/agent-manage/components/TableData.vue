<!--
 * @Description: table data
 * @Author: code pro
 * @Date: 2022-06-10 14:35:29
 * @LastEditTime: 2022-06-25 23:12:44
 * @LastEditors: code pro
-->
<template>
  <div class="card">
    <MainToolbar
      :winLostTotal="winLostTotal"
      :commissionTotal="commissionTotal"
    />
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
      :scrollHeight="scrollHeight ? scrollHeight - 100 + 'px' : null"
      rowGroupMode="subheader"
      groupRowsBy="representative.name"
    >
      <template #header>
        <TableToolbar
          @onCreate="handleOnCreateUser"
          :permission="checkPermission()"
          @uploadSuccess="init()"
          @onFilter="handleFilterData"
          :handleGetExportData="handleGetExportData"
        />
      </template>
      <Column
        v-for="col of columns"
        :field="col.field"
        :header="col.header"
        :key="col.field"
        style="width: 12%"
        :showFilterMatchModes="false"
      >
        <template #filter="{ filterModel }">
          <Calendar
            v-if="col.field === 'month'"
            id="icon"
            v-model="filterModel.value"
            view="month"
            dateFormat="yy-mm"
            :showIcon="true"
            placeholder="Tháng"
          />
          <InputNumber
            v-else-if="
              col.field === 'logout_days' || col.field === 'total_money'
            "
            v-model="filterModel.value"
            required="true"
            autofocus
            :minFractionDigits="0"
          />
          <InputText
            v-else
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            :placeholder="col.header"
          />
        </template>
        <template #body="{ data, field }">
          <span
            v-if="field === 'total_money'"
            :class="data[field] < 0 ? 'text-red-600' : 'text-green-400'"
            >{{ numberWithCommas(data[field]) }}</span
          >
          <span v-else>{{ data[field] }}</span>
        </template>
      </Column>
      <template #groupfooter="">
        <td :style="{ minWidth: checkPermission() ? '72%' : '85%' }">
          <div class="font-bold" style="text-align: right; width: 100%">
            Tổng:
          </div>
        </td>
        <td style="width: 20%" class="font-bold">
          {{ calculateCustomerTotal() }}
        </td>
      </template>
      <Column
        :exportable="false"
        style="min-width: 16%"
        v-if="checkPermission()"
      >
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
    <CreateForm ref="CreateFormRef" @onSuccess="handleSetInitData()" />
  </div>
</template>

<script>
import { useInitTable } from '@/hooks/init-table';
import { ref, onMounted, computed } from 'vue';
import { useInitConfirm } from '@/hooks/use-confirm.js';
import { setToast } from '@/utils/auth';
import TableToolbar from './TableToolbar.vue';
import { FilterMatchMode } from 'primevue/api';
import { useStore } from 'vuex';
import {
  listApi,
  deleteAgentManage,
  getWinLossTotal,
  getCommissionTotal,
} from '@/api/agent/manage.js';
import CreateForm from './CreateForm.vue';
import MainToolbar from './MainToolbar.vue';
import { numberWithCommas } from '@/utils/common';
import { convertToMonth } from '@/utils/common';
export default {
  name: 'TableData',
  components: {
    TableToolbar,
    CreateForm,
    MainToolbar,
  },
  data() {
    return {};
  },
  methods: {
    numberWithCommas,
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
    const store = useStore();

    const CreateFormRef = ref('');
    const userType = computed(() => store.state.auth.userType);

    const columns = [
      { field: 'agency', header: 'Đại lý' },
      { field: 'player_username', header: 'Tài khoản hội viên' },
      { field: 'full_name', header: 'Họ tên' },
      { field: 'phone', header: 'Số điện thoại' },
      { field: 'month', header: 'Tháng' },
      { field: 'logout_days', header: 'Số ngày không đăng  nhập' },
      { field: 'total_money', header: 'Thắng thua trong tháng' },
    ];

    const initFilter = {
      agency: { value: null, matchMode: FilterMatchMode.CONTAINS },
      player_username: { value: null, matchMode: FilterMatchMode.CONTAINS },
      full_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
      month: { value: null, matchMode: FilterMatchMode.CONTAINS },
      logout_days: { value: null, matchMode: FilterMatchMode.CONTAINS },
      total_money: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
    const filters = ref(initFilter);

    const winLostTotal = ref(0);
    const commissionTotal = ref(0);

    onMounted(() => {
      handleSetInitData();
    });

    function handleSetInitData() {
      filters.value = initFilter;
      handleInitData();
      handleGetWinLostTotal();
      handleCommissionTotal();
    }

    function handleInitData() {
      setUrl(listApi.getAgentManageUrl);
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
      deleteAgentManage(params).then(() => {
        handleSetInitData();
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
        player_username: filters.value.player_username.value,
        phone: filters.value.phone.value,
        month: filters.value.month.value
          ? convertToMonth(filters.value.month.value)
          : '',
        logout_days: filters.value.logout_days.value,
        total_money: filters.value.total_money.value,
        full_name: filters.value.full_name.value,
      };
      handleGetWinLostTotal(params);
      handleCommissionTotal(params);
      setParams(params);
      toFilter();
    }

    function handleUpdate(row) {
      CreateFormRef.value.displayModal = true;
      CreateFormRef.value.isAdd = false;
      CreateFormRef.value.setFormValues(row);
    }

    function handleSetFilter(value) {
      const arrFilters = ['agency', 'player_username', 'phone', 'month'];
      return arrFilters.includes(value);
    }

    async function handleGetWinLostTotal(value) {
      const params = handleSetGetTotalValue(value);

      let res = await getWinLossTotal(params);
      if (res.data) {
        winLostTotal.value = res.data;
      } else {
        winLostTotal.value = 0;
      }
    }

    async function handleCommissionTotal(value) {
      const params = handleSetGetTotalValue(value);

      let res = await getCommissionTotal(params);
      if (res.data) {
        commissionTotal.value = res.data;
      } else {
        commissionTotal.value = 0;
      }
    }

    function handleSetGetTotalValue(value) {
      let params = {};
      if (value) {
        if (value.agency) {
          params.agency = value.agency;
        }
        if (value.month) {
          params.month = value.month;
        }
        if (value.player_username) {
          params.player_username = value.player_username;
        }
        if (value.phone) {
          params.phone = value.phone;
        }
        if (value.total_money) {
          params.total_money = value.total_money;
        }
        if (value.logout_days) {
          params.logout_days = value.logout_days;
        }
        if (value.full_name) {
          params.full_name = value.full_name;
        }
      }
      return params;
    }

    function calculateCustomerTotal() {
      return numberWithCommas(
        data.value.reduce((total, curr) => {
          return (total += parseInt(curr.total_money));
        }, 0)
      );
    }

    function checkPermission() {
      return userType.value === 2 || userType.value === 99; //nhan vien
    }
    function handleFilterData(value) {
      filters.value = initFilter;
      handleGetWinLostTotal();
      handleCommissionTotal();
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
      handleSetFilter,
      winLostTotal,
      handleGetWinLostTotal,
      calculateCustomerTotal,
      checkPermission,
      userType,
      handleCommissionTotal,
      commissionTotal,
      handleFilterData,
      reRender,
      handleGetExportData,
      handleSetGetTotalValue,
      handleSetInitData,
    };
  },
};
</script>

<style lang="scss" scoped></style>
