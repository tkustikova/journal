<template>
    <v-form class="auth"
            v-model="authForm.valid"
            @keyup.native.enter="submit">
        <v-flex align-self-center xs4 sm2 md1>
            <h2 class="h2-auth">BeautyClinic</h2>
        </v-flex>
        <v-flex class = "auth__form-header font-weight-bold text-xs-center">Вход в личный кабинет</v-flex>
        <v-layout justify-center>
            <v-flex xs12>
                <label class = "auth__label">Логин</label>
                <v-text-field v-model="authForm.login"
                              :rules="rules.login"
                              :height = "42"
                              class = "auth__input-field"
                              solo
                              placeholder="Введите логин"></v-text-field>
                <v-layout>
                    <v-flex text-xs-left>
                        <label class = "user-auth__label">Пароль</label>
                    </v-flex>
                </v-layout>
                <v-text-field v-model="authForm.password"
                              :rules="rules.password"
                              :height = "42"
                              class = "auth__input-field"
                              solo
                              type="password"
                              placeholder="Введите пароль"></v-text-field>
                <v-layout justify-center>
                    <v-flex xs12>
                        <v-btn :disabled="!authForm.valid"
                               dark
                               @click="auth"
                               class = "auth__auth-btn primary text--white"
                               id = "auth-btn"
                               block>Войти</v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-form>
</template>

<script>
    import "./auth.css";

    export default {
        name: "Auth",

        components: {},

        props: {},

        data: () => ({
            //содержимое формы авторизации
            authForm: {
                login: "",
                password: "",
                valid: false,
            },
            //правила валидации полей
            rules: {
                login: [v => !!v || ""],
                password: [
                    v => !!v || "",
                    v =>
                        v.search(/[а-яА-ЯёЁ]/g) === -1 || "в пароле не должно быть кириллицы"
                ]
            },
        }),

        created() {
            this.init();
        },

        methods: {
            //шлем запрос серверу на проверку сессии если сессия есть авторизуем без логина и пароля
            init(){
                this.$store.dispatch("getSessionUser")
                    .then(this.goHome)
                    .catch(this.clearStore);
            },
            //очистка хранилища
            clearStore(){
                this.$store.dispatch("clearStore");
            },

            //авторизация
            auth() {
                const { login, password } = this.authForm;

                this.$store.dispatch("logIn", { login, password })
                    .then(this.goHome)
            },

            goHome(){
                this.$router.push("/");
            }
        }
    };
</script>
