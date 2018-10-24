<template>
    <div>
        <div class="wrap">
            <Button type="primary" @click="Modal = true" size="large">新增</Button>
            <Table class="table" border :columns="columns" :data="typeList"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>


        <Modal v-model="Modal" title="编辑零件类型" @on-visible-change="visibleChange" :footer-hide="true">
            <Form ref="Form" :model="form" :rules="rules" @keydown.enter.native="submit" :label-width="100">
                <FormItem prop="type_name" label="零件类型名称">
                    <Input type="text" v-model="form.type_name" placeholder="请输入新的零件类型名称">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="display: none" prop="id" label="零件类型id">
                    <Input type="text" v-model="form.id" placeholder="">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="text-align: right;">
                    <Button size="large" type="text" @click="Modal = false">取消</Button>
                    <Button size="large" type="primary" style="margin-left: 8px" @click="submit">确认</Button>
                </FormItem>
            </Form>
        </Modal>

    </div>

</template>
<script>
    import {
        getPartType,
        updataPartType
    } from '@/api/partType'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class PartType extends Vue {
        columns = [{
                title: '零件类型',
                key: 'type_name'
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary',
                            },
                            on: {
                                click: () => {
                                    this.edit(params.row)
                                }
                            }
                        }, '编辑'),
                        h('span', ' '),
                        h('Button', {
                            props: {
                                type: 'error',
                            },
                            on: {
                                click: () => {
                                    this.del(params.row)
                                }
                            }
                        }, '删除')
                    ]);
                }
            }
        ];
        page = 0;
        total = 2;
        typeList = [];
        spinShow = true;
        Modal = false;
        form = {
            
        };
        rules = {
            type_name: [{
                required: true,
                message: '请输入新的类型名称！',
                trigger: 'blur'
            }]
        }
        del(row) {
            this.$Modal.confirm({
                title: '提示',
                render: (h) => {
                    return h('p', `确定删除“${row.type_name}”类型，并删除其下所有零件吗？`)
                },
                onOk: () => {
                    updataPartType({
                        id: row.id,
                        isDel: 1
                    }).then(res => {
                        this.$Message.success('删除成功');
                        this.page = 0
                        this.fetchData()
                    })

                }
            })
        }
        edit(row) {
            if (row.id) {
                this.form.id = row.id
            }
            this.form.type_name = row.type_name
            this.Modal = true
        }
        submit() {
            var vm = this
            this.$refs['Form'].validate(async (valid) => {
                if (valid) {
                    this.$Message.success((await updataPartType(vm.form)).data.msg)
                    this.Modal = false
                    this.fetchData()
                }
            })
        }
        visibleChange(status) {
            if (!status) {
                this.$refs['Form'].resetFields()
            }
            
        }
        async fetchData() {
            const res = await getPartType()
            this.typeList = res.data.data
            setTimeout(() => {
                this.spinShow = false
            }, 100)

        };
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
            ;
        }
    }
</style>