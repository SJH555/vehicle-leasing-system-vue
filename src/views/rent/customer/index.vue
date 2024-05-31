<script setup>
import {ArrowDown, ArrowUp} from "@element-plus/icons-vue";
import {listCustomer, deleteCustomer} from "@/api/rent/customer.js"
import CustomerForm from "@/views/rent/customer/components/form.vue"
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";

let router = useRouter();

// 查询表单相关
const queryParams = reactive({
  name: '',
  phone: '',
  idCard: '',
  rentalStatus: null,
  banStatus: null,
  pageNum: 1,
  pageSize: 10,
})
const queryRef = ref(null);
const rentalStatus = [
  {
    label: "否",
    value: 0
  },
  {
    label: "是",
    value: 1
  },
]
const banStatus = [
  {
    label: "否",
    value: 0
  },
  {
    label: "是",
    value: 1
  },
]
const displayAllQueryCondition = ref(false)

// 按钮状态
const atLeastOne = ref(true);
const atMostOne = ref(true);
// 选中数据
const ids = ref([]);

// 页面信息相关
const tableData = ref([]);
const total = ref(100);

const formRef = ref(null);

function getCustomerList() {
  listCustomer(queryParams).then(res => {
    if(res.code === 200) {
      tableData.value = res.rows;
      total.value = res.total;
    }
  })
}

function handleQuery() {
  getCustomerList();
}

function clearQueryParams() {
  queryRef?.value.resetFields();
  console.log(queryParams)
}

function addOption() {
  formRef?.value.show("新增客户信息");
}

function editOption() {
  formRef?.value.show("修改客户信息", ids.value.at(0))
}

function deleteOption() {
  // 确认
  ElMessageBox.confirm(
      "是否要删除选中的客户信息",
      "系统提示",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }
  ).then(() => {
    deleteCustomer(ids.value).then(res => {
      if(res.code === 200) {
        ElMessage({
          message: "成功删除客户信息",
          type: "warning"
        })
        getCustomerList();
      }
    })
  }).catch(() => {
    ElMessage({
      message: "取消删除操作",
      type: "info"
    })
  })
}

function customerDetail(row) {
  formRef?.value.detail("客户信息详情", row.id)
}

function lease(row) {
  router.replace({
    path: "/lease/order",
    state: {id: row.id}
  })
}

function selectionChange(selection) {
  atMostOne.value = selection.length !== 1;
  atLeastOne.value = selection.length < 1;
  ids.value = selection.map(item => item.id)
}

function handlePaginationChange() {
  getCustomerList();
}

function refreshParent() {
  getCustomerList();
}

onMounted(() => {
  getCustomerList();
})
</script>

<template>
  <div class="container">
    <!-- 表单查询 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" label-width="auto" ref="queryRef">
      <el-row :gutter="48">
        <el-col :span="5">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="queryParams.name" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="queryParams.phone" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="queryParams.idCard" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-show="displayAllQueryCondition">
          <el-form-item label="正在租车" prop="rentalStatus">
            <el-select
                v-model="queryParams.rentalStatus">
              <el-option
                  v-for="item in rentalStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" v-show="displayAllQueryCondition">
          <el-form-item label="禁止租车" prop="banStatus">
            <el-select
                v-model="queryParams.banStatus">
              <el-option
                  v-for="item in banStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-button type="primary" @click="handleQuery" icon="search">查询</el-button>
            <el-button icon="refresh" @click="clearQueryParams">重置</el-button>
            <el-button type="primary" link @click="displayAllQueryCondition = !displayAllQueryCondition">
              {{ displayAllQueryCondition ? '收起' : '展开' }}
              <el-icon v-if="displayAllQueryCondition"><ArrowUp /></el-icon>
              <el-icon v-else><ArrowDown /></el-icon>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--  操作  -->
    <el-space :size="15" class="option">
      <el-button type="primary" plain icon="Plus" @click="addOption">新增</el-button>
      <el-button type="success" plain icon="Edit" @click="editOption" :disabled="atMostOne">修改</el-button>
      <el-button type="warning" plain icon="Download">导出</el-button>
      <el-button type="danger" plain icon="Delete" @click="deleteOption" :disabled="atLeastOne">删除</el-button>
    </el-space>

    <!-- 列表数据  -->
    <el-table :data="tableData" @selection-change="selectionChange" style="width: 100%">
      <el-table-column type="selection" width="55px" align="center"/>
      <el-table-column type="index" label="序号" width="55px" align="center"/>
      <el-table-column prop="name" label="姓名"  align="center"/>
      <el-table-column prop="age" label="年龄" align="center"/>
      <el-table-column prop="phone" label="联系电话" align="center"/>
      <el-table-column prop="idCard" label="身份证号" align="center"/>
      <el-table-column prop="driverLicenseId" label="驾驶证档案号" align="center"/>
      <el-table-column prop="rentalStatus" label="正在租车" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.rentalStatus == 0">否</el-tag>
          <el-tag type="info" v-else>是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="banStatus" label="禁止租车" align="center">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.banStatus == 0">否</el-tag>
          <el-tag type="info" v-else>是</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button text type="primary" @click="customerDetail(scope.row)">详情</el-button>
          <el-button text type="primary" @click="lease(scope.row)">租车</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页  -->
    <div class="pagination">
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
    <CustomerForm ref="formRef" @refreshParent="refreshParent"/>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 22px;
}

.demo-form-inline .el-input {
  --el-input-width: 240px;
}

.option {
  margin-top: 5px;
  margin-bottom: 12px;
}

.pagination {
  margin-top: 50px;
  margin-right: 5px;
}
</style>