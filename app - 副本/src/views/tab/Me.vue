<template>
    <div>
        <Card style="">
            <CellGroup>
                <Cell title="用户名" :extra="userInfo.name" />
                <Cell title="角色" :extra="roleMap.find(i => i.role == userInfo.role).text" />
                <Cell title="密码" :extra="userInfo.password | passwordHide" @click.native="passwordModal = true" />
            </CellGroup>
        </Card>

        <Modal v-model="passwordModal" title="修改密码" @on-ok="beforeClose" @on-cancel="beforeClose">
            <Form ref="Form" :model="form" :rules="loginForm" @keydown.enter.native="login">
                <FormItem>
                    <Input type="text" v-model="form.oldPassword" placeholder="请输入原密码">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    <Button slot="append" type="primary" @click="checkPassword">验证</Button>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="form.newPassword" placeholder="请输入新密码" :disabled="!passwordCorrect">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="passwordCheck">
                    <Input type="password" v-model="form.repeatPassword" placeholder="请重新输入新密码" :disabled="!passwordCorrect">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>

                    </Input>
                </FormItem>
            </Form>
        </Modal>
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
            text: '管理员'
        }];
        userInfo = { ...this.$store.state.user
        };
        loginForm = {
            password: [{
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('Please enter your password'));
                    } else {
                        if (this.form.repeatPassword !== '') {
                            // 对第二个密码框单独验证
                            this.$refs.Form.validateField('passwordCheck');
                        }
                        callback();
                    }
                },
                trigger: 'blur'
            }],
            passwordCheck: [{
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('Please enter your password again'));
                    } else if (value !== this.form.password) {
                        callback(new Error('The two input passwords do not match!'));
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

        async onClickRight() {
            if (/^1[34578]\d{9}$/.test(this.userInfo.tel)) {
                Toast.success(await this.$store.dispatch('UPDATE_INFO', this.userInfo));
            } else {
                return false
            }
        };
        async checkPassword() {
            let res = await this.$store.dispatch('CHECK_PASSWORD', md5(this.form.oldPassword))
            if (res.code == '20000') {
                this.passwordCorrect = true
                Toast.success(res.msg);
            } else {
                this.passwordCorrect = false
                Toast.fail(res.msg);
            }

        }
        async beforeClose(action, done) {
            if (action === 'confirm') {
                if (/^[a-zA-Z]\w{5,17}$/.test(this.newPassword)) {
                    if (this.newPassword == this.repeatPassword) {
                        this.userInfo.password = md5(this.newPassword)
                        Toast.success(await this.$store.dispatch('UPDATE_INFO', this.userInfo)); ///^[a-zA-Z]\w{5,17}$/.test(this.newPassword)
                        done();
                    } else {
                        Toast.fail('两次输入密码不一致！');
                        done(false);
                    }
                } else {
                    Toast.fail('密码须以字母开头，长度在6~18之间，只能包含字母、数字和下划线');
                }


            } else {}
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