<script setup name="CustomerForm">
import {Plus} from "@element-plus/icons-vue";

import {addCustomer, infoCustomer, updateCustomer} from "@/api/rent/customer.js"
import {ElMessage} from "element-plus";

const {proxy} = getCurrentInstance();

// dialog依赖数据
const _title = ref("");
const _dialogVisible = ref(false);
const isEdit = ref(false);

const formRef = ref(null);
// 表单依赖数据
const formData = reactive({
  name: "",
  age: "",
  phone: "",
  idCard: "",
  driverLicenseId: "",
  rentalStatus: null,
  banStatus: null,
  customerImg: "",
  idCardImg: "",
  driverLicenseImg: "",
  remark: ""
})
const rules = reactive({
  name: [{required: true, message: "姓名不能为空", trigger: "blur"}],
  age: [{required: true, message: "年龄不能为空", trigger: "blur"}, {
    pattern: "^\\d+$",
    message: "格式错误",
    trigger: "blur"
  }],
  phone: [{required: true, message: "手机号不能为空", trigger: "blur"}, {
    pattern: "^[1][3,4,5,6.7,8,9][0-9]{9}$",
    message: "格式错误",
    trigger: "blur"
  }],
  idCard: [{
    required: true,
    message: "身份证号不能为空",
    trigger: "blur"
  }, {
    pattern: "^([1-6][1-9]|50)\\d{4}(18|19|20)\\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$",
    message: "格式错误",
    trigger: "blur"
  }],
  driverLicenseId: [{required: true, message: "档案号不能为空", trigger: "blur"}, {
    pattern: "^\\d{12}$",
    message: "格式错误",
    trigger: "blur"
  }]
})

// 控制是否显示图片上传+号
const displayCustomImgUpload = ref(false);
const displayIdCardImgUpload = ref(false);
const displayLicenseImgUpload = ref(false);

// 上传图片数据
const customerImg = ref({})
const idCardImg = ref({});
const licenseImg = ref({});
// 回显图片数据
const customerImgList = ref([])
const idCardImgList = ref([])
const licenseImgList = ref([])

// dialog开启 / 关闭
function show(title, payload) {
  _title.value = title;
  _dialogVisible.value = true;
  isEdit.value = false;
  nextTick(() => {
    resetInfo();
    if (payload) {
      infoCustomer(payload).then(res => {
        if (res.code === 200) {
          echoData(res.data)
        }
      })
    }
  })
}

function detail(title, payload) {
  _title.value = title;
  _dialogVisible.value = true;
  isEdit.value = true;
  nextTick(() => {
    resetInfo();
    if (payload) {
      infoCustomer(payload).then(res => {
        if (res.code === 200) {
          echoData(res.data)
        }
      })
    }
  })
}

function hide() {
  _dialogVisible.value = false;
}

function resetInfo() {
  formRef?.value?.resetFields();
  formData.id = null;
  customerImg.value = {};
  idCardImg.value = {};
  licenseImg.value = {};
  customerImgList.value = [];
  idCardImgList.value = [];
  licenseImgList.value = [];
  displayCustomImgUpload.value = false;
  displayIdCardImgUpload.value = false;
  displayLicenseImgUpload.value = false;
}

function echoData(data) {
  formData.id = data.id;
  formData.name = data.name;
  formData.age = data.age;
  formData.phone = data.phone;
  formData.idCard = data.idCard;
  formData.driverLicenseId = data.driverLicenseId;
  formData.rentalStatus = data.rentalStatus;
  formData.banStatus = data.banStatus;
  formData.customerImg = data.customerImg;
  formData.idCardImg = data.idCardImg;
  formData.driverLicenseImg = data.driverLicenseImg;
  formData.remark = data.remark;
  // 回显图片
  if(formData.customerImg) {
    customerImgList.value = formData.customerImg?.split(",").map(img => {
      return {url: img}
    });
  }
  if (formData.idCardImg) {
    idCardImgList.value = formData.idCardImg?.split(",").map(img => {
      return {url: img}
    });
  }
  if(formData.driverLicenseImg) {
    licenseImgList.value = formData.driverLicenseImg?.split(",").map(img => {
      return {url: img}
    });
  }
  // 等待双向绑定完成
  nextTick(() => {
    customerImgList.value.map(item => {
      customerImg.value = {
        [item.uid]: item.url,
        ...customerImg.value
      }
    })
    displayCustomImgUpload.value = Object.keys(customerImg.value).length >= 1;

    idCardImgList.value.map(item => {
      idCardImg.value = {
        [item.uid]: item.url,
        ...idCardImg.value
      }
    })
    displayIdCardImgUpload.value = Object.keys(idCardImg.value).length >= 2;

    licenseImgList.value.map(item => {
      licenseImg.value = {
        [item.uid]: item.url,
        ...licenseImg.value
      }
    })
    displayLicenseImgUpload.value = Object.keys(licenseImg.value).length >= 2;
  })
}

