<script setup name="Principal">
import {listUser} from "@/api/system/user.js"

const _visible = ref(false);
// 负责人信息
const principalList = ref([]);
// 性别信息
const sexInfo = {
  0: "男",
  1: "女",
  2: "未知"
}

// 展示组件
function show() {
  _visible.value = true;
}
// 隐藏组件
function hide() {
  _visible.value = false;
}

// 确认负责人信息
function confirmPrincipalInfo(row) {
  emit("receiveValue", row);
  hide();
}

onMounted(() => {
  listUser().then(res => {
    if (res.code === 200) {
      principalList.value = res.rows;
    }
  })
})

const emit = defineEmits(['receiveValue']);

defineExpose({show, hide})
</script>

<template>
  <el-drawer
      v-model="_visible"
      title="负责人信息"
      direction="rtl"
      size="35%">
    <el-table :data="principalList">
      <el-table-column property="userName" label="账号" align="center" />
      <el-table-column property="nickName" label="昵称" align="center" />
      <el-table-column property="sex" label="性别" align="center">
        <template #default="scope">
          {{sexInfo[scope.row.sex]}}
        </template>
      </el-table-column>
      <el-table-column property="phonenumber" label="手机号" align="center"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" plain @click="confirmPrincipalInfo(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<style scoped lang="scss">

</style>