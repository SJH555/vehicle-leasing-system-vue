<script setup>
import {format} from "date-fns";

import {listVehicle, deleteVehicle} from "@/api/rent/vehicle.js";

import VehicleForm from "@/views/rent/vehicle/components/form.vue"
import {ElMessage, ElMessageBox} from "element-plus";
import {listVehicleType} from "@/api/rent/vehicle-type.js";

const {proxy} = getCurrentInstance();

const queryRef = ref(null);
const formRef = ref(null)

// 列表数据
const tableData = ref([])
// 数据总量
const total = ref(0);

// 车辆配置信息
const options = ref([]);

// 购置时间，查询条件
const purchaseTime = ref([]);
// 选中车辆配置, 查询条件
const vehicleConfig = ref([]);
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

// 按钮状态
const atLeastOne = ref(true);
const atMostOne = ref(true);
// 选中数据
const ids = ref([]);

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
function handleQuery() {
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
function addVehicleInfo() {
  formRef.value?.show('新增车辆信息', null)
}

// 修改车辆信息
function editVehicleInfo() {
  formRef?.value.show("修改车辆信息", ids.value.at(0));
}

// 导出车辆信息
function exportVehicleInfo() {
  proxy.download("rent/vehicle/export", {
    queryParams,
  }, `vehicle_${new Date().getTime()}.xlsx`);
}

// 删除车辆信息
function deleteVehicleInfo() {
  ElMessageBox.confirm(
      `是否确认删除选中的数据`,
      '系统提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    deleteVehicle(ids.value).then(res => {
      if (res.code === 200) {
        ElMessage({
          message: "车辆信息删除成功",
          type: "warning"
        })
        // 刷新数据
        getVehicleList();
      }
    })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除操作',
        })
      })

}

// 选中数据
function selectionChange(selection) {
  // 修改按钮状态
  atMostOne.value = selection.length > 1;
  atLeastOne.value = selection.length <= 0;
  // 设置id信息
  ids.value = selection.map(item => item.id)
}

// 刷新组件
function refreshParent() {
  getVehicleList();
}

// 初始化数据
onMounted(() => {
  getVehicleList();
  // 获取车辆配置信息
  listVehicleType().then(res => {
    if (res.code === 200) {
      options.value = res.rows;
    }
  })
})

// 监听属性
watch([() => purchaseTime.value, () => vehicleConfig.value], (newValue) => {
  const [time, config] = newValue;
  // 购置日期
  if (time && time.length > 0) {
    const [start, end] = time
    queryParams.startTime = format(start, 'yyyy-MM-dd');
    queryParams.endTime = format(end, 'yyyy-MM-dd');
  } else {
    queryParams.startTime = '';
    queryParams.endTime = '';
  }
  // 车辆配置
  if (config) {
    const [brandId, modelId, colorId] =  config;
    queryParams.brandId = brandId;
    queryParams.modelId = modelId;
    queryParams.colorId = colorId;
  }else {
    queryParams.brandId = null;
    queryParams.modelId = null;
    queryParams.colorId = null;
  }

})

</script>

<template>
  <div class="container">
    <!-- 条件查询 -->
    <el-form ref="queryRef" :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="车辆品牌" prop="brandId">
        <el-cascader
            v-model="vehicleConfig"
            :options="options"
            clearable
            :props="{label: 'name', value: 'id', checkStrictly: true}">
          <template #default="{node, data}">
            {{data.name}}
          </template>
        </el-cascader>
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
      <el-button type="primary" plain icon="Plus" @click="addVehicleInfo">新增</el-button>
      <el-button type="success" plain icon="Edit" @click="editVehicleInfo" :disabled="atMostOne">修改</el-button>
      <el-button type="warning" plain icon="Download" @click="exportVehicleInfo">导出</el-button>
      <el-button type="danger" plain icon="Delete" @click="deleteVehicleInfo" :disabled="atLeastOne">删除</el-button>
    </el-space>

    <!-- 列表数据 -->
    <el-table v-model:data="tableData" style="width: 100%" @selection-change="selectionChange">
      <el-table-column type="selection" width="35" align="center"/>
      <el-table-column label="序号" type="index" width="60" align="center"/>
      <el-table-column prop="plateNumber" label="车牌号" align="center"/>
      <el-table-column prop="brandName" label="品牌" align="center"/>
      <el-table-column prop="modelName" label="型号" align="center"/>
      <el-table-column prop="colorName" label="颜色" align="center"/>
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