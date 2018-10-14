<template>
    <div>
        <van-nav-bar title="个人信息" @click-right="onClickRight">
            <span :style="{color: /^1[34578]\d{9}$/.test(userInfo.tel) ? '#3388ff' : '#8e9bbd'}" slot="right">更改</span>
        </van-nav-bar>
        <van-cell-group>
            <van-field label="用户名" v-model="userInfo.name" disabled />
            <van-field label="角色" v-model="roleMap.find(i => i.role == userInfo.role).text" disabled />
            <van-field label="密码" v-model="userInfo.password" type='password' disabled>
                <van-button slot="button" size="small" type="primary" @click="dialogShow = true">修改密码</van-button>
            </van-field>
            <van-field label="昵称" v-model="userInfo.nick_name" placeholder="请输入昵称" />
            <van-field required label="手机号" v-model="userInfo.tel" placeholder="请输入手机号" :error-message="/^1[34578]\d{9}$/.test(userInfo.tel) ? '' : '手机号格式错误'" />
        </van-cell-group>
        <van-button type="danger" style="width: 90%; postition: absolute; left: 50%; transform: translate(-50%, 20px)"
            @click="logOut">退出登录</van-button>
        <van-dialog v-model="dialogShow" show-cancel-button close-on-click-overlay :before-close="beforeClose">
            <van-field v-model="oldPassword" type="password" label="原密码" placeholder="请输入原密码">
                <van-button style="position: relative; right: 20px" slot="button" size="mini" type="primary" @click="checkPassword">验证</van-button>
            </van-field>
            <van-field v-model="newPassword" type="password" label="新密码" placeholder="请输入新密码" :disabled="!passwordCorrect"
                :error-message="/^[a-zA-Z]\w{5,17}$/.test(newPassword) ? '' : '以字母开头，长度在6~18之间，只能包含字母、数字和下划线'" />
            <van-field v-model="repeatPassword" type="password" label="新密码" placeholder="请重新输入密码" :disabled="!passwordCorrect" />
        </van-dialog>
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
        userInfo = { ...this.$store.state.user
        };
        dialogShow = false;
        oldPassword = '';
        passwordCorrect = false;
        newPassword = '';
        repeatPassword = '';
        async onClickRight() {
            if (/^1[34578]\d{9}$/.test(this.userInfo.tel)) {
                Toast.success(await this.$store.dispatch('UPDATE_INFO', this.userInfo));
            } else {
                return false
            }
        };
        async checkPassword() {
            let res = await this.$store.dispatch('CHECK_PASSWORD', md5(this.oldPassword))
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


            } else {
                done();
            }
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