<template>
    <div>

        <van-cell-group>
            <van-field v-model="userName" required clearable label="用户名" icon="question" placeholder="请输入用户名"
                @click-icon="$toast('question')" />

            <van-field v-model="password" type="password" label="密码" placeholder="请输入密码" required />
        </van-cell-group>
        <van-button type="default" @click="login">登陆</van-button>
    </div>
</template>

<script>
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';

    @Component
    export default class Login extends Vue {
        userName = 't1';
        password = '111111';
        login() {
            const vm = this;
            this.$store.dispatch('LOGIN', {
                name: vm.userName,
                password: vm.password
            }).then(res => {
                if (res.data.code == '20000') {
                    vm.$router.push({
                        name: 'room'
                    })
                } else {
                    const toast = vm.$createToast({
                        time: 1000,
                        txt: res.data.msg,
                        type: 'error'
                    })
                    toast.show()
                }
            });
        };
        created() {

        }
    }
</script>