<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="$route.path"   :collapse="isCollapse" background-color="#304156" text-color="#fff" active-text-color="#409EFF">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  // data 的数据是为了让导航默认展开
  // data() {
  //     return {
  //         showname: 'Example'
  //     }
  // },
  //      //在el-menu标签加入:default-openeds='[showname]'，可添加默认打开的标签
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style scope> 
</style>
