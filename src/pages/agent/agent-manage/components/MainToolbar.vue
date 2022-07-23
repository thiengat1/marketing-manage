<!--
 * @Description: main toolbar
 * @Author: code pro
 * @Date: 2022-06-19 01:11:37
 * @LastEditTime: 2022-06-19 20:08:24
 * @LastEditors: code pro
-->
<template>
  <div>
    <Toolbar class="mb-4">
      <template #start>
        <span>
          <span class="font-bold">Tổng hiệu năng tháng này: </span>
          <span class="font-bold text-primary">{{
            numberWithCommas(winLostTotal)
          }}</span>
        </span>
      </template>

      <template #end>
        <span>
          <span class="font-bold">Hoa hồng hiện tại: </span>
          <span class="font-bold text-yellow-500">{{
            numberWithCommas(commissionTotal)
          }}</span>
        </span>
      </template>
    </Toolbar>
  </div>
</template>

<script>
import { numberWithCommas } from "@/utils/common";
export default {
  name: "MainToolbar",
  props: ["winLostTotal", "commissionTotal"],
  methods: {
    numberWithCommas,
  },
};
</script>

<style lang="scss" scoped></style>
