<template>
    <div class="wrap">
        <Table class="table" border :columns="columns" :data="roomList"></Table>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Modal v-model="modalShow" title="新增业主" :footer-hide="true" @on-visible-change="visibleChange">
            <Form ref="Form" :model="form" :rules="addForm" @keydown.enter.native="submit" :label-width="50">
                <FormItem prop="name" label="用户名">
                    <Input type="text" v-model="form.name" placeholder="请输入用户名">
                    <span slot="prepend">
                        <Icon :size="14" type="md-contact" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="nick_name" label="昵称">
                    <Input type="text" v-model="form.nick_name" placeholder="请输入用户名">
                    <span slot="prepend">
                        <Icon :size="14" type="logo-octocat" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="password" label="密码">
                    <Input type="password" v-model="form.password" placeholder="请输入密码">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="room" label="房间号">
                    <span>
                        {{currentRoom}}
                    </span>
                </FormItem>
                <FormItem prop="sex" label="性别">
                    <RadioGroup v-model="form.sex">
                        <Radio label="0">男</Radio>
                        <Radio label="1">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="tel" label="手机号">
                    <Input type="text" v-model="form.tel" placeholder="请输入手机号码">
                    <span slot="prepend">
                        <Icon :size="14" type="ios-call" />
                    </span>

                    </Input>
                </FormItem>
                <FormItem style="text-align: right;">
                    <Button size="large" type="text" @click="reset">取消</Button>
                    <Button size="large" type="primary" style="margin-left: 8px" @click="submit">确认</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import md5 from 'js-md5'
    import {
        updateUser
    } from '@/api/homeUsers'
    import {
        getRoom
    } from '@/api/room'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class Main extends Vue {
        columns = [{
                title: '楼号',
                key: 'building',
                filters: [],
                filterMultiple: false,
                filterMethod(value, row) {
                    return row.building == value
                }
            },
            {
                title: '房间号',
                key: 'room_num'
            },
            {
                title: '业主',
                key: 'name',
                render: (h, params) => {
                    return params.row.name ? h('div', params.row.name) : h('div', [h('Button', {
                        props: {
                            type: 'primary',
                        },
                        on: {
                            click: () => {
                                this.addOwner(params.row)
                            }
                        }
                    }, '新增')])
                }
            },
            {
                title: '业主电话',
                key: 'tel',
                render: (h, params) => {
                    return params.row.tel ? h('div', params.row.tel) : h('div', [h('span', {
                        style: {
                            color: '#c5c8ce'
                        }
                    }, '暂无')])
                }
            }
        ];
        currentRoom = ''
        form = {
            name: '',
            nick_name: '',
            password: '',
            sex: '',
            room_id: '',
            tel: ''
        }
        addForm = {
            name: [{
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入用户名！'));
                    } else if (!/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(value)) {
                        callback(new Error('字母开头，允许5-16字节，允许字母数字下划线！'));
                    }
                    callback();
                },
                trigger: 'blur'
            }],
            password: [{
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入密码！'));
                    } else if (!/^[a-zA-Z]\w{5,17}$/.test(value)) {
                        callback(new Error('以字母开头，长度在6~18之间，只能包含字母、数字和下划线！'));
                    }
                    callback();
                },
                trigger: 'blur'
            }],
            sex: [{
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请选择性别'));
                    } 
                    callback();
                },
                trigger: 'change'
            }],
            tel: [{
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入手机号！'));
                    } else if (!/^1[34578]\d{9}$/.test(value)) {
                        callback(new Error('请输入正确手机号！'));
                    }
                    callback();
                },
                trigger: 'blur'
            }]
        }
        roomList = [];
        spinShow = true;
        modalShow = false;
        visibleChange(status) {
            if (!status) {
                this.reset()
            }
        }
        reset() {
            this.$refs['Form'].resetFields()
        }
        addOwner(row) {
            this.modalShow = true
            this.form.room_id = row.id
            this.currentRoom = `${row.building}号楼${row.room_num}室`
        }
        async fetchData() {
            const res = await getRoom()
            this.roomList = res.data.data
            this.columns[0].filters = res.data.data.reduce((total, curr) => {
                return total.find(item => curr.building == item.label) ? total : [...total, {
                    label: curr.building,
                    value: curr.building
                }]
            }, [])
            setTimeout(() => {
                this.spinShow = false
            }, 100)

        };
        submit() {
            const vm = this
            this.$refs['Form'].validate(async (valid) => {
                if (valid) {
                    vm.form.password = md5(vm.form.password)
                    vm.form.role = 2
                    vm.$Message.success(await updateUser(vm.form))
                    vm.reset()
                    this.modalShow = false
                    vm.fetchData()
                } else {
                    this.$Message.error('完善用户信息！');
                }
            })
        }
        created() {
            this.fetchData()
        }
    }
</script>
<style lang="scss" scoped>
    .wrap {
        position: relative;
        width: 95%;
        margin: 50px auto
    }
</style>