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
        filters: {
            passwordHide(password) {
                let str = ''
                for (let i = 0; i < password.length; i++) {
                    str += '●'
                }
                return str
            }
        }
    })

    export default class Main extends Vue {

        roleMap = [{
            role: 1,
            text: '超级管理员'
        }, {
            role: 2,
            text: '维修员工'
        }];
        userInfo = { ...this.$store.state.user
        };
        loginForm = {
            newPassword: [{
                validator: (rule, value, callback) => {
                    let val = this.form.newPassword
                    if (value === '') {
                        callback(new Error('请输入密码！'));
                    } else if (!/^[a-zA-Z]\w{5,17}$/.test(val)) {

                        callback(new Error('以字母开头，长度在6~18之间，只能包含字母、数字和下划线！'));
                    } else if (this.form.repeatPassword !== '') {
                        this.$refs['Form'].validateField('repeatPassword');
                    }
                    callback();
                },
                trigger: 'blur'
            }],
            repeatPassword: [{
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
        form = {
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
        }
        passwordModal = false;
        passwordCorrect = false;
        modalShow() {
            this.passwordModal = true;
        }
        visibleChange() {
            this.reset()
        }
        async checkPassword() {
            let res = await this.$store.dispatch('CHECK_PASSWORD', md5(this.form.oldPassword))
            if (res.code == '20000') {
                this.passwordCorrect = true
                this.$Message.success(res.msg);
            } else {
                this.passwordCorrect = false
                this.$Message.error(res.msg);
            }

        }
        reset() {
            this.$refs['Form'].resetFields()
        }
        submit() {
            const vm = this
            if (!this.passwordCorrect) {
                this.$Message.error('请先验证密码！');
                return
            }

            this.$refs['Form'].validate(async (valid) => {
                if (valid) {
                    vm.userInfo.password = md5(vm.form.newPassword)
                    delete vm.userInfo.token
                    this.$Message.success(await vm.$store.dispatch('UPDATE_INFO', vm.userInfo))
                    vm.reset()
                    this.passwordModal = false
                } else {
                    this.$Message.error('请输入正确密码');
                }
            })
        }
        async logOut() {
            await this.$store.dispatch('LOG_OUT')
            this.$router.push({
                path: '/login'
            })
        }
    }
</script>
<style lang="scss" scoped>

</style>