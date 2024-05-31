<script setup name="Lease">
import LeaseForm from "@/views/rent/lease/components/form.vue"
import {listLease} from "@/api/rent/lease.js"

const queryRef = ref(null);
const formRef = ref(null);

const queryParams = reactive({
  customerName: '',
  plateNum: '',
  startTime: '',
  endTime: '',
  pageNum: 1,
  pageSize: 10,
})
// 租赁日期
const leaseTime = ref([])

const tableData = ref([])
const total = ref(0)


function getLeastList() {
  listLease(queryParams).then(res => {
    if (res.code === 200) {
      tableData.value = res.rows;
      total.value = res.total;
    }
  })
}

function submitForm() {
  getLeastList();
}

function clearQueryParams() {
  queryRef?.value.resetFields();
  leaseTime.value = []
}

function addOption() {
  formRef?.value.manipulate("新增订单信息")
}

watch(() => leaseTime.value, () => {
  if (leaseTime.value) {
    const [startTime, endTime] = leaseTime.value;
    queryParams.startTime = startTime;
    queryParams.endTime = endTime;
  }else  {
    queryParams.startTime = '';
    queryParams.endTime = '';
  }

})

onMounted(() => {
  getLeastList();
  console.log("rrrrrrr")
  console.log(history.state)
  if(history.state.id){
    formRef?.value.manipulate("新增订单信息");
  }
  history.state.id = null;
})
</script>

<template>
  <div class="container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" ref="queryRef">
      <el-form-item label="租车人姓名" prop="customerName">
        <el-input v-model="queryParams.customerName" clearable/>
      </el-form-item>
      <el-form-item label="车牌号" prop="plateNum">
        <el-input v-model="queryParams.plateNum" clearable/>
      </el-form-item>
      <el-form-item label="租车时间" prop="leaseTime">
        <el-date-picker
            clearable
            v-model="leaseTime"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" icon="search">查询</el-button>
        <el-button  @click="clearQueryParams" icon="refresh">重置</el-button>
      </el-form-item>
    </el-form>

    <el-space class="options" :size="15">
      <el-button type="primary" plain icon="plus" @click="addOption">新增</el-button>
      <el-button type="success" plain icon="edit">修改</el-button>
      <el-button type="warning" plain icon="download">导出</el-button>
      <el-button type="danger" plain icon="delete">删除</el-button>
    </el-space>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="selection" width="60" align="center"/>
      <el-table-column type="index" label="序号" width="60" align="center"/>
      <el-table-column prop="customerName" label="客户姓名" align="center"/>
      <el-table-column prop="plateNum" label="车牌号" align="center"/>
      <el-table-column prop="operatorName" label="负责人" align="center"/>
      <el-table-column prop="startTime" label="开始时间" align="center"/>
      <el-table-column prop="endTime" label="结束时间" align="center"/>
      <el-table-column prop="leaseStatus" label="订单状态" align="center"/>
      <el-table-column prop="balance" label="结算金额" align="center"/>
      <el-table-column label="操作" align="center">
        <el-button type="primary" text>详情</el-button>
      </el-table-column>
    </el-table>

    <div class="demo-pagination-block">
      <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="->, total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getLeastList"
          @current-change="getLeastList"/>
    </div>

    <LeaseForm ref="formRef"/>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 20px;
}

.demo-pagination-block {
  margin-top: 20px;
  margin-right: 5px;
}

.demo-form-inline .el-input {
  --el-input-width: 240px;
}

.options {
  margin-top: 5px;
  margin-bottom: 10px;
}

</style>