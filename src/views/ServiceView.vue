<template>
    <layout>
        <template slot="toolbar">
            <v-layout justify-content-space-between>
                <filter-field @setFilterStr="setFilterStr"
                              :height="36"
                              class="align-self-center justify-end"
                              placeholder="Название услуги"></filter-field>
            </v-layout>
        </template>
        <template slot="content">
            <v-layout wrap align-content-start>
                <v-flex xs12>
                    <router-view :service_id="serviceId"></router-view>
                </v-flex>
            </v-layout>
        </template>
    </layout>
</template>

<script>
    import Layout from "../components/layout/Layout";
    import FilterField from "../components/filter/FilterField";

    export default {

        name: "ServiceView",

        components:{
            Layout,
            FilterField
        },

        data:() => ({
            loaded: false
        }),

        computed: {
            serviceId() {
                return this.$route.params.id || this.$store.getters.serviceById && this.$store.getters.serviceById._id;
            }
        },

        methods:{
            init() {
                this.loaded = false;
                this.$store.dispatch("getServiceList")
                    .finally(() => this.loaded = true);
            },

            setFilterStr(val){
                this.$store.commit("SET_WORD_FILTER", val);
            }
        },

        created() {
            this.init();
        }
    }

</script>