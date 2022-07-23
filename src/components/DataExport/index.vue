<!--
 * @Description:数据导出组件
 * @Author: John
 * @Date: 2020-03-16 11:50:22
 * @LastEditTime: 2022-06-23 00:45:35
 * @LastEditors: Ian
 -->
<template>
  <div class="data-export">
    <Button
      label="Export"
      icon="pi pi-upload"
      class="p-button-help"
      @click="exportHandle"
    />
  </div>
</template>

<script>
import { handleExport } from './export_utils';

export default {
  name: 'DataExport',
  components: {},
  props: {
    datas: {
      type: Function,
      default() {
        return null;
      },
    },
    header: {
      type: Array,
      default() {
        return [];
      },
    },
    filterVal: {
      type: Array,
      default() {
        return [];
      },
    },
    fileTypes: {
      type: Array,
      default() {
        return ['xlsx'];
      },
    },
    mode: {
      type: String,
      default: 'default', // default: show full component; only-button: only show export button, file name default
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    exportBtnText: {
      type: String,
      default: null,
    },
    initialFileName: {
      type: String,
      default: null,
    },
    multiHeader: {
      type: Array,
      default() {
        return null;
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    exportHandle() {
      try {
        const execResult = this.datas();
        if (!execResult) {
          return;
        }

        const isPromise = execResult instanceof Promise;
        const isAsync = this.datas.constructor.name === 'AsyncFunction';
        this.fullscreenLoading = true;
        if (isAsync || isPromise) {
          execResult
            .then((data) => {
              handleExport(
                data,
                this.header,
                this.filterVal,
                this.file_name,
                this.multiHeader
              );
              this.fullscreenLoading = false;
            })
            .catch((err) => {
              console.log(err);
              this.fullscreenLoading = false;
            });
        } else {
          handleExport(
            execResult,
            this.header,
            this.filterVal,
            this.file_name,
            this.multiHeader
          );
          this.fullscreenLoading = false;
        }
      } catch (err) {
        this.fullscreenLoading = false;
        console.log('err', err);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
