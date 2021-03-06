import Vue from "vue";
import Vuex from "vuex";
import CreatePersistedState from "vuex-persistedstate";

import filters from "./modules/filters";
import navigation from "./modules/navigation";
import popup from "./modules/popup";
import auth from "./modules/auth";
import users from "./modules/users";
import journals from "./modules/journals";
import services from "./modules/services";
import patients from "./modules/patients";



Vue.use(Vuex);

const common = {
    //очистка хранилища
    actions:{
        clearStore({ commit }){
            commit("CLEAR_USER_LIST");
            commit("CLEAR_PATIENT_LIST");
            commit("CLEAR_JOURNAL_LIST");
            commit("CLEAR_SERVICE_LIST");
        }
    }
};

export default new Vuex.Store({
    plugins: [
        // записывает в localStorage состояния из store
        CreatePersistedState({
            paths: [
                "filters.filters.distId",
                "filters.filters.delay"
            ]
        })
    ],

    modules: {
        filters,
        navigation,
        popup,
        auth,
        users,
        patients,
        journals,
        services,
        common
    }
});
