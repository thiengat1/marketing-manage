<template>
  <div class="card">
    <DataTable
      :value="finalData"
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
        field="username"
        header="Tài khoản"
        style="width: 25%"
        :showFilterMatchModes="false"
      >
        <template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Tài khoản"
          />
        </template>
      </Column>
      <Column
        field="name"
        header="Tên người dùng"
        style="width: 25%"
        :showFilterMatchModes="false"
      >
        <template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Tên"
          />
        </template>
      </Column>
      <Column
        field="pid_username"
        header="Cấp trên"
        style="width: 25%"
        :showFilterMatchModes="false"
      >
        <template #filter="{ filterModel }">
          <InputText
            type="text"
            v-model="filterModel.value"
            class="p-column-filter"
            placeholder="Cấp trên "
          />
        </template>
        <template #body="{ data }">
          <span>{{ `[${data['pid_name']}] ${data['pid_username']}` }}</span>
        </template>
      </Column>
      <Column
        field="types"
        header="Loại tài khoản"
        style="width: 25%"
        :showFilterMatchModes="false"
      >
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            :options="userRolesNotAdminEnums"
            optionLabel="name"
            optionValue="id"
            placeholder="Loại tài khoản"
          />
        </template>
      </Column>

      <Column :exportable="false" style="min-width: 25%">
        <template #body="slotProps">
          <div class="flex flex-direction-row">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-primary mr-2"
              @click="handleUpdateAccountType(slotProps.data)"
              v-tooltip.top="'Sửa'"
            />
            <Button
              icon="pi pi-lock"
              class="p-button-rounded p-button-primary mr-2"
              @click="handleUpdatePassword(slotProps.data)"
              v-tooltip.top="'Thay đổi mật khẩu'"
            />
            <Button
              icon="pi pi-refresh"
              class="p-button-rounded p-button-primary mr-2"
              @click="handleResetPassword(slotProps.data)"
              v-tooltip.top="'Reset mật khẩu'"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger"
              @click="handleDelete(slotProps.data)"
              v-tooltip.top="'Xoá'"
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
    <UpdatePassword ref="UpdatePasswordRef" @onSuccess="init()" />
    <UpdateAccountType ref="UpdateAccountTypeRef" @onSuccess="init()" />
  </div>
</template>

<script>
import { useInitTable } from '@/hooks/init-table';
import { ref, onMounted, computed } from 'vue';
import { useInitConfirm } from '@/hooks/use-confirm.js';
import { setToast } from '@/utils/auth';
import TableToolbar from './TableToolbar.vue';
import { FilterMatchMode } from 'primevue/api';
import { listApi, deleteUser, resetPassword } from '@/api/user/manage';
import { userRolesEnums, userRolesNotAdminEnums } from '@/enums/common.js';
import UpdatePassword from './UpdatePassword.vue';
import UpdateAccountType from './UpdateAccountType.vue';
export default {
  name: 'TableData',
  components: {
    TableToolbar,
    UpdatePassword,
    UpdateAccountType,
  },
  data() {
    return {
      userRolesEnums,
      userRolesNotAdminEnums,
    };
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

    const UpdatePasswordRef = ref('');
    const UpdateAccountTypeRef = ref('');

    const columns = [
      { field: 'username', header: 'Tài khoản' },
      { field: 'name', header: 'Tên' },
      { field: 'types', header: 'Kiểu người dùng' },
      { field: 'pid', header: 'Cấp trên' },
    ];

    const filters = ref({
      username: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
      types: { value: null, matchMode: FilterMatchMode.CONTAINS },
      pid_username: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const finalData = computed(() => {
      return data.value.map((item) => {
        let userType = userRolesEnums.find((role) => role.id === item.types);
        item.types = userType.name;
        return item;
      });
    });

    onMounted(() => {
      handleInitData();
    });

    function handleInitData() {
      setUrl(listApi.userAllListUrl);
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
      let params = { username: row.username };
      deleteUser(params).then(() => {
        init();
        setToast({
          type: 'success',
          code: 'Thành công',
          message: 'xoá thành công',
        });
      });
    }

    function handleOnCreateUser() {
      context.emit('onCreate');
    }

    function handleOnFilterWithVariable() {
      const params = {
        username: filters.value.username.value,
        name: filters.value.name.value,
        types: filters.value.types.value,
        pid_username: filters.value.pid_username.value,
      };
      setParams(params);
      toFilter();
    }

    function handleResetPassword(row) {
      confirmProcess({
        header: 'Xác nhận',
        message: 'Bạn chắc chắn muốn reset mật khẩu',
        acceptCb: () => handleDoResetPassword(row),
      });
    }
    function handleDoResetPassword(row) {
      resetPassword({ username: row.username }).then(() => {
        setToast({
          type: 'success',
          code: 'Thành công',
          message: 'Reset mật khẩu thành công',
        });
      });
    }

    function handleUpdatePassword(row) {
      UpdatePasswordRef.value.displayModal = true;
      UpdatePasswordRef.value.username = row.username;
    }

    function handleFilterData(value) {
      filters.value = {
        username: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        types: { value: null, matchMode: FilterMatchMode.CONTAINS },
        pid_username: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
      if (typeof value === 'string') {
        setParams({ value: value });
      } else {
        setParams({ value: '' });
      }
      toFilter();
    }

    function handleUpdateAccountType(row) {
      UpdateAccountTypeRef.value.displayModal = true;
      UpdateAccountTypeRef.value.setFormValues(row);
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
      finalData,
      confirmProcess,
      handleDoDelete,
      handleOnCreateUser,
      filters,
      handleOnFilterWithVariable,
      toFilter,
      scrollHeight,
      breakPoint,
      handleResetPassword,
      handleDoResetPassword,
      UpdatePasswordRef,
      handleUpdatePassword,
      handleFilterData,
      reRender,
      handleGetExportData,
      handleUpdateAccountType,
      UpdateAccountTypeRef,
    };
  },
};
</script>

<style lang="scss" scoped></style>
