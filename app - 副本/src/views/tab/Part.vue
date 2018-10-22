<template>
    <div>
        <div class="wrap">
            <Button type="primary" @click="Modal = true" size="large">新增</Button>
            <Table class="table" border :columns="columns" :data="partList"></Table>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </div>

        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :page-size="10" :total="total" :current="page + 1" @on-change="changePage"></Page>
            </div>
        </div>


        <Modal v-model="Modal" title="编辑" @on-visible-change="visibleChange" :footer-hide="true">
            <Form ref="Form" :model="form" :rules="rules" @keydown.enter.native="submit" :label-width="80"
                label-position="left">
                <FormItem prop="part_name" label="零件名称">
                    <Input type="text" v-model="form.part_name" placeholder="请输入新的零件名称">
                    <span slot="prepend">
                        <Icon :size="14" type="ios-build" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="type_id" label="零件类型">
                    <Select v-model="form.type_id" style="width:200px">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="price" label="单价（元）">
                    <Input type="text" v-model="form.price" placeholder="请输入单价">
                    <span slot="prepend">
                        <Icon :size="14" type="logo-yen" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem prop="count" label="剩余库存">
                    <Input type="text" v-model="form.count" placeholder="请输入剩余库存">
                    <span slot="prepend">
                        <Icon :size="14" type="ios-cube" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="display: none" prop="id" label="零件id">
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

        <Modal v-model="showSell" title="出库" @on-visible-change="sellvisibleChange" :footer-hide="true">
            <Form ref="SellForm" :model="sellForm" :rules="sellRules" @keydown.enter.native="sellSubmit" :label-width="80"
                label-position="left">
                <FormItem prop="title" label="报修标题">
                    <Select v-model="sellForm.title" filterable remote :remote-method="selectRepairTitle" :loading="searchLoading">
                        <Option v-for="(option, index) in options" :value="option.value" :key="index">{{option.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="count" label="出库量">
                    <Input type="text" v-model="sellForm.count" placeholder="请输入剩余库存">
                    <span slot="prepend">
                        <Icon :size="14" type="ios-cube" />
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="display: none" prop="part_id" label="零件id">
                    <Input type="text" v-model="sellForm.part_id" placeholder="">
                    <span slot="prepend">
                        <Icon :size="14" type="md-lock"></Icon>
                    </span>
                    </Input>
                </FormItem>
                <FormItem style="text-align: right;">
                    <Button size="large" type="text" @click="Modal = false">取消</Button>
                    <Button size="large" type="primary" style="margin-left: 8px" @click="sellSubmit">确认</Button>
                </FormItem>
            </Form>
        </Modal>

    </div>

</template>
<script>
    import {
        getPart,
        updatePart
    } from '@/api/part'
    import {
        getPartType,
    } from '@/api/partType'
    import {
        getRepair,
    } from '@/api/repair'
    import {
        getOrder,
        updateOrder
    } from '@/api/order'
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    @Component()
    export default class Part extends Vue {
        columns = [{
                title: '零件名称',
                key: 'part_name'
            }, {
                title: '单价（元）',
                key: 'price',
                sortable: true
            }, {
                title: '零件类型',
                key: 'type_name',
                filters: [],
                filterMethod(value, row) {
                    return row.type_id == value
                }
            }, {
                title: '剩余数量',
                key: 'count',
                sortable: true
            },
            {
                title: '操作',
                key: 'action',
                width: 250,
                align: 'center',
                render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            on: {
                                click: () => {
                                    if (params.row.count) {
                                        this.sell(params.row)
                                    } else {
                                        this.$Message.warning('库存为0，不可出库！')
                                    }
                                }
                            }
                        }, '出库'),
                        h('span', ' '),
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
                        }, '删除'),
                    ]);
                }
            }
        ];
        page = 0;
        total = 2;
        partList = [];
        typeList = [];
        spinShow = true;
        Modal = false;
        showSell = false;
        form = {};
        sellRules = {
            title: [{
                validator: (rule, value, callback) => {
                    console.log(value)
                    if (value === '') {
                        callback(new Error('请输入出库量'));
                    } else if (!Number.isInteger(value - 0)) {
                        callback(new Error('库存须为正整数！'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }],
            count: [{
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入出库量'));
                    } else if (!Number.isInteger(value - 0)) {
                        callback(new Error('库存须为正整数！'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }]
        };
        sellForm = {

        };
        searchLoading = false;
        options = []
        rules = {
            part_name: [{
                required: true,
                message: '请输入零件名称！',
                trigger: 'blur'
            }],
            type_id: [{
                message: '请选择零件类型！',
                validator: (rule, value, callback) => {
                    if (!value) {
                        callback(new Error('请选择类型'));
                    } else {
                        callback();
                    }
                },
                trigger: 'change'
            }],
            price: [{
                validator: (rule, value, callback) => {
                    if (value == '') {
                        callback(new Error('请输入单价'));
                    } else if (!(value > 0)) {
                        callback(new Error('单价须为正数!'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }],
            count: [{
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入库存'));
                    } else if (!Number.isInteger(value - 0) || value < 0) {
                        callback(new Error('库存须为非负整数！'));
                    } else {
                        callback();
                    }
                },
                trigger: 'blur'
            }]
        }

        changePage(page) {
            this.page = page - 1
            this.spinShow = true
            this.fetchData()
        }

        edit(row) {
            if (row.id) {
                this.form.id = row.id
            }
            this.form.part_name = row.part_name
            this.form.price = row.price
            this.form.count = row.count
            this.form.type_id = row.type_id
            this.Modal = true
        }
        del(row) {
            this.$Modal.confirm({
                title: '提示',
                render: (h) => {
                    return h('p', `确定删除“${row.part_name}”？`)
                },
                onOk: () => {
                    updatePart({
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
        sell(row) {
            this.sellForm.part_id = row.id;
            this.sellForm.count = '';
            this.showSell = true
        }
        submit() {
            var vm = this
            this.$refs['Form'].validate(async (valid) => {
                if (valid) {
                    this.$Message.success((await updatePart(vm.form)).data.msg)
                    this.Modal = false
                    this.fetchData()
                }
            })
        }
        sellSubmit() {
            var vm = this
            this.$refs['SellForm'].validate(async (valid) => {
                if (valid) {
                    var data = {
                        repair_id: vm.sellForm.title,
                        part_id: vm.sellForm.part_id,
                        count: vm.sellForm.count
                    }
                    this.$Message.success((await updateOrder(data)).data.msg)
                    this.showSell = false
                    this.fetchData()
                }
            })
        }
        visibleChange(status) {
            if (!status) {
                this.$refs['Form'].resetFields()
            }

        }
        sellvisibleChange(status) {
            if (!status) {
                this.$refs['SellForm'].resetFields()
            }

        }
        async fetchData() {
            const res = await getPart({
                page: this.page
            })
            this.partList = res.data.data
            this.total = res.data.total
            setTimeout(() => {
                this.spinShow = false
            }, 100)

        };
        async selectRepairTitle(query) {
            this.options = (await getRepair({title: query})).data.data.map(item => {
                return {
                    value: item.id,
                    label: `${item.title}（${item.id}）`
                }
            })
        }

        async created() {
            this.typeList = (await getPartType()).data.data.map(item => {
                return {
                    value: item.id,
                    label: item.type_name
                }
            })
            this.columns.find(item => item.key == 'type_name').filters = [...this.typeList]
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