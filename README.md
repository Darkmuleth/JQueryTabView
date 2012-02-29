# JQueryTabView
**Copyright 2012, Darkmuleth**

一个简单的基于jQuery的选项卡插件。

项目：[JQueryTabView](https://github.com/Darkmuleth/JQueryTabView)

## 作者

**Name：**Darkmuleth

**Blog：**[http://blog.163.com/darkmuleth](http://blog.163.com/darkmuleth)

## 使用

**最简使用方法：**

1. 导入jQuery框架：

	~~~ html
	<script type="text/javascript" src="../jquery.js"></script>
	~~~

2. 导入JQueryTabView的CSS样式表和javascript脚本：

	~~~ html
	<link type="text/css" rel="Stylesheet" href="../jQueryTabViewStyle.css" />
	<script type="text/javascript" src="../JQueryTabView.js"></script>
	~~~

3. 在页面中准备一个HTML容器：

	~~~ html
	<div id="TabView" class="TabViews"></div>
	~~~

4. 编写以下脚本：

	``` html
	<script type="text/javascript">
	$(document).ready(function(){
		$("#TabView").JQueryTabView();
		// 或者
		//$(".TabViews").JQueryTabView();
	});
	</script>
	```

**使用自定义配置**

示例(初始时拥有两个选项卡)：

``` html
	<script type="text/javascript">
	$(document).ready(function(){
		$("#TabView").JQueryTabView({
			tabs: [{
					caption: "Button 1",
					active: true,
					onClick: function () { alert("Button 1 Click!"); },
					onClose: function () { alert("Button 1 Close!"); }
				},
				{
					image: "../TabImage.jpg",
					cssId: "Button2",
					caption: "Button 2",
					closable: false,
					width: 150,
					onClick: function () { alert("Button 2 Click !"); }
			}],
			tabHeight: 20,
			tabWidth: 65,
			moveOffset: 150,
			onReady: function(){ alert("Ready!"); }
		});
	});
	</script>
```

## 可用配置

**插件默认配置如下：**

``` javascript
	{
            /// 选项卡按钮对象(多个按钮用数组表示)
            tabs: {
                // 选项卡的CSS编号值(符合CSS命名规则的字符串)
                cssId: null,
                // 选项卡的CSS类值(符合CSS命名规则的字符串), 添加多个可用空格隔开
                cssClass: null,
                // 选项卡文本, 同时也是鼠标悬停时显示的内容
                caption: "Tab Button",
                // 选项卡的图像(值为图片的url,优先级高于caption,二者不会同时显示)
                image: null,
                // 选项卡的图标(值为图片的url)
                icon: null,
                // 选项卡的宽度(单位为px(像素))
                width: null,
                // 是否是激活的选项卡
                active: false,
                // 标识选项卡按钮的顺序(若相同,则按照该数组中的顺序)
                index: 9999,
                // 可以删除(将添加删除按钮), 布尔值,如果为null则按照tabClosable来配置
                closable: null,
                // 鼠标悬停在关闭按钮上时显示的提示文字
                closeMsg: null,
                /////////////////// 以下是事件设置 ////////////////////
                // 点击选项卡事件
                // function(api, event){}
                // api: 插件的api引用
                // event: jQuery的点击事件所传递的event对象
                onClick: null,
                // 关闭选项卡事件
                // 函数形式与点击事件相同
                onClose: null
            },
            /// 选项卡插件的名字
            name: "JQueryTabView",
            /// 默认激活的选项卡,其可以为以下值:
            ///     1.整数: 位置序号(从0开始计算)
            ///     2.字符串: 选项卡按钮的CSS的id选择器,必须以'#'字符串开头
            ///     3.字符串: 选项卡按钮的CSS的class选择器,必须以'.'字符串开头, 只激活第一个找到的匹配项
            ///     4.对象: 需要激活的选项卡的HTML DOM对象
            ///     5.对象: 需要激活的选项卡的jQuery对象
            active: null,
            /// 自动为选项卡添加CSS编号
            autoTabId: false,
            /// 选项卡的CSS编号值前缀(符合CSS命名规则的字符串), 只有在 autoTabId 为 true 时有效
            tabIdText: "JQueryTab_",
            /// 选项卡的CSS类值(符合CSS命名规则的字符串), 添加多个可用空格隔开
            tabCssClass: null,
            /// 选项卡的高度(单位为px(像素))
            tabHeight: 20,
            /// 选项卡的宽度(单位为px(像素))
            tabWidth: 91,
            /// 选项卡的最小高度(像素)
            tabMinHeight: 14,
            /// 选项卡的最小宽度(像素)
            tabMinWidth: 50,
            /// 选项卡默认可以删除
            tabClosable: true,
            /// 选项卡之间的横向距离(像素)
            spacing: 2,
            /// 可以滚动以显示过多的选项卡按钮
            scrollable: true,
            /// 选项卡按钮组移动时的步进距离(像素),只在scrollable为true时有效
            moveOffset: -100,
            /// 不同行的选项卡的行距(像素), 只在scrollable为false时有效
            lineHeight: 5,
            /// 选项卡的各种提示信息
            tabMessage: {
                Close: "关闭",
                Expansion: "展开",
                Shrink: "收起",
                Add: "添加新选项卡",
                AddText: "请输入新选项卡的名字",
                ScrollLeft: "双击移动到最左端",
                ScrollRight: "双击移动到最右端"
            },
            /// debug模式(开启后将向浏览器控制台打印信息)
            debug: false,
            /////////////////// 以下是事件设置 ////////////////////
            /// 所有选项卡按钮的默认'点击'事件; 若返回false, 则点击事件中断, 后续的点击操作将被忽略
            /// function(api, event){}
            /// api: 插件的api引用
            /// event: jQuery的点击事件所传递的event对象
            onTabClick: null,
            /// 所有选项卡按钮的默认'点击后'事件; 若返回false, 则关闭事件中断, 后续的关闭操作将被忽略
            /// (函数形式与'点击'事件相同, 下同)
            onTabClicked: null,
            /// 所有选项卡按钮的默认'关闭'事件
            onTabClose: null,
            /// 所有选项卡按钮的默认'关闭后'事件
            onTabClosed: null,
            /// 当使用'添加按钮'添加一个选项卡后触发, 返回false将可以阻止插件创建选项卡
            /// function(tab, api){}
            /// tab: 选项卡设置属性,利用这个对象可以构造一个选项卡,
            ///       点击添加按钮后在出现的文本框中输入的值将作为tab的caption属性值
            /// api: 插件的api引用
            onAddClick: null,
            /// 向左滚动事件
            onScrolledLeft: null,
            /// 向右滚动事件
            onScrolledRight: null,
            /// 控件结构开始初始化 事件
            onInit: null,
            /// 控件准备完毕 事件
            /// function(api){}
            /// api: 插件的api引用
            onReady: null
        }
```

## 接口函数

**JQueryTabView插件提供如下api：**

``` javascript
	api = {
                /// 获取当前插件对象在选项卡列表中的序号
                GetTabViewIndex: function(){},
                /// 获取选项卡插件的uid
				GetTabViewUID: function(){},
                /// 获取配置对象
                GetConfig: function(){},
                /// 启用或禁用滚动功能, 如果不显式设置是否启用, 将默认启用滚动
                UseScroll: function(use){},
                /// 启用或禁用滚动功能
                TriggerScroll: function(){},
				/// 添加新的选项卡按钮
				/// tabs: 新选项卡按钮的配置, 添加多个使用数组表示
				/// index: 新加入的选项卡按钮将插入的顺序
                AddTabButton: function (tabs, index) {},
				/// 移除选项卡按钮, 此函数必定移除指定的选项卡, 忽略closable值
				/// tabBtn: 需要删除的选项卡按钮的HTML DOM对象或jQuery对象
                RemoveTabButton: function(tabBtn){}
	};
```

**获取api：**

``` javascript
	var api = $("#TabView").JQueryTabView();
```

**使用api(在第二个选项卡按钮的位置新添加一个选项卡按钮):**

``` javascript
	api.AddTabButton({}, 1);
	// 默认在最后面添加一个选项卡按钮
	//api.AddTabButton({});
```

**第二种使用方法：**

``` javascript
	// 前提是id为TabView的容器中已经存在有JQueryTabView插件了
	// (请保证在TabView内部有且仅有一个,否则若有多个,api函数将只作用于第一个)
	$("#TabView").AddTabButton({}, 1);
```
