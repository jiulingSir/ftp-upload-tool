import * as types from './types.js'

export default {
    UserLogin({ commit }, data){
        commit(types.LOGIN, data);
    },
    UserLogout({ commit }){
        commit(types.LOGOUT);
    },
    UserName({ commit }, data){
        commit(types.USERNAME, data);
    },
    setSelectedList ({ commit }, selectedList) {
      commit(types.SET_SELECTED_LIST, selectedList)
    }
}
