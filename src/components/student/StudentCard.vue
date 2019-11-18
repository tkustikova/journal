<template>
    <Card :title="'Пациент'"
          :item="student"></Card>
</template>

<script>
    import Card from "../common/card/Card"

    export default {
        name: "StudentCard",

        components: {
            Card
        },


        props: {
            student_id:{
                type: String,
                required: true
            }
        },

        computed: {
            //преобразование объекта пациента в представление для карточки пациента
            student() {
                const user = this.$store.getters.studentById(this.student_id);
                const prepairUser = {

                };

                prepairUser.Имя = user.firstName;
                prepairUser.Фамилия = user.lastName;
                prepairUser.Обращение = user.issue;
                prepairUser.Адрес = user.address;
                prepairUser.Телефон = user.phone;

                return prepairUser;
            }
        }
    };
</script>