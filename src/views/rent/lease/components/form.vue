<script setup name="LeaseForm">

const _visible = ref(false);
const _title = ref("");
const disabled = ref(true);

const formData = ref({
  customerId: "",
  customerImg: "",
  customerName: "",
  customerAge: "",
  customerPhone: "",
  customerIdCard: "",
  vehicleId: "",
  vehicleImg: "",
  plateNumber: "",
  purchaseTime: "",
  price: "",
  leaseStatus: "",
  balance: ""
})

const leaseTime = ref([]);
const leaseStatusOptions = ref([]);

function manipulate(title, payload) {
  _visible.value = true;
  _title.value = title;
}

function detail() {

}

function hide() {
  _visible.value = false;
}

defineExpose({manipulate, detail, hide})
</script>

<template>
  <el-dialog
      v-model="_visible"
      :title="_title"
      width="800">
    <el-form :model="formData" label-width="auto" style="max-width: 800px">
      <div class="customer-info">
        <div class="avatar">
          <el-form-item>
            <el-avatar :size="80" :src="formData.customerImg"/>
          </el-form-item>
          <el-button type="primary" round :size="'small'" icon="search">选择</el-button>
        </div>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="客户姓名">
              <el-input v-model="formData.customerName" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户年龄">
              <el-input v-model="formData.customerAge" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户手机号">
              <el-input v-model="formData.customerPhone" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户身份证号">
              <el-input v-model="formData.customerIdCard" :disabled="disabled"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-divider border-style="dashed"/>
      <div class="vehicle-info">
        <div class="avatar">
          <el-form-item>
            <el-avatar :size="80" :src="formData.vehicleImg" />
          </el-form-item>
          <el-button type="primary" round :size="'small'" icon="search">选择</el-button>
        </div>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="车牌号">
              <el-input v-model="formData.plateNumber" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="购置日期">
              <el-input v-model="formData.purchaseTime" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租赁价格">
              <el-input v-model="formData.price" :disabled="disabled"/>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-divider border-style="dashed"/>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="租赁日期">
            <el-date-picker
                v-model="leaseTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单状态">
            <el-select
                v-model="formData.leaseStatus"
                placeholder="Select">
              <el-option
                  v-for="item in leaseStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结算价格">
            <el-input v-model="formData.balance"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="hide">取消</el-button>
        <el-button type="primary" @click="hide">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.customer-info {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.customer-info .avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.vehicle-info {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.vehicle-info .avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>