<script setup name="VehicleTypeForm">
import {addVehicleType, listVehicleType, updateVehicleType, delVehicleType} from "@/api/rent/vehicle-type.js";
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
  parentId: [{required: true,  message:"上级配置不能为空", trigger: "blur"}],
  type: [{required: true, message: "类型不能为空", trigger: "blur"}],
  name: [{required: true, message: "名称不能为空", trigger: "blur"}],
})

// 级联选择
const parentIdArray = ref([])

// 树形结构选择 -- 层级
const options = ref([])
// 展示弹框
function show(title, row) {
  _dialogVisible.value = true;
  _dialogTitle.value = title;
  nextTick(() => {
    if (row.id) {
      // 获取级联选择信息
      getVehicleTypeList();
      echoData(row);
    }else {
      getVehicleTypeList();
    }
  })
}
// 关闭弹框
function hide() {
  // 清除数据
  parentIdArray.value.length = 0;
  formRef?.value.resetFields();
  _dialogVisible.value = false;
}
// 回显信息
function echoData(row) {
  // 赋值
  console.log(row.ancestors.split(","))
  parentIdArray.value = row.ancestors.split(",");
  parentIdArray.value = parentIdArray.value.map(Number);
  formData.id = row.id;
  formData.type = row.type;
  formData.name = row.name;
  formData.orderNum = row.orderNum;
  formData.remark = row.remark;

}

// 获取车辆类型信息
function getVehicleTypeList() {
  listVehicleType({}).then(res => {
    if (res.code === 200) {
      let rootNode = [];
      rootNode.push({
        "name": "主类目",
        "id": 0,
        children: res.rows
      })
      options.value = rootNode;
    }
  })
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
            optionNotice("操作成功,车辆配置信息已修改", "success")
            // 清除数据
            formRef.value.resetFields();
            // 关闭弹框
            hide();
            // 刷新父组件
            emit("refreshParent");
          }
        })
      }else {
        addVehicleType(formData).then(res => {
          if (res.code === 200) {
            // 提示
            optionNotice("操作成功,车辆配置信息已添加", "success");
            // 清除数据
            formRef.value.resetFields();
            // 关闭弹框
            hide();
            // 刷新父组件
            emit("refreshParent");
          }
        })
      }

    }
  })
}

// 成功通知
function optionNotice(message, type) {
  ElMessage({
    message: message,
    type: type
  })
}

watch(() => parentIdArray.value, () => {
  formData.parentId = parentIdArray.value?.at(parentIdArray.value.length - 1);
  formData.ancestors = parentIdArray.value?.join(",");
})

defineExpose({show, hide})
</script>

<template>
  <el-dialog
      v-model="_dialogVisible"
      :title="_dialogTitle"
      width="500">
    <!-- 表单  -->
    <el-form ref="formRef" :model="formData" :rules="validate" label-width="auto" style="max-width: 600px">
      <el-form-item label="上级配置" prop="parentId">
        <el-cascader v-model="parentIdArray"
                     :options="options"
                     :show-all-levels="false"
                     clearable
                     :props="{checkStrictly: true, value: 'id', label: 'name'}">
          <template #default="{ node, data }">
            {{data.name}}
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="配置类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="0">品牌</el-radio>
          <el-radio :label="1">型号</el-radio>
          <el-radio :label="2">颜色</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="配置名称" prop="name">
        <el-input v-model="formData.name" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number v-model="formData.orderNum" :min="0" :max="65535" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
            v-model="formData.remark"
            style="width: 100%"
            :rows="5"
            type="textarea"
            placeholder="备注"/>
      </el-form-item>
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