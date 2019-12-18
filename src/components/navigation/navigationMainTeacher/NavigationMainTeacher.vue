<template>
    <navigation-add :nav_list="items"></navigation-add>
</template>

<script>
    import NavigationAdd from "../navigationAdd/NavigationAdd";
    import "./navigationMainTeacher.css"

    export default {
        name: "NavigationMainTeacher",

        components: {
            NavigationAdd
        },

        data: () => ({}),

        computed: {
            // объект с навигацией на главной вкладке админа
            items() {
                return [
                    {
                        title: "Мастера",
                        route: { name: "teachers" },
                        active: this.$route.name === "teachers"
                    },
                    {
                        title: "Клиенты",
                        route: { name: "patients" },
                        active: this.$route.name === "patients"
                    },
                    {
                        title: "Журналы",
                        route: { name: "journals" },
                        active: this.$route.name === "journals"
                    },
                    {
                        title: "Услуги",
                        route: {name: "services" },
                        active: this.$route.name === "services"
                    }
                ]
            },
        },
    };
</script>
