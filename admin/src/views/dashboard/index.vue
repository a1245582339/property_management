<template>
  <div class="dashboard-container">
    <div>欢迎进入admin</div>
    <div class="dashboard-text">用户名:{{name}}</div>
    <div class="dashboard-text">角色:<span v-for='role in roles' :key='role'>{{role}}</span></div>
     <div class="dashboard-text">手机:{{tel}}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'welcome',
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'tel',
      'sex'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
