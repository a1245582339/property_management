<template>
    <!-- <div class="wrap">
        <p>物业系统APP</p>
        <van-cell-group class="form">
            <van-field v-model="userName" required clearable label="用户名" placeholder="请输入用户名"/>
            <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" required />
        </van-cell-group>
        <van-button style="margin-top: 30px; width: 90%; left: 50%; transform: translate(-50%, 0)" @click="login">登陆</van-button>
        <span>
            <router-link style="text-decoration: underline #fff" :to="{path: '/register'}">点此注册</router-link>
        </span>
    </div> -->
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="login">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                <Icon :size="16" type="ios-person"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                <Icon :size="14" type="md-lock"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="login" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>


<script>
    import md5 from 'js-md5'
    import {
        Toast
    } from 'vant';
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';

    @Component
    export default class Login extends Vue {
        form = {
            userName: 'ddd',
            password: 'aaaaaa'
        }
        rules = {
            userName: [{
                required: true,
                message: '账号不能为空',
                trigger: 'blur'
            }],
            password: {
                required: true,
                message: '密码不能为空',
                trigger: 'blur'
            }
        }
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
    .login {
        width: 100%;
        height: 100%;
        background-image: url(../assets/images/login-bg.jpg);
        background-size: cover;
        background-position: center;
        position: relative;

        &-con {
            position: absolute;
            right: 160px;
            top: 50%;
            transform: translateY(-60%);
            width: 300px;

            &-header {
                font-size: 16px;
                font-weight: 300;
                text-align: center;
                padding: 30px 0;
            }

            .form-con {
                padding: 10px 0 0;
            }

            .login-tip {
                font-size: 10px;
                text-align: center;
                color: #c3c3c3;
            }
        }
    }
</style>