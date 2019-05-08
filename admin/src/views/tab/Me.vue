<template>
    <div>
        <Card style="">
            <CellGroup>
                <Cell title="用户名" :extra="userInfo.name" />
                <Cell title="角色" :extra="roleMap.find(i => i.role == userInfo.role).text" />
                <Cell title="密码" :extra="userInfo.password | passwordHide" @click.native="modalShow" />
            </CellGroup>
        </Card>

        <Modal v-model="passwordModal" title="修改密码" :footer-hide="true" @on-visible-change="visibleChange">
            <Form ref="Form" :model="form" :rules="loginForm" @keydown.enter.native="submit">
                <FormItem prop="oldPassword">
                    <Input type="password" v-model="form.oldPassword" placeholder="请输入原密码">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    <Button slot="append" type="primary" @click="checkPassword">验证</Button>
                    </Input>
                </FormItem>
                <FormItem prop="newPassword">
                    <Input type="password" v-model="form.newPassword" placeholder="请输入新密码" :disabled="!passwordCorrect">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="repeatPassword">
                    <Input type="password" v-model="form.repeatPassword" placeholder="请重新输入新密码" :disabled="!passwordCorrect">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>

                    </Input>
                </FormItem>
                <FormItem style="text-align: right;">
                    <Button size="large" type="text" @click="passwordModal = false; passwordCorrect = false">取消</Button>
                    <Button size="large" type="primary" style="margin-left: 8px" @click="submit">确认</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import md5 from 'js-md5'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component({
        filters: {  // 过滤器
            passwordHide(password) {    // 用来把密码变成 ●●●●●●●●●●●●
                let str = ''
                for (let i = 0; i < password.length; i++) {
                    str += '●'  // 把密码变成等长度的 ●
                }
                return str
            }
        }
    })

    export default class Main extends Vue {

        roleMap = [{    // 权限的角色的值和权限名称的对应关系
            role: 1,
            text: '超级管理员'
        }, {
            role: 2,
            text: '管理员'
        }];
        userInfo = { ...this.$store.state.user  // 获取存在全局变量里的用户信息
        };
        loginForm = {
            newPassword: [{ // 验证新密码合法性的规则
                validator: (rule, value, callback) => {
                    let val = this.form.newPassword     // 
                    if (value === '') {
                        callback(new Error('请输入密码！'));
                    } else if (!/^[a-zA-Z]\w{5,17}$/.test(val)) {   // 验证密码的正则表达式

                        callback(new Error('以字母开头，长度在6~18之间，只能包含字母、数字和下划线！'));
                    } else if (this.form.repeatPassword !== '') {   // 如果重复密码的输入框里也写东西了，那么需要验证一下两次密码是否一致
                        this.$refs['Form'].validateField('repeatPassword');
                    }
                    callback(); // 如果验证都通过了，那么就不提示错误
                },
                trigger: 'blur'     // 当输入框失去焦点的时候触发以上验证
            }],
            repeatPassword: [{  // 
                validator: (rule, value, callback) => {
                    let val = this.form.repeatPassword
                    if (val === '') {
                        callback(new Error('请重新输入密码！'));
                    } else if (val !== this.form.newPassword) {
                        callback(new Error('两次密码不一致！'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }],
        }
        form = {    // 修改密码的表单
            oldPassword: '',    // 旧密码
            newPassword: '',    // 新密码
            repeatPassword: '',     // 重复密码
        }
        passwordModal = false;  // 控制密码模态框是否显示
        passwordCorrect = false;    // 旧密码校验是否通过
        modalShow() {   // 点击修改密码时调用的方法
            this.passwordModal = true;  // 让模态框显示
        }
        visibleChange() {   // 当模态框显示状态变化时调用的方法
            this.reset()    // 重置密码校验与内容
        }
        async checkPassword() {     // 检验旧密码
            let res = await this.$store.dispatch('CHECK_PASSWORD', md5(this.form.oldPassword))    // 发起检验密码请求
            if (res.code == '20000') {  // 如果检验结果返回的code是20000
                this.passwordCorrect = true // 那么把通过状态改为true
                this.$Message.success(res.msg);     // 弹出校验成功的提示
            } else {
                this.passwordCorrect = false    // 否则校验失败
                this.$Message.error(res.msg);   // 弹出失败提示
            }

        }
        reset() {   // 重置密码框的方法
            this.$refs['Form'].resetFields()       // 重置模态框
        }
        submit() {  // 提交密码的方法
            const vm = this     
            if (!this.passwordCorrect) {    // 如果密码校验没成功
                this.$Message.error('请先验证密码！');
                return
            }

            this.$refs['Form'].validate(async (valid) => {  // 密码校验成功后验证新旧密码是否符合规范
                if (valid) {    // 如果通过了校验
                    vm.userInfo.password = md5(vm.form.newPassword)     // 对密码进行加密
                    delete vm.userInfo.token  
                    this.$Message.success(await vm.$store.dispatch('UPDATE_INFO', vm.userInfo))     // 发送更新用户信息（修改密码）的请求，成功后弹出成功提示
                    vm.reset()  // 重置密码输入框
                    this.passwordModal = false  // 关闭输入框
                } else {
                    this.$Message.error('请输入正确密码');  // 如果没通过校验，提示
                }
            })
        }
        async logOut() {    // 登出方法
            await this.$store.dispatch('LOG_OUT')     // 登出
            this.$router.push({ // 跳转回login页面
                path: '/login'
            })
        }
    }
</script>
<style lang="scss" scoped>

</style>