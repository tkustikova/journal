import RequestApi from "../../modules/requestApi";
/**
 * Фильтры рейсов
 */
const state = {
    //список услуг
    serviceList:[]
};

const mutations = {
    //установка списка услуг
    SET_SERVICE_LIST(state, val) {
        state.serviceList =  val;
    },
    //чистка списка услуг
    CLEAR_SERVICE_LIST (state) {
        state.serviceList = [];
    }
};

const getters = {
    // список услуг
    serviceList: state => {
        return state.serviceList;
    },
    // услуга по id
    serviceById: state => id => {
        return state.serviceList.find(service => service._id === id)
    }
};

const actions = {
    //получить услуги
    getServiceList({ commit }) {
        const url = 'services';
        const method = "GET";
        return RequestApi.request({ additional: { url, method }})
            .then(services => commit("SET_SERVICE_LIST", services));
    },
    //добавить услугу
    addService({ dispatch }, params) {
        const url = 'services/add';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(services => dispatch("getServiceList", services));
    },
    //удалить услугу
    delService({ dispatch }, params) {
        const url = 'services/del';
        return RequestApi.request({ body: params, additional: { url, showErr: true }})
            .then(services => dispatch("getServiceList", services));
    },
    //редактировать услугу
    editService({ dispatch }, params) {
        const url = 'services/edit';
        return RequestApi.request({ body: params, additional: { url,  showErr: true }})
            .then(services => dispatch("getServiceList", services));
    }
};

export default {
    state,
    mutations,
    getters,
    actions
};