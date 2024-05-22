<script setup name="DeviceForm">
import {addDevice, infoDevice} from "@/api/rent/device.js"
import {ElMessage} from "element-plus";

const _visible = ref(false);
const _title = ref("");

const formData = ref({
  deviceNum: "",
  deviceTypeName: "",
  vendorName: "",
  remark: ""
})
const rules = ref({
  deviceNum: [{required: true, message: "设备号必须填写", trigger: "blur"}, {pattern: "^[a-zA-Z0-9]+$", message: "只能由数字和字母组成", trigger: "blur"}]
})
const formRef = ref(null);

function resetInfo() {
  formRef?.value.resetFields();
}

function getVehicleInfo(payload) {
  infoDevice(payload.at(0)).then(res => {
    if (res.code === 200) {
      formData.value = res.data;
    }
  })
}

function show(title, payload) {
  _title.value = title;
  _visible.value = true;
  nextTick(() => {
    resetInfo();
    if (payload?.length > 0) {
      getVehicleInfo(payload);
    }
  })
}
function hide() {
  _visible.value = false;
}

// 提交表单
function submitForm() {
  formRef?.value.validate(valid => {
    if (valid) {
      addDevice(formData.value).then(res => {
        if (res.code === 200) {
          ElMessage({
            message: "成功添加设备信息",
            type: "success"
          })
          hide();
          emit("refreshParent")
        }
      })
    }
  })
}

defineExpose({show, hide})
const emit = defineEmits(["refreshParent"])
</script>

<template>
  <el-dialog
      v-model="_visible"
      :title="_title"
      width="800">
    <el-form :model="formData" :rules="rules" label-width="auto" ref="formRef">
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="设备号" prop="deviceNum">
            <el-input v-model="formData.deviceNum" :maxlength="32"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备类型" prop="deviceTypeName">
            <el-input v-model="formData.deviceTypeName" :maxlength="32" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item label="厂家名称" prop="vendorName">
            <el-input v-model="formData.vendorName" :maxlength="32"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" :rows="5" :maxlength="10000"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="hide">取消</el-button>
        <el-button type="primary" @click="submitForm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>