// 图片上传、删除行为
async function customImgUpload(file) {
  if (file) {
    let res = await proxy.upload(file, "/rent/minio/upload")
    if (res.code === 200) {
      customerImg.value = {
        ...customerImg.value,
        [file.file.uid]: res.data.at(0),

      }
    }
  }
  displayCustomImgUpload.value = Object.keys(customerImg.value).length >= 1;
}

function customImgRemove(file) {
  delete customerImg.value[file.uid];
  displayCustomImgUpload.value = Object.keys(customerImg.value).length >= 1;
}

async function idCardImgUpload(file) {
  if (file) {
    let res = await proxy.upload(file, "/rent/minio/upload")
    if (res.code === 200) {
      idCardImg.value = {
        ...idCardImg.value,
        [file.file.uid]: res.data.at(0),
      }
    }
  }
  displayIdCardImgUpload.value = Object.keys(idCardImg.value).length >= 2;
}

function idCardImgRemove(file) {
  delete idCardImg.value[file.uid]
  displayIdCardImgUpload.value = Object.keys(idCardImg.value).length >= 2;
}

async function licenseImgUpload(file) {
  if (file) {
    let res = await proxy.upload(file, "/rent/minio/upload")
    if (res.code === 200) {
      licenseImg.value = {
        ...licenseImg.value,
        [file.file.uid]: res.data.at(0),
      }
    }
  }
  displayLicenseImgUpload.value = Object.keys(licenseImg.value).length >= 2;
}

function licenseImgRemove(file) {
  delete licenseImg.value[file.uid]
  displayLicenseImgUpload.value = Object.keys(licenseImg.value).length >= 2;
}

// 提交表单前上传图片
function handleImg() {
  formData.customerImg = Object.values(customerImg.value).join(",");
  formData.idCardImg = Object.values(idCardImg.value).join(",");
  formData.driverLicenseImg = Object.values(licenseImg.value).join(",");

}

function submitForm() {
  handleImg();
  console.log("fffffff")
  console.log(formData)
  if (formData.id) {
    updateCustomer(formData).then(res => {
      if (res.code === 200) {
        ElMessage({
          message: "客户信息修改成功",
          type: "success"
        })
        hide();
        emit("refreshParent");
      }
    })
  } else {
    addCustomer(formData).then(res => {
      if (res.code === 200) {
        ElMessage({
          message: "客户信息添加成功",
          type: "success"
        })
        hide();
        emit("refreshParent");
      }
    })
  }
}

const emit = defineEmits(["refreshParent"]);
defineExpose({show, hide, detail})
</script>

<template>
  <el-dialog
      v-model="_dialogVisible"
      :title="_title"
      width="800">
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="auto">
      <el-row :gutter="60">
        <el-col :span="12">
          <el-form-item prop="name" label="姓名">
            <el-input v-model="formData.name" :disabled="isEdit"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="age" label="年龄">
            <el-input v-model="formData.age" :disabled="isEdit"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="phone" label="手机号">
            <el-input v-model="formData.phone" :disabled="isEdit"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="60">
        <el-col :span="12">
          <el-form-item prop="idCard" label="身份证号">
            <el-input v-model="formData.idCard" :disabled="isEdit"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="driverLicenseId" label="驾驶证档案号">
            <el-input v-model="formData.driverLicenseId" :disabled="isEdit"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider border-style="dashed"></el-divider>
      <el-row :gutter="60">
        <el-col :span="12">
          <el-form-item prop="rentalStatus" label="正在租车">
            <el-switch v-model="formData.rentalStatus" :disabled="isEdit"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="banStatus" label="禁止租车">
            <el-switch v-model="formData.banStatus" :disabled="isEdit"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider border-style="dashed"></el-divider>
      <el-row :gutter="60">
        <el-col :span="24">
          <el-form-item label="客户照片" prop="customerImg">
            <el-upload
                v-model:file-list="customerImgList"
                :class="{hideAdd:displayCustomImgUpload}"
                :http-request="customImgUpload"
                :on-remove="customImgRemove"
                :disabled="isEdit"
                list-type="picture-card">
              <el-icon class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="身份证照片" prop="idCardImg">
            <el-upload
                v-model:file-list="idCardImgList"
                :class="{hideAdd:displayIdCardImgUpload}"
                :http-request="idCardImgUpload"
                :on-remove="idCardImgRemove"
                :disabled="isEdit"
                list-type="picture-card">
              <el-icon class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="驾驶证照片" prop="driverLicenseImg">
            <el-upload
                v-model:file-list="licenseImgList"
                :class="{hideAdd:displayLicenseImgUpload}"
                :http-request="licenseImgUpload"
                :on-remove="licenseImgRemove"
                :disabled="isEdit"
                list-type="picture-card">
              <el-icon class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider border-style="dashed"></el-divider>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="5" :disabled="isEdit"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div v-if="isEdit">
        <el-button @click="hide">关闭</el-button>
      </div>
      <div class="dialog-footer" v-else>
        <el-button @click="hide">取消</el-button>
        <el-button type="primary" @click="submitForm">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

.hideAdd {
  :deep(.el-upload--picture-card ) {
    display: none;
  }
}

</style>