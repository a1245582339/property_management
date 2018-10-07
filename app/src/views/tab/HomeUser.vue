<template>
    <div>
        <van-nav-bar title="家庭成员">
        </van-nav-bar>
        <no-permission v-if="$store.state.user.role == 0" />
         <van-list v-else v-model="Listloading" :finished="finished" @load="onLoad">
            <van-cell v-for="(item, index) in homeUsers" :key="index" :title="item.nick_name || item.name" is-link
                :value="roleMap.find(i => i.role == item.role).text"
                :to="item.name == $store.state.user.name ? {name: 'me'} : {path: '/userDetail', query: item}" />
        </van-list>
    </div>
</template>
<script>
    import noPermission from '@/components/noPermission'
    import {
        Toast
    } from 'vant';
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component({
        components: {
            noPermission
        }
    })
    export default class Main extends Vue {
        roleMap = [{
            role: 0,
            text: '未审核'
        }, {
            role: 1,
            text: '家庭成员'
        }, {
            role: 2,
            text: '业主'
        }];
        homeUsers = this.$store.state.homeUsers.list;
        Listloading = false;
        finished = false;
        page = 0;
        async fetchData() {
            const vm = this
            var res = await this.$store.dispatch('GET_HOME_USERS', {
                room_id: this.$store.state.user.room_id,
                page: vm.page
            })
            this.page ++
            if (res.data.data.length < 20) {
                vm.finished = true
                vm.Listloading = false
            }
            this.homeUsers = this.$store.state.homeUsers.list;
            this.$forceUpdate()
            Toast.clear()
        };
        onLoad() {
            this.fetchData()
        };
        created() {
            if (this.$store.state.user.role != 0) {
                Toast.loading({
                mask: true,
                duration: 0,
                message: '加载中...'
            });
            this.fetchData()
            }
            
        };
    }
</script>
<style lang="scss" scoped>

</style>