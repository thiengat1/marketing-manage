/*
 * @Description: init table
 * @Author: code pro
 * @Date: 2022-06-10 15:51:26
 * @LastEditTime: 2022-06-25 23:12:00
 * @LastEditors: code pro
 */
import { ref, computed, watch } from 'vue';
import { initData } from '@/api/data';
import { useStore } from 'vuex';

export function useInitTable() {
  const loading = ref(false);
  const data = ref([]);
  const columns = ref([]);
  const totalRecords = ref(0);
  const rows = ref(10);
  const paginatorTemplate = ref(
    'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown JumpToPageInput'
  );
  const rowsPerPageOptions = ref([10, 20, 50, 100]);
  const responsiveLayout = ref('stack');
  const currentPageReportTemplate = ref('Page {currentPage} of {totalPages}');
  const params = ref({});
  const limit = ref(10);
  const page = ref(1);
  const url = ref('');
  const breakPoint = ref('960px');

  const store = useStore();
  const reRender = ref(true);
  const scrollHeight = computed(() => store.state.settings.scrollHeight);

  watch(scrollHeight, () => {
    handleCheckReRender();
  });

  function handleCheckReRender() {
    reRender.value = false;
    setTimeout(() => {
      reRender.value = true;
    }, 50);
  }

  //get data
  function init() {
    return new Promise((resolve, reject) => {
      if (!setParams()) {
        return;
      }
      const finalParams = {
        page: page.value,
        limit: limit.value,
        ...params.value,
      };
      initData(url.value, finalParams)
        .then((res) => {
          if (res.data) {
            if (res.data.data) {
              // pagination
              totalRecords.value = res.data.total;
              data.value = res.data.data;
            } else {
              // not pagination
              data.value = res.data;
            }
            resolve(res);
          } else {
            resolve({});
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  //export function
  async function initExportData(page, limit) {
    if (!setParams()) {
      return;
    }
    const exportParams = {
      page: page,
      limit: limit,
      ...params.value,
    };
    return new Promise((resolve, reject) => {
      initData(url.value, exportParams)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
  //export data
  async function handleGetExportData() {
    let dataExport = [];
    let lastPage = Math.ceil(totalRecords.value / 500);
    let maxLimit = 500;
    if (totalRecords.value < 500) {
      maxLimit = totalRecords.value;
    }
    if (totalRecords.value === 0) {
      lastPage = 1;
    }
    for (let i = 1; i <= lastPage; i++) {
      await initExportData(i, maxLimit).then((res) => {
        if (res.data) {
          if (res.data.data) {
            dataExport = dataExport.concat(res.data.data);
          } else {
            dataExport = dataExport.concat(res.data);
          }
        }
      });
    }
    return dataExport;
  }
  //search
  function toFilter() {
    page.value = 1;
    init();
  }
  //page change
  function pageChange(e) {
    page.value = e.page + 1;
    limit.value = e.rows;
    init();
  }

  //set url
  function setUrl(value) {
    url.value = value;
  }
  //set params
  function setParams(data) {
    if (data) {
      params.value = data;
    }

    return true;
  }

  //get header
  async function getTableHeaders(callback) {
    let headers = [];
    let data = await callback();
    for (let key in data) {
      if (key === 'id') continue;
      headers.value.push({ id: key.id, field: key.name, header: key.header });
    }
    return headers;
  }

  return {
    loading,
    data,
    totalRecords,
    columns,
    rows,
    paginatorTemplate,
    rowsPerPageOptions,
    responsiveLayout,
    currentPageReportTemplate,
    params,
    limit,
    page,
    url,
    getTableHeaders,
    init,
    pageChange,
    setUrl,
    setParams,
    toFilter,
    breakPoint,
    reRender,
    scrollHeight,
    handleCheckReRender,
    handleGetExportData,
    initExportData,
  };
}
