<template>
	<view>
		<!-- 未登录 -->
		<template v-if="!loginStatus">
			<view class="flex align-center justify-center py-2 font">
				登陆社区，体验更多功能
			</view>
			<other-login></other-login>
			<view class="flex align-center justify-center py-2 font text-secondary" @click="openLogin">
				账号/邮箱/手机登录<text class="ml-1 iconfont icon-jinru"></text>
			</view>
		</template>
		<!-- 已登录 -->
		<view v-else class="flex align-center p-2" hover-class="bg-light">
			<image :src="avatar" style="width: 100rpx;height: 100rpx;" class="rounded-circle"></image>
			<view class="flex flex-column flex-1 px-2">
				<text class="font-lg font-weight-bold text-dark">{{user.username}}</text>
				<text class="font text-muted">总帖子10 今日发帖0</text>
			</view>
			<text class="iconfont icon-jinru"></text>
		</view>

		<view class="flex align-center px-3 py-2">
			<view class="flex-1 flex flex-column align-center justify-center" v-for="(item,index) in myData" :key="index">
				<text class="font-lg font-weight-bold">{{item.num}}</text>
				<text class="font text-muted">{{item.name}}</text>
			</view>
		</view>

		<view class="px-3 py-2">
			<image src="/static/demo/banner1.jpg" mode="aspectFill" style="height: 170rpx;width: 100%;" class="rounded"></image>
		</view>

		<uni-list-item title="浏览历史" showExtraIcon>
			<text slot="icon" class="iconfont icon-liulan"></text>
		</uni-list-item>
		<uni-list-item title="社区认证" showExtraIcon>
			<text slot="icon" class="iconfont icon-huiyuanvip"></text>
		</uni-list-item>
		<uni-list-item title="审核帖子" showExtraIcon>
			<text slot="icon" class="iconfont icon-keyboard"></text>
		</uni-list-item>

	</view>
</template>

<script>
	import uniListItem from '@/components/uni-ui/uni-list-item/uni-list-item.vue';
	import otherLogin from '@/components/common/other-login.vue';
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			uniListItem,
			otherLogin
		},
		computed: {
			...mapState(['loginStatus', 'user']),
			//用户头像
			avatar() {
				return this.user.userpic ? this.user.userpic : '/static/default.jpg'
			}
		},
		data() {
			return {
				myData: [{
					name: "帖子",
					num: 1
				}, {
					name: "动态",
					num: 1
				}, {
					name: "评论",
					num: 2
				}, {
					name: "粉丝",
					num: 0
				}]
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '../user-set/user-set'
			});
		},
		methods: {
			//打开登陆页
			openLogin() {
				uni.navigateTo({
					url: '../login/login'
				})
			}
		}
	}
</script>

<style>

</style>
