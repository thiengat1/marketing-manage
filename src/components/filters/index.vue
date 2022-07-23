<!--
 * @Description: filter
 * @Author: code pro
 * @Date: 2022-06-14 10:45:58
 * @LastEditTime: 2022-06-25 23:11:24
 * @LastEditors: Ian
-->
<template>
  <div>
    <Button
      type="button"
      icon="pi pi-filter-slash"
      label="Clear"
      class="p-button-outlined ml-2"
      @click="clearFilter()"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Filter',
  props: ['modelValue'],
  setup(props, context) {
    const filter = ref(null);

    function clearFilter() {
      context.emit('update:modelValue', { value: null });
    }

    return {
      filter,
      clearFilter,
    };
  },
});
</script>

<style lang="scss" scoped></style>
