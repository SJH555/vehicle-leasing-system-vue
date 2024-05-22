<script setup>
import DeviceForm from "@/views/rent/device/form.vue"
import {listDevice, deleteDevice} from "@/api/rent/device.js"
import {ElMessage, ElMessageBox} from "element-plus";

const {proxy} = getCurrentInstance();

const queryParams = reactive({
  deviceNum: '',
  deviceTypeName: '',
  vendorName: '',
  pageNum: 1,
  pageSize:  10,
})
const queryRef = ref(null);

const tableData = ref([])
const total = ref(0);
const ids = ref([]);
const atMostOne = ref(true);
const atLeastOne = ref(true);

const formRef = ref(null);

// 获取设备信息
function getDeviceList() {
  listDevice(queryParams).then(res => {
    if (res.code === 200) {
      tableData.value = res.rows;
      total.value = res.total;
    }
  })
}

// 条件查询
function handelQuery() {
  getDeviceList();
}
// 重置条件
function clearQuery() {
  queryRef?.value.resetFields();
}

// 选中数据
function selectionChange(selection) {
  atMostOne.value = selection.length !== 1;
  atLeastOne.value = selection.length < 1;
  ids.value = selection.map(item => item.id)
}

// 分页查询
function handlePaginationChange() {
  getDeviceList();
}

// 添加操作
function addOption() {
  formRef?.value.show("添加设备信息", null);
}
// 修改操作
function editOption() {
  formRef?.value.show("修改设备信息", ids.value)
}
// 导出操作
function exportOption() {
  proxy.download("rent/device/export", {
    queryParams,
  }, `device_${new Date().getTime()}.xlsx`);
}
// 删除操作
function deleteOption() {
  // 提示
  ElMessageBox.confirm(
      "是否要删除选中的设备信息",
      "系统提示",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }
  ).then(() => {
    deleteDevice(ids.value).then(res => {
      if (res.code === 200) {
        ElMessage({
          message: "成功删除设备信息",
          type: "warning"
        })
        getDeviceList();
      }
    })
  }).catch(() => {
    ElMessage({
      message: "取消删除操作",
      type: "info"
    })
  })
}

onMounted(() => {
  getDeviceList();
})
</script>

<template>
  <div class="container">
    <!-- 内联表单查询 -->
    <el-form :model="queryParams" class="demo-form-inline" ref="queryRef">
      <el-row :gutter="12">
        <el-col :span="4">
          <el-form-item label="设备号" prop="deviceNum">
            <el-input v-model="queryParams.deviceNum" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="设备类型" prop="deviceTypeName">
            <el-input v-model="queryParams.deviceTypeName" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="厂家名称" prop="vendorName">
            <el-input v-model="queryParams.vendorName" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="handelQuery" icon="search">查询</el-button>
            <el-button @click="clearQuery" icon="refresh">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 操作 -->
    <el-space :size="15" class="option">
      <el-button type="primary" plain icon="plus" @click="addOption">新增</el-button>
      <el-button type="success" plain icon="edit" @click="editOption" :disabled="atMostOne">修改</el-button>
      <el-button type="warning" plain icon="download" @click="exportOption">导出</el-button>
      <el-button type="danger" plain icon="delete" @click="deleteOption" :disabled="atLeastOne">删除</el-button>
    </el-space>
    <!-- 表格数据 -->
    <el-table :data="tableData" style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column prop="deviceNum" label="设备号" align="center"/>
      <el-table-column prop="deviceTypeName" label="设备类型" align="center"/>
      <el-table-column prop="vendorName" label="厂家名称" align="center"/>
      <el-table-column prop="remark" label="备注" align="center"/>
    </el-table>
    <!-- 分页 -->
    <div class="demo-pagination-block">
      <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="->, total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handlePaginationChange"
          @current-change="handlePaginationChange"/>
    </div>

    <!--  编辑表单  -->
    <DeviceForm ref="formRef" @refreshParent="getDeviceList"></DeviceForm>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 22px;
}

.option {
  margin-top: 5px;
  margin-bottom: 12px;
}

.demo-pagination-block {
  margin-top: 50px;
  margin-right: 5px;
}

</style>