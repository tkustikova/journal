<template>
    <v-layout wrap align-content-start>
        <v-flex xs12 class = "py-2 text-xs-center"><h2>Список услуг</h2></v-flex>
        <tool-tip-btn @click="form.open = !form.open"
                      active_icon = "add"
                      active_text = "Добавить"
                      :active = "form.open"
                      class="ma-0 mr-1"></tool-tip-btn>
        <v-flex v-if = "resultList.length || !loaded"
                xs12 >
            <v-layout>
            </v-layout>
            <v-data-table
                    dark
                    :headers="headers"
                    :items="resultList"
                    :loading = "!loaded"
                    hide-actions
                    must-sort
                    no-data-text=""
            >
                <template slot="items"
                          slot-scope="props">
                    <!--<tr @click="(e) => toTeacher(e, props.item._id)" -->
                        <tr class="pointer">
                        <td class="">{{ props.item.name }}</td>
                        <td class="">{{ props.item.cost }}</td>
                        <td>
                            <tool-tip-btn :round="true"
                                          @click="startEditService(props.item)"
                                          data-prevent
                                          active_icon = "edit"
                                          active_text = "Редактировать"
                                          :active = "form.open"
                                          class="ma-0 mr-1"></tool-tip-btn>
                            <tool-tip-btn :round="true"
                                          @click="removeUser(props.item._id)"
                                          data-prevent
                                          active_icon = "clear"
                                          active_text = "Удалить"
                                          :active = "false"
                                          class="ma-0 mr-1"></tool-tip-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
            <infinite-loading @infinite="infiniteHandler"
                              force-use-infinite-wrapper="body"
                              v-if = "resultList.length &&
                            resultList.length !== filtredList.length">
                <div slot="spinner">
                    <v-progress-circular indeterminate color="primary" :width="3"></v-progress-circular>
                </div>
            </infinite-loading>
        </v-flex>
        <navigation-not-found v-else
                              :text="notFound.text"
                              :advice = "notFound.advice"
                              :back_page_btn="false"></navigation-not-found>
        <v-dialog v-if="form.open" persistent v-model="form.open" max-width="500px">
            <v-card>
                <v-form v-model="form.valid" ref="form">
                    <v-card-title>
                        <span class="headline">Данные услуги</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field label="Название"
                                                  required
                                                  :rules="rules.name"
                                                  v-model="form.data.name"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field label="Стоимость"
                                                  required
                                                  :rules="rules.cost"
                                                  v-model="form.data.cost"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>*Обязательное поле</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="white primary--text" @click="cancel">Отмена</v-btn>
                        <v-btn color="primary" :disabled="!form.valid" @click="apply">Добавить</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import InfiniteLoading from "vue-infinite-loading";
    import NavigationNotFound from "../navigation/navigationNotFound/NavigationNotFound";
    import ToolTipBtn from "../common/toolTipBtn/ToolTipBtn";
    import { roles } from "../../modules/constant";

    export default {
        name: "ServiceList",

        components:{
            InfiniteLoading,
            NavigationNotFound,
            ToolTipBtn,
        },

        mounted(){
            this.init();
            //активируем скроллтоп
            this.$store.commit("SET_SCROLL_TOP", { active: true });
        },

        beforeDestroy(){
            //деактивируем скроллтоп
            this.$store.commit("SET_SCROLL_TOP");
        },

        updated(){
            //заставляем скроллтоп обновиться
            this.$store.commit("SET_NEED_UPDATE", true);
        },

        data: () => ({
            //признак того что загрузка завершена
            loaded: false,
            pageLength: 25,
            roles,
            notFound:{
                text: "Услуги не найдены",
                advice: null
            },
            form: {
                open: false,
                valid: false,
                data: {
                    name: "",
                    cost: "",
                    _id: ""
                }
            },
            rules: {
                name: [v => !!v || ""],
                cost: [v => !!v && v>0 || "Стоимость не должна быть меньше 0"]
            },
        }),

        computed: {
            /**
             * список услуг
             * @returns {default.computed.flightList|(function())|getters.flightList|Array}
             */
            list(){
                return this.$store.getters.userList;
            },
            /**
             * список услуг с учетом фильтров
             * @returns {*}
             */
            filtredList(){
                return this.list
                    .filter(teacher => teacher.firstName.indexOf(this.filterWord) !== -1);
            },
            /**
             * список услуг с учетом пагинации
             */
            resultList(){
                return this.filtredList
                    .slice(0, this.pageLength * this.flightListPage < this.list.length ?
                        this.pageLength * this.flightListPage : this.list.length);
            },
            filterWord(){
                return this.$store.getters.filterWord;
            },

            //конфигурация таблицы
            headers(){
                return(
                    [
                        { text: "Название", align: "left", value: "name", sortable: true },
                        { text: "Стоимость", align: "left", value: "cost", sortable: true },
                        { text: "Логин", align: "left", value: "login", sortable: false },
                        { text: "Пароль", align: "left", value: "password", sortable: false },
                        { text: "Должность", align: "left", value: "role", sortable: true },
                        { text: "", align: "right", value: "", sortable: false }
                    ]
                )
            }
        },

        methods: {
            /**
             * запрос списка врачей
             */
            init(){
                this.loaded = false;
                this.$store.dispatch("getUserList").then(() =>this.loaded = true);
            },
            /**
             * оьработка подгрузки
             * @param $state
             */
            infiniteHandler($state){
                if (this.paginationfiltredFlightList.length < this.filtredFlightList.length){
                    this.$store.commit("NEXT_FLIGHT_LIST_PAGE");
                    $state.loaded();
                } else {
                    $state.complete();
                }
            },
            /**
             * переход к списку журналов врача
             * @param e
             * @param id
             */
            toTeacher(e, id) {
                if (!e.target.closest('[data-prevent]')){
                    this.$router.push({ name: "idTeacher", params: { id } });
                }
            },

            clearForm() {
                this.$refs.form.reset();
            },

            closeForm() {
                this.form.open = false;
            },

            openForm() {
                this.form.open = true;
            },

            cancel(){
                this.clearForm();
                this.closeForm();
                this.form.data._id = "";
            },

            apply() {
                if (this.form.valid) {
                    if (!this.form.data._id) {
                        this.addUser();
                    } else {
                        this.editUser();
                    }
                }
            },

            addUser() {
                const role = this.form.mainTeacher ? roles.ADMIN : roles.TEACHER;
                const { firstName, lastName, login, password } = this.form.data
                this.$store.dispatch("addUser", { firstName, lastName, login, password, role })
                    .then(this.cancel);
            },

            editUser() {
                const role = this.form.mainTeacher ? roles.ADMIN : roles.TEACHER
                this.$store.dispatch("editUser", { ...this.form.data, role })
                    .then(this.cancel);
            },

            removeUser(id) {
                this.$store.dispatch("delUser", { id });
            },

            startEditService({ name, cost, _id }) {
                let data = this.form.data;
                data.name = name;
                data.cost = cost;
                data._id = _id;
                this.openForm();
            }
        }
    };
</script>
