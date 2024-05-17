<script setup>
import {  format } from "date-fns";

import {listVehicle} from "@/api/rent/vehicle.js";

import VehicleForm from "@/views/rent/vehicle/components/form.vue"

const queryRef=ref(null);

const formRef = ref(null)

// 列表数据
const tableData = ref([])
// 数据总量
const total = ref(0);
// 购置时间，查询条件
const purchaseTime = ref([]);
// 条件查询
const queryParams = reactive({
  brandId: '',
  modelId: '',
  plateNumber: '',
  startTime: '',
  endTime: '',
  pageNum: 1,
  pageSize: 10,
})
// 车辆状态
const vehicleStatusMap = {
  0: {
    "name": "闲置",
    "type": "info"
  },
  1: {
    "name": "出租",
    "type": "success"
  },
  2: {
    "name": "维修",
    "type": "warning"
  },
  3: {
    "name": "保养",
    "type": ""
  },
  4: {
    "name": "停用",
    "type": "danger"
  }
}

// 获取列表数据
function getVehicleList(query) {
  listVehicle(query).then(res => {
    if (res.code === 200) {
      tableData.value = res.rows;
      total.value = res.total
    }
  })
}

// 提交条件查询
function handleQuery () {
  console.log(queryParams)
  getVehicleList(queryParams);
}
// 重置查询条件
function clearQueryParams() {
  queryRef.value?.resetFields();
  purchaseTime.value = [];
}

// 分页 --- 单页数据量变化
function handleSizeChange() {
  getVehicleList(queryParams);
}

// 分页 --- 页码跳转
function handleCurrentChange() {
  getVehicleList(queryParams);
}

// 新增车辆信息
function addVehicle() {
  formRef.value?.show('新增车辆信息', {})
}

// 刷新组件
function refreshParent() {
  getVehicleList();
}

// 初始化数据
onMounted(() => {
  getVehicleList();
})

// 监听购置日期属性
watch(() => purchaseTime.value, (val) => {
  if (val && val.length > 0) {
    const [start, end] = val
    queryParams.startTime = format(start, 'yyyy-MM-dd');
    queryParams.endTime = format(end, 'yyyy-MM-dd');
    console.log(queryParams.startTime)
  }else {
    queryParams.startTime = '';
    queryParams.endTime = '';
  }
})

</script>

<template>
  <div class="container">
    <!-- 条件查询 -->
    <el-form ref="queryRef" :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="车辆品牌" prop="brandId">
        <el-select
            v-model="queryParams.brandId"
            placeholder="车辆品牌"
            clearable>
        </el-select>
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNumber">
        <el-input v-model="queryParams.plateNumber" placeholder="车牌号" clearable></el-input>
      </el-form-item>
      <el-form-item label="购置日期" prop="purchaseTime">
        <div class="demo-date-picker">
          <el-date-picker
              v-model="purchaseTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"/>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
        <el-button icon="Refresh" @click="clearQueryParams">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-space class="options" :size="15">
      <el-button type="primary" plain icon="Plus" @click="addVehicle">新增</el-button>
      <el-button type="success" plain icon="Edit">修改</el-button>
      <el-button type="warning" plain icon="Download">导出</el-button>
      <el-button type="danger" plain icon="Delete">删除</el-button>
    </el-space>

    <!-- 列表数据 -->
    <el-table v-model:data="tableData" style="width: 100%">
      <el-table-column type="selection" width="35" align="center"/>
      <el-table-column label="序号" type="index" width="60" align="center"/>
      <el-table-column prop="plateNumber" label="车牌号" align="center"/>
      <el-table-column prop="brandName" label="品牌" align="center"/>
      <el-table-column prop="modelName" label="型号" align="center"/>
      <el-table-column prop="color" label="颜色" align="center"/>
      <el-table-column prop="purchaseTime" label="购置日期" align="center"/>
      <el-table-column prop="price" label="租赁价格" align="center"/>
      <el-table-column prop="vehicleStatus" label="车辆状态" align="center">
        <template #default="scope">
          <el-tag :type="vehicleStatusMap[scope.row.vehicleStatus].type">
            {{ vehicleStatusMap[scope.row.vehicleStatus].name }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!--  分页  -->
    <div class="demo-pagination-block">
      <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :background="true"
          layout="->, total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增、修改组件 -->
    <VehicleForm ref="formRef" @refreshParent="refreshParent"/>
  </div>

</template>

<style scoped lang="scss">
.container {
  margin: 22px;
}

.options {
  margin-top: 5px;
  margin-bottom: 12px;
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}


.demo-pagination-block {
  margin-top: 50px;
}
</style>