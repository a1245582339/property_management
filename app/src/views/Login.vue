<template>
    <div class="wrap">
        <p>物业系统APP</p>
        <van-cell-group class="form">
            <van-field v-model="userName" required clearable label="用户名" placeholder="请输入用户名"/>
            <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" required />
        </van-cell-group>
        <van-button style="margin-top: 30px; width: 90%; left: 50%; transform: translate(-50%, 0)" @click="login">登陆</van-button>
        <span>
            <router-link style="text-decoration: underline #fff" :to="{path: '/register'}">点此注册</router-link>
        </span>
    </div>
</template>

<script>
    import md5 from 'js-md5'
    import { Toast } from 'vant';
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';

    @Component
    export default class Login extends Vue {
        userName = 't1';
        password = 'aaaaaa';
        login() {
            const vm = this;
            this.$store.dispatch('LOGIN', {
                name: vm.userName,
                password: md5(vm.password)
            }).then(res => {
                if (res.data.code == '20000') {
                    Toast.success('登录成功')
                    vm.$router.push({
                        path: '/main/room'
                    })
                } else {
                    Toast.fail(res.data.msg)
                }
            });
        };
        created() {

        }
    }
</script>
<style lang="scss" scoped>
.wrap {
    padding-top: 50px;
    box-sizing: border-box;
    height: 100%;
    background-image: url('../assets/login_bg.jpg');
    background-size: cover;
    p{
        text-align: center;
        color: #fff;
        font-size: 20px;
        margin-bottom: 30px;
    }
    .form {
        width: 90%;
        left: 50%; 
        transform: translate(-50%, 0);
    }
    span {
        position: absolute;
        right: 5%;
        margin-top: 90px;
        a {
            color: #fff;
        }
    }
}

.wrap /deep/ .van-cell-group {
    background-color: rgba(255, 255, 255, 0.8)
}
.form /deep/ .van-cell {
    background-color: rgba(255, 255, 255, 0)
}
.wrap /deep/ .van-button--default {
    background: #3388ff;
    border: 1px solid #3388ff;
    color: #fff
}
</style>
