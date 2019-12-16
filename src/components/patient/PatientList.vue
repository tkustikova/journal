<template>
    <v-layout wrap align-content-start>
        <v-flex xs12 class = "py-2 text-xs-center"><h2>Пациенты</h2></v-flex>
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
                    no-data-text="">
                <template slot="items"
                          slot-scope="props">
                    <tr class="pointer">
                        <td class="">{{ props.item.name }}</td>
                        <td class="">{{ props.item.serviceName }}</td>
                        <td class="">{{ props.item.year.slice(0,10) }}</td>
                        <td class="">{{ props.item.doctorName }}</td>
                        <td>
                            <tool-tip-btn :round="true"
                                          @click="startEditPatient(props.item)"
                                          data-prevent
                                          active_icon = "edit"
                                          active_text = "Редактировать"
                                          :active = "form.open"
                                          class="ma-0 mr-1"></tool-tip-btn>
                            <tool-tip-btn :round="true"
                                          @click="removePatient(props.item._id)"
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
                        <span class="headline">Данные пациента</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-text-field label="ФИО пациента"
                                                  required
                                                  :rules="rules.name"
                                                  v-model="form.data.name"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-select label="Выберите услугу"
                                              v-model="form.data.service"
                                              :items="serviceList"
                                              item-text="name"
                                              item-value="_id"
                                              required
                                              return-object
                                              single-line></v-select>
                                </v-flex>
                                <v-flex xs12>
                                    <v-select v-model="form.data.doctor"
                                              :items="userList"
                                              item-text="lastName"
                                              item-value="_id"
                                              label="Выберите лечащего врача"
                                              required
                                              return-object
                                              single-line></v-select>
                                </v-flex>
                                <v-flex xs12>
                                    <v-menu
                                            ref="menu"
                                            v-model="form.datePicker"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            :return-value.sync="form.data.year"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                    v-model="form.data.year"
                                                    label="Выберите дату приема"
                                                    prepend-icon="event"
                                                    readonly
                                                    :rules="rules.name"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="form.data.year" no-title scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="form.datePicker = false">Cancel</v-btn>
                                            <v-btn flat color="primary" @click="$refs.menu.save(form.data.year)">OK</v-btn>
                                        </v-date-picker>
                                    </v-menu>
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
    import {roles} from "../../modules/constant";


    export default {
        name: "PatientList",

        components:{
            InfiniteLoading,
            NavigationNotFound,
            ToolTipBtn
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
            notFound:{
                text: "Пациенты не найдены",
                advice: null
            },
            form: {
                open: false,
                valid: false,
                datePicker: false,
                data: {
                    name: "",
                    service: "",
                    year: new Date().toISOString().substr(0, 10),
                    doctor: ""
                }
            },
            rules: {
                name: [v => !!v || ""]
            },
        }),

        computed: {
            /**
             * список пациентов
             * @returns {default.computed.flightList|(function())|getters.flightList|Array}
             */
            list(){
                return this.$store.getters.patientList;
            },
            /**
             * список пациентов с учетом фильтров
             * @returns {*}
             */
            filtredList(){
                return this.list
                    .filter(patient => patient.name.indexOf(this.filterWord) !== -1);
            },


            /**
             * список пациентов с учетом пагинации
             */

            resultList(){
                return this.filtredList
                    .slice(0, this.pageLength * this.flightListPage < this.list.length ?
                        this.pageLength * this.flightListPage : this.list.length)
                    .map(item => {
                        const service = this.$store.getters.serviceById(item.service);
                        const doctor = this.$store.getters.userById(item.doctor);
                        if (service && doctor) {
                            const doctorName = doctor.firstName+ " " + doctor.lastName;
                            const serviceName = service.name;
                            return { ...item, serviceName, doctorName};
                        }

                        return item;

                    })
            },
            /**
             * список пользователей кроме собственника журнала и админов
             */
            serviceList() {
                return (this.form.data.service ?
                    this.$store.getters.serviceList.filter(item => item._id !== this.form.data.service) :
                    this.$store.getters.serviceList);
            },
            userList() {
                return (this.form.data.doctor ?
                    this.$store.getters.userList.filter(item => item._id !== this.form.data.doctor) :
                    this.$store.getters.userList)
                    .filter(item => item.role !== roles.ADMIN);
            },
            filterWord(){
                return this.$store.getters.filterWord;
            },

            //конфигурация таблицы
            headers(){
                return(
                    [
                        { text: "ФИО пациента", align: "left", value: "name", sortable: true },
                        { text: "Услуга", align: "left", value: "service", sortable: true },
                        { text: "Дата приема", align: "left", value: "year", sortable: true },
                        { text: "Лечащий врач", align: "left", value: "doctor", sortable: true },
                        { text: "", align: "right", value: "", sortable: false }
                    ]
                )
            }
        },

        methods: {
            /**
             * запрос списка пациентов
             */
            init(){
                this.loaded = false;
                this.$store.dispatch("getPatientList").then(() =>this.loaded = true);
            },
            /**
             * обработка подгрузки
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
                        this.addPatient();
                    } else {
                        this.editPatient();
                    }
                }
            },
/*
            addPatient: function () {
                const {name, service, doctor} = this.form.data;
                this.$store.dispatch("addPatient", {name, service, doctor})
                    .then(this.cancel);
            },
            */
            addPatient: function () {
                this.$store.dispatch("addPatient",
                    {
                        ...this.form.data,
                        year: new Date(this.form.data.year)
                    })
                    .then(this.cancel);
            },
/*
            editPatient() {
                this.$store.dispatch("editPatient", { ...this.form.data })
                    .then(this.cancel);
            },
*/
            editPatient() {
                this.$store.dispatch("editPatient",
                    {
                        ...this.form.data,
                        year: new Date(this.form.data.year),
                        _id: this.form._id
                    })
                    .then(this.cancel);
            },

            removePatient(id) {
                this.$store.dispatch("delPatient", { id });
            },

            startEditPatient({ name,service, year, doctor, _id }) {
                this.openForm();
                let data = this.form.data;
                data.name = name;
                data.service = service;
                data.year = new Date(year).toISOString().substr(0, 10);
                data.doctor = doctor;
                this.form._id = _id;
            }
        }
    };
</script>
