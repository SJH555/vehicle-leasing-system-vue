<script setup>
import {listVehicleType, delVehicleType} from "@/api/rent/vehicle-type.js";
import VehicleTypeForm from "@/views/rent/vehicle-type/components/form.vue"
import {ElMessage, ElMessageBox} from "element-plus";

const queryParams = reactive({
  name: "",
})
// 类型分类
const typeMap = reactive({
  0: "品牌",
  1: "型号",
  2: "颜色"
})
const tableData = ref([])

const queryFormRef = ref(null);
const formRef = ref(null);

// 条件查询
function handleQuery() {
  getVehicleTypeList();
}

// 重置查询条件
function clearQueryParams() {
  queryFormRef?.value.resetFields();
}

// 新增
function addVehicleType(row, config) {
  formRef?.value.show("新增车辆配置信息", row, config);
}
// 修改
function updateVehicleType(row) {
  formRef?.value.show("修改车辆信息", row, null);
}
// 删除
function deleteVehicleType(row) {
  // 提示
  ElMessageBox.confirm(`是否确认删除名称为"${row.name}"的配置项`, "系统提示", {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: "warning"
  }).then(() => {
    delVehicleType(row.id).then(res => {
      if (res.code === 200) {
        ElMessage({
          type: "warning",
          message: "删除成功"
        })
      }
      // 刷新页面
      getVehicleTypeList();
    })
  }).catch(() => {
    ElMessage({
      type: "info",
      message: "取消删除操作"
    })
  })
}

// 获取类型信息
function getVehicleTypeList() {
  listVehicleType(queryParams).then(res => {
    if (res.code === 200) {
      tableData.value = res.rows;
    }
  })
}

// 刷新信息
function refreshData() {
  getVehicleTypeList();
}

onMounted(() => {
  getVehicleTypeList();
})
</script>

<template>
  <div class="container">
    <!-- 条件查询 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" ref="queryFormRef">
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="名称" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" icon="Search">查询</el-button>
        <el-button @click="clearQueryParams" icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" plain icon="Plus" class="options" @click="addVehicleType(null)">新增</el-button>

    <!-- 列表数据 -->
    <el-table :data="tableData"
              style="width: 100%"
              :header-cell-style="{'text-align':'center'}"
              row-key="id"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" width="160px" align="left"/>
      <el-table-column prop="type" label="类型" align="center">
        <template #default="scope">
          {{ typeMap[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" align="center"/>
      <el-table-column prop="remark" label="备注" align="center"/>
      <el-table-column label="操作" width="350px" align="center">
        <template #default="scope">
          <el-space :size="-4">
            <el-button v-if="scope.row.type !== 2" type="primary" icon="Plus" text @click="addVehicleType(null, scope.row)">新增</el-button>
            <el-button plain icon="Edit" text @click="updateVehicleType(scope.row)">修改</el-button>
            <el-button type="danger" plain icon="Delete" @click="deleteVehicleType(scope.row)" text>删除</el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增、修改表单 -->
    <VehicleTypeForm ref="formRef" @refreshParent="refreshData"></VehicleTypeForm>
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
  margin-right: 30px;
}
</style>