<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="login">
                        <FormItem prop="userName">
                            <Input type="text" v-model="form.userName" placeholder="请输入用户名">
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
                            <Button type="primary" @click="login" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>


<script>
    import md5 from 'js-md5'    // md5加密工具
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';

    @Component
    export default class Login extends Vue {
        form = {    // 登录表单项
            userName: 'ddd',
            password: 'aaaaaa'
        }
        rules = {   // 表单验证规则
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
        login() {   // 登录方法
            const vm = this;
            this.$store.dispatch('LOGIN', {     // 发送登录请求
                name: vm.form.userName,     // 用户名
                password: md5(vm.form.password)     // 加密后的密码
            }).then(res => {    // 登录成功后
                if (res.data.code == '20000') {     // 如果返回的code是20000
                    this.$Message.success('登录成功')   // 那么提示登录成功
                    vm.$router.push({   // 跳转至首页
                        path: '/'
                    })
                } else {    // 如果code不是20000
                    this.$Message.error('用户名或密码错误')     // 提示错误
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