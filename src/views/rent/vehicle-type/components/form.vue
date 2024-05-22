<script setup name="VehicleTypeForm">
import {addVehicleType, listVehicleType, updateVehicleType} from "@/api/rent/vehicle-type.js";
import {ElMessage} from "element-plus";
// 派发事件
const emit = defineEmits(["refreshParent"])
// 弹框信息
const _dialogVisible = ref(false);
const _dialogTitle = ref("");

const formRef = ref(null);
// 表单数据
const formData = reactive({
  id: null,
  parentId: null,
  ancestors: '',
  type: null,
  name: null,
  orderNum: 0,
  remark: '',
});
// 表单校验
const validate = reactive({
  parentId: [{required: true, message: "上级配置不能为空", trigger: "change"}],
  name: [{required: true, message: "名称不能为空", trigger: "blur"}],
})

const confRef = ref(null)
// 车辆配置选项
const options = ref([])
// 选中的车辆配置
const vehicleConfig = ref([])

// 重置信息
function resetInfo() {
  // 清除数据
  options.value = [];
  vehicleConfig.value = [];
  formRef?.value?.resetFields();
  formData.id = null;
  formData.type = null;
}

/**
 * 展示弹框
 * @param title 标题
 * @param row row不为空，代表需要修改数据
 * @param config config不为空，代表在已有数据的基础上添加数据
 * 除此之外的情况，即为新增数据
 */
function show(title, row, config) {
  _dialogVisible.value = true;
  _dialogTitle.value = title;
  nextTick(() => {
    resetInfo();
    if (row) {
      // 获取级联选择信息
      getVehicleTypeList();
      echoData(row);
    } else if (config) {
      getVehicleTypeList();
      vehicleConfig.value = (config.ancestors + "," + config.id).split(",").map(Number);
      handleConfigChange(config.type);
    } else {
      getVehicleTypeList();
    }
  })
}

// 关闭弹框
function hide() {
  resetInfo();
  _dialogVisible.value = false;
}

// 回显信息
function echoData(row) {
  // 赋值
  vehicleConfig.value = row.ancestors.split(",");
  vehicleConfig.value = vehicleConfig.value.map(Number);
  formData.id = row.id;
  formData.parentId = row.parentId;
  formData.ancestors = row.ancestors;
  formData.type = row.type;
  formData.name = row.name;
  formData.orderNum = row.orderNum;
  formData.remark = row.remark;
}

// 获取车辆类型信息
function getVehicleTypeList() {
  listVehicleType().then(res => {
    if (res.code === 200) {
      let data = removeLastLevel(res.rows);
      options.value = [
        {
          "name": "主类目",
          "id": 0,
          children: data,
        },
      ]
    }
  })
}

// 删除最后一级配置（颜色）
function removeLastLevel(data) {
  data.map(item => {
    if (item.children && item.children.length > 0) {
      removeLastLevel(item.children);
    }
    if (item.type === 1) {
      item.children = null;
    }
  })
  return data;
}

// 手动选择上级配置 --- 并决定当前配置的类型
function handleConfigChange(type) {
  if (type == null) {
    const [node] = confRef.value.getCheckedNodes()
    type = node.data.type;
  }
  if (type === 0) {
    formData.type = 1;
  } else if (type === 1) {
    formData.type = 2;
  } else {
    formData.type = 0;
  }
  // 表单数据赋值
  formData.parentId = vehicleConfig.value?.at(vehicleConfig.value.length - 1);
  formData.ancestors = vehicleConfig.value?.join(",");
}

// 提交表单
function submitForm() {
  // 表单校验
  formRef?.value.validate(valid => {
    if (valid) {
      // 判断更新和新增操作
      if (formData.id) {
        updateVehicleType(formData).then(res => {
          if (res.code === 200) {
            // 提示
            noticeAndRefresh("操作成功,车辆配置信息已修改", "success")
          }
        })
      } else {
        addVehicleType(formData).then(res => {
          if (res.code === 200) {
            // 提示
            noticeAndRefresh("操作成功,车辆配置信息已添加", "success");
          }
        })
      }
    }
  })
}

// 成功通知
function noticeAndRefresh(message, type) {
  ElMessage({
    message: message,
    type: type
  })
  // 清除数据
  formRef.value.resetFields();
  // 关闭弹框
  hide();
  // 刷新父组件
  emit("refreshParent");
}

defineExpose({show, hide})
</script>

<template>
  <el-dialog
      v-model="_dialogVisible"
      :title="_dialogTitle"
      width="800">
    <!-- 表单  -->
    <el-form ref="formRef" :model="formData" :rules="validate" label-width="auto" style="width: 750px">
      <el-row :gutter="48">
        <el-col :span="12">
          <el-form-item label="上级配置" prop="parentId">
            <el-cascader style="width: 100%" ref="confRef" v-model="vehicleConfig"
                         :options="options"
                         :show-all-levels="false"
                         clearable
                         @change="handleConfigChange"
                         :props="{checkStrictly: true, value: 'id', label: 'name'}">
              <template #default="{ node, data }">
                {{ data.name }}
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配置名称" prop="name">
            <el-input v-model="formData.name" :maxlength="64"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="orderNum">
            <el-input-number style="width: 100%" v-model="formData.orderNum" :min="0" :max="65535"/>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注" prop="remark">
            <el-input
                v-model="formData.remark"
                style="width: 100%"
                :rows="5"
                type="textarea"
                placeholder="备注"/>
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