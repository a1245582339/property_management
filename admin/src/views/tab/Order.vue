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

    </div>

</template>
<script>
    import {
        getOrder,
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
                title: '报修标题',
                key: 'title',
                sortable: true
            }, {
                title: '报修id',
                key: 'repair_id',
            }, {
                title: '出库量',
                key: 'count',
                sortable: true
            },
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
                    var res = await updateOrder(data)
                    if (res.data.code == 20000) {
                        this.$Message.success(res.data.msg)
                        this.showSell = false
                        this.fetchData()
                    } else {
                        
                    }
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
        }
    }
</style>