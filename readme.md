# 社区交友实战
## 1、引入官方css，自定义图标，animate.css动画库

- ```
  1、新建common目录
  2、粘贴uni.css
  3、在App.vue
  @import "./common/uni.css";
  ```

- ```
  iconfont字体图标引入
  ```

- ```
  animate.css引入
  1、引入到common目录
  2、在App.vue导入
  	@import "./common/animate.css";
  ```

## 2、设置全局GlobalStyle(微信小程序也有)

```
//uni-app目录简介
┌─components            uni-app组件目录
│  └─comp-a.vue         可复用的a组件
├─hybrid                存放本地网页的目录，详见
├─platforms             存放各平台专用页面的目录，详见
├─pages                 业务页面文件存放的目录
│  ├─index
│  │  └─index.vue       index页面
│  └─list
│     └─list.vue        list页面
├─static                存放应用引用静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
├─wxcomponents          存放小程序组件的目录，详见
├─main.js               Vue初始化入口文件
├─App.vue               应用配置，用来配置App全局样式以及监听 应用生命周期
├─manifest.json         配置应用名称、appid、logo、版本等打包信息，详见
└─pages.json            配置页面路由、导航条、选项卡等页面类信息，详见
```

```
pages.json 文件用来对 uni-app 进行全局配置，决定页面文件的路径、窗口样式、原生的导航栏、底部的原生tabbar 等。

它类似微信小程序中app.json的页面管理部分。注意定位权限申请等原属于app.json的内容，在uni-app中是在manifest中配置。
```

```
在\pages.json中配置globalStyle样式
{
"globalStyle": {
		"navigationBarTextStyle": "black",
		"navigationBarTitleText": "社区交友",
		"navigationBarBackgroundColor": "#FFF",
		"backgroundColor": "#F8F8F8"
	}
}
```

## 3、底部导航栏开发

```
"tabBar":{
		"color":"#323232",
		"selectedColor":"ED6384",
		"backgroundColor":"#FFFFFF",
		"borderStyle":"black",
		"list":[
			{
				"pagePath":"pages/index/index",
				"iconPath":"static/tabbar/index.png",
				"selectedIconPath":"static/tabbar/indexed.png",
				"text":"首页"
			
			},
			{
				"pagePath":"pages/news/news",
				"iconPath":"static/tabbar/news.png",
				"selectedIconPath":"static/tabbar/newsed.png",
				"text":"动态"
			
			},
			{
				"pagePath":"pages/msg/msg",
				"iconPath":"static/tabbar/paper.png",
				"selectedIconPath":"static/tabbar/papered.png",
				"text":"消息"
			
			},
			{
				"pagePath":"pages/my/my",
				"iconPath":"static/tabbar/home.png",
				"selectedIconPath":"static/tabbar/homeed.png",
				"text":"我的"
			
			}
		]
		
	}
```

## 4、index页面的配置(配置的是搜索框，和右边的发帖图标)

<img src="./mdimage/index-search.jpg" >

```
用于设置每个页面的状态栏、导航条、标题、窗口背景色等。
页面中配置项会覆盖 globalStyle 中相同的配置项
{
"pages":[
        {
			"path": "pages/index/index",
			"style": {
				"app-plus":{
					//导航栏配置
					"titleNView":{
						//搜索框配置
						"searchInput":{
							"align":"center",
							"backgroundColor":"#F5F4F2",
							"borderRadius":"4px",
							"disabled":true,
							"placeholder":"搜索帖子",
							"placeholderColor":"#6D6C67"
						},
						//配置右边的发帖图标
						"buttons":[{
							"color":"#333333",
							"colorPressed":"#FD597c",
							"float":"right",
							"fontSize":"20px",
							"fontSrc":"/static/iconfont.ttf",
							"text":"\ue668"
						}]
						
					}
				}
			}
		}
	]
}
```

## 5、common-list组件封装

![common-list](./mdimage/common-list.jpg)

```
1、html+css写样式
2、借鉴：bootstrap，可以将一些经常使用的样式封装成一个.css文件
例如：
/*内外边距*/
.p-2{
	padding: 20rpx;
}
/*flex布局*/
.flex {
	display: flex;
}
.align-center{
	align-items: center;
}
.justify-between{
	justify-content: space-between;
}
3、循环：因为uni-app用的是vue的语法，所以是v-for循环遍历，但是外面套的确实小程序的表情<block></block>
4、父组件给子组件传值
	1、先将子组件导入进来	import  from '...'
	2、在export default {
		components:{X}
	}
	3、父组件将需要传递的值通过:item="item"<common-list :item="item" :index="index"></common-list>
5、子组件接收父组件传递过来的值,以这种形式接收
export default{
	props:{
		item: {
				type: Object,
				default () {
					return {};
				}
			},
	}
}
```

## 6、全局分割线，封装成组件

1、组件

```vue
<template>
	<view class="divider"></view>
</template>

<script>
</script>

<style>
	.divider{
		height: 15rpx;
		background-color: #F5F5F4;
	}
</style>
```

2、在main.js中全局引入

```js
//引入全局组件
import divider from './components/commom/divider.vue';
Vue.component('divider',divider)
```

## 7、优化列表，添加动画特效

```html
<!--
动画是根据小程序的hover-class点击动态效果，而不是根据vue的transition标签的

动画名要添加到hover-class
https://blog.csdn.net/weixin_34018202/article/details/88604769-->

<view class="flex align-center justify-center flex-1 animated faster" hover-class="rubberBand">
</view>

```

## 8、给头像，分享等图标添加跳转

```
//标签添加@click事件
@click="openSpace"
methods:{
	openSpace(){
		console.log('打开个人空间')
	}
}
```

## 9、关注功能开发：分析，给数据里面的isFollow的值改为false即可

```
1、common-list组件中：想要修改isFollow的值是不行的，因为数据是父组件传递给子组件props的，所以要让子组件把数据传递给父组件
2、子组件methods中：this.$emit('follow',this.index)，将follow事件发射出去，并且发射出当前索引值
3、父组件接收：<common-list @follow="follow"></common-list>
4、在父组件methods中去修改isFollow的值
follow(e) {
				this.list[e].isFollow = true
				uni.showToast({
					title: '关注成功'
				})
			}
```

## 10、顶踩功能

## 11、顶部tab导航开发

## 12、滑动选项卡

## 13、上拉加载