<script setup name="CustomerForm">
import {Plus} from "@element-plus/icons-vue";

const {proxy} = getCurrentInstance();

// dialog依赖数据
const _title = ref("");
const _dialogVisible = ref(false)

// 表单依赖数据
const formData = reactive({
  name: "",
  age: "",
  phone: "",
  icCard: "",
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

// 图片数据
const customerImgList = ref([])
const idCardImgList = ref([]);
const licenseImgList = ref([]);

// dialog开启 / 关闭
function show(title, payload) {
  _title.value = title;
  _dialogVisible.value = true;
}

function hide() {
  _dialogVisible.value = false;
}

// 图片上传、删除行为
function customImgUpload() {
  displayCustomImgUpload.value = customerImgList.value.length >= 1;
}

function customImgRemove() {
  displayCustomImgUpload.value = customerImgList.value.length >= 1;
}

function idCardImgUpload() {
  displayIdCardImgUpload.value = idCardImgList.value.length >= 2;
}

function idCardImgRemove() {
  displayIdCardImgUpload.value = idCardImgList.value.length >= 2;
}

function licenseImgUpload() {
  displayLicenseImgUpload.value = licenseImgList.value.length >= 2;
}

function licenseImgRemove() {
  displayLicenseImgUpload.value = licenseImgList.value.length >= 2;
}

// 提交表单前上传图片
async function handleImg() {
  let list = [];
  let customerImgListLength = 0;
  let idCardImgListLength = 0;
  let licenseImgListLength = 0;
  // 客户图片
  if (customerImgList.value.length) {
    list.push.apply(customerImgList.value.map(item => item.raw))
    customerImgListLength = customerImgList.value.length;
  }
  // 身份证图片
  if (idCardImgList.value.length) {
    list.push.apply(idCardImgList.value.map(item => item.raw));
    idCardImgListLength = idCardImgList.value.length;
  }
  // 驾驶证图片
  if (licenseImgList.value.length) {
    list.push.apply(licenseImgList.value.map(item => item.raw))
    licenseImgListLength = licenseImgList.value.length;
  }
  // 上传图片
  try {
    const res = proxy.upload(list, "/rent/minio/upload")
    if (res.code === 200) {
      // 赋值
      formData.customerImg = res.data.slice(0, customerImgListLength).join(",")
      formData.idCardImg = res.data.slice(customerImgListLength, idCardImgListLength).join(",")
      formData.idCardImg = res.data.slice(idCardImgListLength, licenseImgListLength).join(",")
    }
  }catch (error) {
    console.error(error)
  }
}

async function submitForm() {
  await handleImg();
  console.log(formData)
  hide();
}

defineExpose({show, hide})
</script>

<template>
  <el-dialog
      v-model="_dialogVisible"
      :title="_title"
      width="800">
    <el-form :model="formData"  label-width="auto">
      <el-row :gutter="60">
        <el-col :span="12">
          <el-form-item prop="name" label="姓名">
            <el-input v-model="formData.name"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="age" label="年龄">
            <el-input v-model="formData.age"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="phone" label="手机号">
            <el-input v-model="formData.phone"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="60">
        <el-col :span="12">
          <el-form-item prop="idCard" label="身份证号">
            <el-input v-model="formData.idCard"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="driverLicenseId" label="驾驶证档案号">
            <el-input v-model="formData.driverLicenseId"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider border-style="dashed"></el-divider>
      <el-row :gutter="60">
        <el-col :span="12">
          <el-form-item prop="rentalStatus" label="正在租车">
            <el-switch v-model="formData.rentalStatus"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="banStatus" label="禁止租车">
            <el-switch v-model="formData.banStatus"/>
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
        <el-input v-model="formData.remark" type="textarea" :rows="5"></el-input>
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

.hideAdd {
  :deep(.el-upload--picture-card ) {
    display: none;
  }
}

</style>