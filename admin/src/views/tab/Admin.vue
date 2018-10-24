<template>
    <div>
        <div class="wrap">
            <Button type="primary" @click="edit({}, true)" size="large">新增</Button>
            <Table class="table" border :columns="columns" :data="adminList"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :page-size="10" :total="total" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>
        <Modal v-model="modelShow" :title="isNew ? '新增管理员' : '编辑管理员'" :footer-hide="true" @on-visible-change="visibleChange">
            <Form ref="Form" :model="form" :rules="rule" @keydown.enter.native="login" :label-width="50">
                <FormItem style="display: none" prop="id" label="id">
                    <Input type="text" v-model="form.id">
                    <span slot="prepend">
                        <Icon :size="14" type="md-contact" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="name" label="用户名">
                    <Input type="text" v-model="form.name" placeholder="请输入用户名">
                    <span slot="prepend">
                        <Icon :size="14" type="md-contact" />
                    </span>
                    </Input>
                </FormItem>

                <FormItem prop="role" label="角色">
                    <RadioGroup v-model="form.role">
                        <Radio :label="1">超级管理员</Radio>
                        <Radio :label="2">管理员</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem style="text-align: right;">
                    <Button size="large" type="text" @click="modelShow = false">取消</Button>
                    <Button size="large" type="primary" style="margin-left: 8px" @click="submit">确认</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import md5 from 'js-md5'
    import {
        getAdminList
    } from '@/api/admin.js'
    import {
        updateUserInfo
    } from '@/api/user.js'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class Admin extends Vue {
        columns = [{
            title: '用户名',
            key: 'name',
        }, {
            title: '角色',
            key: 'role',
            filters: [{
                    label: '超级管理员',
                    value: 1
                },
                {
                    label: '管理员',
                    value: 2
                }
            ],
            filterMultiple: false,
            filterMethod(value, row) {
                return row.role == value
            },
            render: (h, params) => {
                return h('div', params.row.role == 1 ? '超级管理员' : '管理员')
            }
        }, {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
                return h('div', params.row.role == 1 ? [h('div', {
                    style: {
                        color: '#c5c8ce'
                    }
                }, '无法编辑超级管理员')] : [
                    h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        style: {
                            marginRight: '5px'
                        },
                        on: {
                            click: () => {
                                this.edit(params.row, false)
                            }
                        }
                    }, '编辑'),
                    h('Button', {
                        props: {
                            type: 'error',
                            size: 'small'
                        },
                        on: {
                            click: async () => {
                                this.$Modal.confirm({
                                    title: '提醒',
                                    content: '<p>确认删除此管理员？</p>',
                                    loading: true,
                                    onOk: async () => {
                                        await updateUserInfo({
                                            id: params.row.id,
                                            isDel: 1
                                        })
                                        this.$Message.success('删除成功');
                                        this.$Modal.remove();
                                        this.fetchData()
                                    }
                                });
                            }
                        }
                    }, '删除')
                ]);
            }
        }];
        adminList = [];
        page = 0;
        total = 0;
        spinShow = true;
        modelShow = false;
        isNew = true
        form = {
            name: '',
            role: '',
            id: ''
        };
        rule = {
            name: [{
                validator: (rule, value, callback) => {
                    if (!value) {
                        callback(new Error('请输入用户名！'));
                    } else if (!/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(value)) {
                        callback(new Error('字母开头，允许5-16字节，允许字母数字下划线！'));
                    }
                    callback();
                },
                trigger: 'blur'
            }],
            role: [{
                validator: (rule, value, callback) => {
                    if (!value) {
                        callback(new Error('选择角色！'));
                    } else {
                        callback();
                    }
                },
                trigger: 'change'
            }],
        }
        changePage(page) {
            this.page = page - 1
            this.spinShow = true
            this.fetchData()
        }
        edit(row, isNew) {
            this.isNew = isNew
            this.modelShow = true
            if (isNew) {
                this.form.password = '000000'
            }
            this.form.name = row.name;
            this.form.role = row.role;
            this.form.id = row.id
        }
        submit() {
            const vm = this
            this.$refs['Form'].validate(async (valid) => {
                if (valid) {
                    if (vm.isNew) {
                        vm.form.password = md5('000000')
                    }
                    var res = await updateUserInfo(vm.form)
                    if (res.data.code == 20000) {
                        this.$Message.success(res.data.msg)
                        this.modelShow = false
                        vm.fetchData()
                    } else {
                        this.$Message.error(res.data.msg)
                    }
                } else {
                    this.$Message.error('完善用户信息！');
                }
            })
        }
        visibleChange(status) {
            if (!status) {
                this.reset()
            }
        }
        reset() {
            this.$refs['Form'].resetFields()
        }
        async fetchData() {
            const res = await getAdminList({
                page: this.page,
            })
            this.adminList = res.data.data
            this.total = res.data.total
            setTimeout(() => {
                this.spinShow = false
            }, 100)
        }
        beforeCreate() {
            
            if (this.$store.state.user.role == 2) {
                this.$router.push({path: '/401'})
            }
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
        margin: 30px auto;

        .table {
            margin-top: 20px;
        }
    }
</style>