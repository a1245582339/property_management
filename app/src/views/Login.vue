<template>
    <div>

        <cube-input v-model="userName"></cube-input>
        <cube-input v-model="password" type="password" :eye="false"></cube-input>
        <cube-button @click="login">登录</cube-button>
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
            this.$store.dispatch('LOGIN', {name: vm.userName, password: vm.password}).then(res => {
                if (res.data.code == '20000') {
                    vm.$router.push({name: 'room'})
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