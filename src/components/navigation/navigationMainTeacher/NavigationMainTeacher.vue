<template>
    <navigation-add :nav_list="items"></navigation-add>
</template>

<script>
    import NavigationAdd from "../navigationAdd/NavigationAdd";

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
                        title: "Врачи",
                        route: { name: "teachers" },
                        active: this.$route.name === "teachers"
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
