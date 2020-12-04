import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations.js'
import getters from './getters.js'
import actions from './actions.js'

Vue.use(Vuex);

//初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录
const state = {
    token: window.sessionStorage.getItem('token'),
    username: window.sessionStorage.getItem('username'),
    selectedList: [], // 当前选中的文件列表
    currentDir: {} // 当前目录信息
};

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
});