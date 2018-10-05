<template>
    <div>
        <van-nav-bar title="家庭成员">
        </van-nav-bar>
        <van-cell-group>
            <van-cell v-for="(item, index) in homeUsers" :key="index" :title="item.nick_name || item.name" is-link
                :value="roleMap.find(i => i.role == item.role).text"
                :to="item.name == $store.state.user.name ? {path: '/me'} : {path: '/userDetail', query: item}" />
        </van-cell-group>
    </div>
</template>
<script>
    import {
        Toast
    } from 'vant';
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component
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
        homeUsers = this.$store.state.homeUsers.homeUsers;
        async fetchData() {
            Toast.loading({
                mask: true,
                duration: 0,
                message: '加载中...'
            });
            await this.$store.dispatch('GET_HOME_USERS', {
                room_id: this.$store.state.user.room_id
            })
            this.homeUsers = this.$store.state.homeUsers.homeUsers;
            this.$forceUpdate()
            Toast.clear()
        };
        created() {
            this.fetchData()
        };
    }
</script>
<style lang="scss" scoped>

</style>