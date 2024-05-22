<script setup name="Device">
import {listDevice} from "@/api/rent/device.js"

const visible = ref(false);

const tableData = ref([]);

function show() {
  visible.value = true;
  listDevice().then(res => {
    if (res.code === 200) {
      tableData.value = res.rows;
    }
  })
}

function hide() {
  visible.value = false;
}

function selectDevice(row) {
  hide();
  emit("receiveDeviceValue", row);
}

const emit = defineEmits(["receiveDeviceValue"]);

defineExpose({show, hide})
</script>

<template>
  <el-drawer
      v-model="visible"
      title="选择设备"
      direction="rtl"
      size="40%">
    <el-table :data="tableData">
      <el-table-column property="deviceNum" label="设备号" width="150" align="center"/>
      <el-table-column property="deviceTypeName" label="设备名称" width="150" align="center"/>
      <el-table-column property="vendorName" label="厂家名称" width="200" align="center"/>
      <el-table-column label="操作"  align="center">
        <template #default="scope">
          <el-button plain type="primary" @click="selectDevice(scope.row)">选择</el-button>
        </template>

      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<style scoped lang="scss">

</style>