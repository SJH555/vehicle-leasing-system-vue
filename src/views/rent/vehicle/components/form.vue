<script setup name="VehicleForm">
import {listVehicleType} from "@/api/rent/vehicle-type.js"
import {addVehicle, getVehicle, editVehicle} from "@/api/rent/vehicle.js"
import {Plus} from "@element-plus/icons-vue";
import Principal from "@/views/rent/vehicle/components/principal.vue"
import {ElMessage} from "element-plus";

// dialog属性
const _visible = ref(false);
const _title = ref('');
// 表单数据
const formData = reactive({
  plateNumber: "",
  frameNumber: "",
  price: null,
  brandId: null,
  modelId: null,
  colorId: null,
  deviceId: null,
  principalId: null,
  purchaseTime: null,
  vehicleImg: '',
  remark: ""
});
// 表单校验
const rules = reactive({
  plateNumber: [{required: true, message:"车牌号不能为空", trigger: "blur"}],
  frameNumber: [{required: true, message:"车架号不能为空", trigger: "blur"}],
  price: [{required:true, message:"租赁价格不能为空", trigger: "blur"}],
  brandId: [{required:true, message:"车辆配置不能为空", trigger: "blur"}],
})
// 表单元素
const formRef = ref(null);

// 车辆配置选项
const options = ref([])
// 车辆配置
const vehicleConfig = ref([])
// 车辆图片
const pictureList = ref([]);

// 负责人选择模块
const PrincipalTable = ref(null);
// 负责人昵称
const principalName = ref('');

// 重置信息
function resetInfo() {
  // 清除数据
  formRef?.value?.resetFields();
  pictureList.value.length = 0;
  vehicleConfig.value.length = 0;
  principalName.value = '';
}

// 展示dialog
function show(title, payload) {
  _title.value = title
  _visible.value = true;
  resetInfo();
  if (payload) {
    // 获取车辆信息
    getVehicle(payload).then(res => {
      if (res.code === 200) {
        echoData(res.data);
      }
    })
  }
}
// 关闭dialog
function hide() {
  _visible.value = false;
}

// 选择负责人
function selectPrincipal() {
  PrincipalTable?.value.show();
}
// 获取负责人信息
function receiveValue(value) {
  formData.principalId = value.userId;
  principalName.value = value.nickName;
}

// 上传图片
function uploadImage(image) {
  getBase64(image.file).then(res => {
    pictureList.value.push({
      uid: image.file.uid,
      url: res
    });
  })
}
// 获取图片转base64
function getBase64(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    let imgResult = ''
    reader.readAsDataURL(file)
    reader.onload = function () {
      imgResult = reader.result
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.onloadend = function () {
      resolve(imgResult)
    }
  })
}
// 移除图片
function removeImage(image) {
  for (let i = 0; i < pictureList.value.length; i++) {
    if (image.uid === pictureList.value.at(i).uid) {
      pictureList.value.splice(i, 1);
    }
  }
}
// 赋值表单图片数据
function setVehicleImages() {
  let allImages = [];
  pictureList.value.map(picture => {
    allImages.push(picture.url);
  })
  formData.vehicleImg = allImages.join('|')
}

// 提交表单
function submitForm() {
  // 表单校验
  formRef?.value.validate(valid => {
    if (valid) {
      setVehicleImages();
      // 调用接口
      if (formData.id) {
        editVehicle(formData).then(res => {
          if (res.code === 200) {
            noticeAndRefresh("车辆信息修改成功")
          }
        })
      }else {
        addVehicle(formData).then(res => {
          if (res.code === 200) {
            noticeAndRefresh("车辆信息添加成功")
          }
        })
      }
    }
  })
}
// 提交表单后续操作 - 重置信息
function noticeAndRefresh(title) {
  // 提示
  ElMessage({
    message: title,
    type: "success"
  })
  // 清除信息
  resetInfo();
  // 关闭组件
  hide();
  // 刷新父组件
  emit("refreshParent");
}

// 回显信息
function echoData(row) {
  formData.id = row.id;
  formData.plateNumber = row.plateNumber;
  formData.frameNumber = row.frameNumber;
  formData.price = row.price;
  formData.brandId = row.brandId;
  formData.modelId = row.modelId;
  formData.colorId = row.colorId;
  formData.deviceId = row.deviceId;
  formData.principalId = row.principalId;
  formData.purchaseTime = row.purchaseTime;
  formData.vehicleImg = row.vehicleImg;
  formData.remark = row.remark;
  // 回显图片
  row?.vehicleImg?.split("|").map(img => {
    if (img) {
      pictureList.value?.push({url: img})
    }
  });
  // 回显配置
  if(row.brandId) {
    vehicleConfig.value.push(Number(row.brandId));
  }
  if(row.modelId) {
    vehicleConfig.value.push(Number(row.modelId));
  }
  if (row.colorId) {
    vehicleConfig.value.push(Number(row.colorId));
  }
  // 回显负责人名称
  principalName.value = row.principalName;
}

watch(() => vehicleConfig.value, () => {
  // 车辆配置，解构赋值
  const [brandId, modelId, colorId] =  vehicleConfig.value;
  formData.brandId = brandId;
  formData.modelId = modelId;
  formData.colorId = colorId;
})

onMounted(() => {
  listVehicleType().then(res => {
    if (res.code === 200) {
      options.value = res.rows;
    }
  })
})

const emit = defineEmits(['refreshParent'])

defineExpose({show, hide})
</script>

<template>
  <el-dialog v-model="_visible" :title="_title" width="800">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="auto">
      <el-row :gutter="56">
        <el-col :span="12">
          <el-form-item label="车牌号" prop="plateNumber">
            <el-input v-model="formData.plateNumber" :maxlength="16" placeholder="车牌号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车架号" prop="frameNumber">
            <el-input v-model="formData.frameNumber" placeholder="车架号" :maxlength="32"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租赁价格" prop="price">
            <el-input v-model="formData.price" placeholder="租赁价格"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆配置" prop="brandId">
            <el-cascader style="width: 100%"
                         v-model="vehicleConfig"
                         :options="options"
                         :props="{label: 'name', value: 'id'}">
              <template #default="{node, data}">
                {{ data.name }}
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider/>
      <el-row :gutter="56">
        <el-col :span="12">
          <el-form-item label="绑定设备">
            <el-input
                v-model="formData.deviceId"
                readonly
                placeholder="请选择">
              <template #append>
                <el-button>选择</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人">
            <el-input
                v-model="principalName"
                readonly
                placeholder="请选择">
              <template #append>
                <el-button @click="selectPrincipal">选择</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="购置日期">
            <el-date-picker
                v-model="formData.purchaseTime"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider/>
      <el-form-item label="车辆图片">
        <el-upload
            :limit="6"
            :file-list="pictureList"
            :http-request="uploadImage"
            :on-remove="removeImage"
            list-type="picture-card">
          <el-icon>
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-divider/>
      <el-row>
        <el-col>
          <el-form-item label="备注">
            <el-input v-model="formData.remark" placeholder="备注" type="textarea" :rows="6"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="hide">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <Principal ref="PrincipalTable" @receiveValue="receiveValue"></Principal>
</template>

<style scoped lang="scss">

</style>