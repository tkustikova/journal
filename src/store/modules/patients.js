import RequestApi from "../../modules/requestApi";
/**
 * Фильтры рейсов
 */
const state = {
    //список пациентов
    patientList:[]
};

const mutations = {
    //установка списка пациентов
    SET_PATIENT_LIST(state, val) {
        state.patientList =  val;
    },
    //чистка списка пациентов
    CLEAR_PATIENT_LIST (state) {
        state.patientList = [];
    }
};

const getters = {
    // список пациентов
    patientList: state => {
        return state.patientList;
    },
    //пациент по id
    patientById: state => id => {
        return state.patientList.find(patient => patient._id === id)
    }
};

const actions = {
    //получить пациентов
    getPatientList({ commit }) {
        const url = 'patients';
        const method = "GET";
        return RequestApi.request({ additional: { url, method }})
            .then(patinets => commit("SET_PATIENT_LIST", patinets));
    },
    //добавить пациента
    addPatient({ dispatch }, params) {
        const url = 'patients/add';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(patients => dispatch("getPatientList", patients));
    },
    //удалить пациента
    delPatient({ dispatch }, params) {
        const url = 'patients/del';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(patients => dispatch("getPatientList", patients));
    },
    //редактировать пациента
    editPatient({ dispatch }, params) {
        const url = 'patients/edit';
        return RequestApi.request({ body: params, additional: { url,  showErr: true }})
            .then(patients => dispatch("getPatientList", patients));
    },
    //обновление списка пациентов
    updatePatientList({getters, commit}, list) {
        if (!getters.patientList.length) {
            commit("SET_PATIENT_LIST", list)
        } else {
            let patient = getters.patientList;
            list.map(item => {
                const index = patient.findIndex(patient => patient._id === item._id);
                if (index !== -1) {
                    patient.splice(index, 1, { ...item });
                } else {
                    patient.push(item);
                }
            });

            commit("SET_PATIENT_LIST", patient) ;
        }
    }

};

export default {
    state,
    mutations,
    getters,
    actions
};