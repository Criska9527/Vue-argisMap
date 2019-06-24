import Vue from "vue"
import Vuex from 'vuex'

Vue.use(Vuex)
const state={   //要设置的全局访问的state对象
    maptype: '矢量图',
    map:null
    //要设置的初始属性值
};
const mutations = {
    changetype(state,maptype) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
        if(maptype=="矢量图"){
            this.state.maptype="影像图"
        }else if(maptype=="影像图"){
            this.state.maptype="矢量图"
        }
    },
    changemap(state,map){
        this.state.map=map
        console.log(this.state.map)
        console.log(this.state.map.getLayer('base'))
    }
};
const actions = {
    sendmap(context,map) {
        context.commit('changemap',map)
    }
}
export default new Vuex.Store({
    state,
    actions,
    mutations,
    
 
})