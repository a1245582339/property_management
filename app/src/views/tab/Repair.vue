<template>
    <div>
        维修
    </div>
</template>
<script>
    import {
        Component,
        Prop,
        Vue,
    } from 'vue-property-decorator';
    import { getRepair, createRepair } from '@/api/repair'
    @Component
    export default class Main extends Vue {
        loading = true;
        fetchData() {

        }
        
    }
</script>
<style lang="scss" scoped>

</style>
