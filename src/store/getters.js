import * as types from './types.js'

const getters = {

    getUserName: (state) => {
        //把用户名存起来
        return state.username;
    }
};

export default getters;