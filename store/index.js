import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		// 登录
		loginStatus:false,
		user:{
			token:''
		}
	},
	mutations:{
		login(state,user){
			state.loginStatus= true;
			state.user = user
			uni.setStorageSync('user',JSON.stringify(user))
		},
		// 初始化登录状态
		initUser(state){
			let user =  uni.getStorageSync('user')
			if(user){
				state.user = JSON.parse(user)
				state.loginStatus = true
			}
		},
		//退出登录
		logout(state){
			state.loginStatus = false
			state.user = {}
			uni.clearStorageSync('user')
		}
	}
})