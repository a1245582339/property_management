<template>
    <div>
        <van-nav-bar title="用户详情" left-text="返回" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
            <span v-if="$store.state.user.role == 2" style="color: #ff4444" slot="right">删除</span>
        </van-nav-bar>
        <van-cell-group>
            <van-cell title="用户名" :value="userInfo.name" />
            <van-cell title="昵称" :value="userInfo.nick_name || '未填写'" />
            <van-cell title="性别" :value="userInfo.sex == 0 ? '男' : '女'" />
            <van-cell title="手机号" :value="userInfo.tel" />
            <van-cell title="角色" :value="roleMap.find(i => i.role == userInfo.role).text" />
        </van-cell-group>

        <van-button type="danger" style="width: 90%; postition: absolute; left: 50%; transform: translate(-50%, 20px)" v-if="$store.state.user.role == 2 && userInfo.role == 0" size="large" @click="checkUser">通过审核</van-button>
    </div>
</template>
<script>
    import {
        Toast,
        Dialog
    } from 'vant';
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component
    export default class UserDetail extends Vue {
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
        userInfo = {};
        onClickLeft() {
            this.$router.push({
                name: 'homeUser'
            })
        };
        onClickRight() {
            Dialog.confirm({
                title: '提示',
                message: '确认删除此用户？'
            }).then(async () => {
                await this.$store.dispatch('DEL_USER', this.userInfo.id)
                Toast.success('删除成功');
                this.$router.push({
                    name: 'homeUser'
                })
            }).catch(() => {
                Toast('已取消');
            });

        };
        checkUser() {
            Dialog.confirm({
                title: '提示',
                message: '确认审核通过此用户并允许他查看你所在房屋的所有信息？'
            }).then(async () => {
                await this.$store.dispatch('CHECK_USER', this.userInfo.id)
                Toast.success('审核成功');
                this.$router.push({
                    name: 'homeUser'
                })
            }).catch(() => {
                Toast('已取消');
            });
        };
        created() {
            this.userInfo = this.$route.query
        };
    }
</script>
<style lang="scss" scoped>

</style>