<template>
	<view>
		
		<!-- 顶部选项卡 -->
		<scroll-view scroll-x :scroll-into-view="scrollInto" scroll-with-animation
		class="scroll-row border-bottom border-light-secondary" 
		style="height: 100rpx;">
			<view v-for="(item,index) in tabBars" :key="index" 
			class="scroll-row-item px-3 py-2 font-md" :id="'tab'+index"
			:class="tabIndex === index?'text-main font-lg font-weight-bold':''"
			@click="changeTab(index)">{{item.classname}}</view>
		</scroll-view>
		
		<swiper :duration="150" :current="tabIndex" @change="onChangeTab"
		:style="'height:'+scrollH+'px;'">
			<swiper-item v-for="(item,index) in newsList" :key="index">
				<scroll-view scroll-y="true" :style="'height:'+scrollH+'px;'"
				@scrolltolower="loadmore(index)">
				
					<template v-if="item.list.length > 0">
						<!-- 列表 -->
						<block v-for="(item2,index2) in item.list" :key="index2">
							<!-- 列表样式 -->
							<common-list :item="item2" :index="index2" @follow="follow" @doSupport="doSupport"></common-list>
							<!-- 全局分割线 -->
							<divider></divider>
						</block>
						<!-- 上拉加载 -->
						<load-more :loadmore="item.loadmore"></load-more>
					</template>
					<!-- 加载中 -->
					<template v-else-if="!item.firstLoad">
						<view class="text-light-muted flex align-center justify-center font-md" style="height: 200rpx;">加载中...</view>
					</template>
					<!-- 无数据 -->
					<template v-else>
						<no-thing></no-thing>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
		
		
		
	</view>
</template>

<script>
	import commonList from '@/components/common/common-list.vue';
	import loadMore from '@/components/common/load-more.vue';
	export default {
		components: {
			commonList,
			loadMore
		},
		data() {
			return {
				// 列表高度
				scrollH:600,
				// 顶部选项卡
				scrollInto:"",
				tabIndex:0,
				tabBars: [],
				newsList:[]
			}
		},
		// 监听点击导航栏搜索框
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: '../search/search?type=post',
			})
		},
		// 监听导航按钮点击事件
		onNavigationBarButtonTap() {
			this.navigateTo({
				url: '../add-input/add-input',
			})
		},
		onLoad() {
			uni.getSystemInfo({
				success:res=>{
					this.scrollH = res.windowHeight - uni.upx2px(101)
				}
			})
			// 根据选项生成列表
			this.getData()
		},
		methods: {
			// 获取数据
			getData(){
				// 获取分类
				this.$H.get('/postclass').then(res=>{
					this.tabBars = res.list
					// 根据分类生成列表
					var arr = []
					for (let i = 0; i < this.tabBars.length; i++) {
						// 生成列表模板
						arr.push({
							// 1.上拉加载更多  2.加载中... 3.没有更多了
							loadmore:"上拉加载更多",
							list:[],
							page:1,
							firstLoad:false
						})
					}
					this.newsList = arr
					// 获取第一个分类的数据
					if (this.tabBars.length) {
						this.getList()
					}
				})

			},
			// 获取指定分类下的列表
			getList(){
				let index = this.tabIndex
				let id = this.tabBars[index].id
				let page = this.newsList[index].page
				let isrefresh = page === 1
				this.$H.get('/postclass/'+id+'/post/'+page)
				.then(res=>{
					let list = res.list.map(v=>{
						return this.$U.formatCommonList(v)
					})

					this.newsList[index].list = isrefresh ? list : [...this.newsList[index].list,...list];
					
					this.newsList[index].loadmore  = list.length < 10 ? '没有更多了' : '上拉加载更多';
					
					if (isrefresh) {
						this.newsList[index].firstLoad = true
					}
				}).catch(err=>{
					if(!isrefresh){
						this.newsList[index].page--;
					}
				})
			},
			// 监听滑动
			onChangeTab(e){
				this.changeTab(e.detail.current)
			},
			// 切换选项
			changeTab(index){
				if (this.tabIndex === index) {
					return;
				}
				this.tabIndex = index
				// 滚动到指定元素
				this.scrollInto = 'tab'+index
				// 获取当前分类下的列表数据
				if (!this.newsList[this.tabIndex].firstLoad) {
					this.getList()
				}
			},
			// 关注
			follow(e){
				// 拿到当前的选项卡对应的list
				let list = this.newsList[this.tabIndex].list
				list[e].isFollow = true
				uni.showToast({ title: '关注成功' })
			},
			// 顶踩操作
			doSupport(e){
				// 拿到当前的选项卡对应的list
				let list = this.newsList[this.tabIndex].list
				// 拿到当前对象
				let item = list[e.index]
				let msg = e.type === 'support' ? '顶' : '踩'
				// 之前没有操作过
				if (item.support.type === '') {
					item.support[e.type+'_count']++
				} else if (item.support.type ==='support' && e.type === 'unsupport') {
					// 顶 - 1
					item.support.support_count--;
					// 踩 + 1
					item.support.unsupport_count++;
				} else if(item.support.type ==='unsupport' && e.type === 'support'){ 					// 之前踩了
					// 顶 + 1
					item.support.support_count++;
					// 踩 - 1
					item.support.unsupport_count--;
				}
				item.support.type = e.type
				uni.showToast({ title: msg + '成功' });
			},
			// 上拉加载更多
			loadmore(index){
				// 拿到当前列表
				let item = this.newsList[index]
				// 判断是否处于可加载状态（上拉加载更多）
				if (item.loadmore !== '上拉加载更多') return;
				// 修改当前列表加载状态
				item.loadmore = '加载中...'
				// 请求数据
				item.page++;
				this.getList()
			}
		}
	}
</script>

<style>
	
</style>
