# JQueryTabView
**Copyright 2012, Darkmuleth**

一个简单的基于jQuery的选项卡插件。

主要实现以下功能：

* 选项卡添加或移除；
* 选项卡按钮滚动；
* 选项卡按钮展开或收起；
* 选项卡内容连接到其它网页；
* ajax方式载入选项卡内容

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

示例(初始时生成两个选项卡)：

``` html
	<script type="text/javascript">
	$(document).ready(function(){
		$("#TabView").JQueryTabView({
			tabs: [{
					caption: "Button 1",
					active: true,
                    content: "<p>Content 1</p>",
					onClick: function () { alert("Button 1 Click!"); },
					onClose: function () { alert("Button 1 Close!"); }
				},
				{
					image: "../TabImage.jpg",
					cssId: "Button2",
					caption: "Button 2",
                    content: "<p>Content 2</p>",
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
            /// 选项卡配置对象(若是多个选项卡可使用数组表示)
            tabs: {
                // 选项卡的CSS编号值(符合CSS命名规则的字符串), 其对应面板将会在此基础上添加一个'_P'后缀
                cssId: null,
                // 选项卡的CSS类值(符合CSS命名规则的字符串), 添加多个可用空格隔开, 其对应面板将会在此基础上添加一个'_P'后缀
                cssClass: null,
                // 选项卡文本
                caption: "Tab Button",
                // 当鼠标悬停在选项卡按钮之上时显示的内容, 如果不设置则其值等于caption
                title: null,
                // 选项卡的图像(值为图片的url,优先级高于caption,二者不会同时显示)
                image: null,
                // 选项卡的图标(值为图片的url)
                icon: null,
                // 选项卡的主体内容, 可以为以下值:
                //  1. 字符串: 页面上的某个HTML元素的id或class选择器, 如"#Tab1"或".Tabs"
                //  2. 字符串: HTML字符串, 如"<div><p>Text.<p></div>"
                //  3. 字符串: 网页的URL, 如"http://www.google.com" 
                //              (如果是Internet上的网页,为了避免一些错误情况,建议在URL前加上传输协议,如"http://")
                //  4. 对象: HTML DOM对象
                //  5. 对象: jQuery对象
                content: null,
                // 选项卡的ajax设置, 如果设置了此值, 那么将忽略对于content属性的设置, 
                //  可以为以下值:
                // 1. 字符串: 一个提供ajax后台服务的URL字符串(如: "../ajax.aspx"), 
                //              ajax操作成功后将自动把后台传回来的数据转成HTML元素,置入选项卡面板的内容对象中去
                // 2. 对象: 对象完整结构如下:
                //  ajax: {
                //      //一个提供ajax后台服务的URL字符串(如: "../ajax.aspx"); 必选项
                //      url: "",
                //      // ajax请求类型; 可选项
                //      type: "GET",
                //      // ajax返回数据的类型, 如果没有设置success事件,此属性的设置将被忽略; 可选项
                //      dataType: "text",
                //      // 需要传递给后台的数据; 可选项
                //      data: {},
                //      // ajax成功后触发的事件; 可选项
                //      // 如果没有设置此事件,那么ajax操作成功后将自动把后台传回来的数据转成HTML元素,置入选项卡面板的内容对象中去
                //      //  函数的上下文(this对象)为选项卡面板的内容对象, 函数的参数可以参照jQuery中对jQuery.ajax()方法的说明(下同)
                //      success: function(data, textStatus, xhr){},
                //      // ajax失败后触发的事件; 可选项
                //      error: function(xhr, textStatus, errorThrown){},
                //      // ajax完成后触发的事件(不管是成功还是失败,都将触发); 可选项
                //      complete: function(xhr, textStatus){}
                //  },
                ajax: null,
                // 选项卡的宽度(单位为px(像素))
                width: null,
                // 是否是激活的选项卡
                active: false,
                // 指示该选项卡按钮是否可以点击, 设置为false时同时将不能点击该选项卡的删除按钮
                enable: true,
                // 标识选项卡按钮的顺序(若相同,则按照该数组中的顺序)
                index: 9999,
                // 可以删除(将添加删除按钮), 布尔值,如果为null则按照tabClosable来配置
                closable: null,
                // 鼠标悬停在关闭按钮上时显示的提示文字
                closeMessage: null,
                // 面板的内边距(像素)
                panelPadding: null,
                /////////////////// 以下是事件设置 ////////////////////
                // 点击选项卡事件, 此事件将导致选项卡激活
                // 若返回false, 则点击事件中断, 后续的激活操作将被忽略
                // onClick: function(api, content, panel, event){}
                // api: 插件的api引用
                // content: 选项卡对应的面板对象的'内容'对象,如果usePanel为false, 则值为null
                // panel: 选项卡对应的面板对象,如果usePanel为false, 则值为null
                // event: jQuery的点击事件所传递的event对象
                onClick: null,
                // 激活选项卡事件; 发生在onClick事件之后,onTabActived事件之前,
                // 若返回false, 则激活事件中断, 后续的激活操作将被忽略
                // 函数形式与点击事件相同(其中函数的event参数当且仅当onActive事件是直接由选项卡按产生时才会存在)
                onActive: null,
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
            ///     4.对象: 需要激活的选项卡的HTML DOM对象(理论上此类型无法起作用)
            ///     5.对象: 需要激活的选项卡的jQuery对象(理论上此类型无法起作用)
            active: null,
            /// 选项卡的激活方式, 可选值如下:
            ///     1. 'click' : 鼠标点击
            ///     2. 'hover' : 鼠标经过
            activeType: "click",
            /// 自动为选项卡添加CSS编号
            autoTabId: false,
            /// 选项卡的CSS编号值前缀(符合CSS命名规则的字符串), 只有在 autoTabId 为 true 时有效
            tabIdText: "JQueryTab",
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
            /// 选项卡的默认删除设置
            tabClosable: true,
            /// 选项卡之间的横向距离(像素)
            spacing: 2,
            /// 面板的高度(像素), 不显示表名则程序自动设置
            panelHeight: null,
            /// 面板的默认内边距(像素)
            panelPadding: 5,
            /// 可以滚动以显示过多的选项卡按钮
            scrollable: true,
            /// 选项卡按钮组移动时的步进距离(像素),只在scrollable为true时有效
            moveOffset: -100,
            /// 按住左右滚动按钮时选项卡按钮组的移动速率 (像素/毫秒)
            moveSpeed: 0.25,
            /// 不同行的选项卡的行距(像素), 只在scrollable为false时有效
            lineHeight: 5,
            /// 选项卡的各种提示信息
            tabMessage: {
                Close: "关闭",
                Expansion: "展开",
                Shrink: "收起",
                Add: "添加新选项卡",
                AddText: "请输入新选项卡的描述",
                AddText2: "双击鼠标左键或按下'Esc'键进行选项卡进级设置",
                ScrollLeft: "双击移动到最左端",
                ScrollRight: "双击移动到最右端",
                LoadingFail: "载入失败",
                ConnectFail: "无法访问该地址"
            },
            /// 使用面板功能
            usePanel: true,
            /// 不创建'选项卡进级设置面板'
            noAdvance: false,
            /// 不创建选项卡工具, 如果此值设为true,那么scrollable将默认设置为true
            noTools: false,
            /// debug模式(开启后将向浏览器控制台打印信息)
            debug: false,
            /////////////////// 以下是事件设置 ////////////////////
            /// 所有选项卡按钮的默认'激活'事件, 发生在选项卡的onActive事件之前; 
            /// 若返回false, 则激活事件中断, 后续的激活操作将被忽略
            /// onTabActive: function(api, content, panel, event){}
            /// api: 插件的api引用
            /// content: 选项卡对应的面板对象的'内容'对象,如果usePanel为false, 则值为null
            /// panel: 选项卡对应的面板对象,如果usePanel为false, 则值为null
            /// event: jQuery的点击事件所传递的event对象
            onTabActive: null,
            /// 所有选项卡按钮的默认'激活后'事件, 发生在选项卡的onActive事件之后
            /// (函数形式与'点击'事件相同, 下同)
            onTabActived: null,
            /// 所有选项卡按钮的默认'关闭'事件, 发生在选项卡的onClose事件之前; 
            /// 若返回false, 则关闭事件中断, 后续的关闭操作将被忽略
            onTabClose: null,
            /// 所有选项卡按钮的默认'关闭后'事件, 发生在选项卡的onClose事件之后
            onTabClosed: null,
            /// 当使用'添加按钮'添加一个选项卡后触发, 返回false将可以阻止插件创建选项卡
            /// onAddClick: function(tab, api){}
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
            /// onReady: function(api){}
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
                /// 显示并激活指定选项卡
                ShowTab: function(tabBtn){},
                /// 启用或禁用滚动功能, 如果不显式设置是否启用, 将默认启用滚动
                UseScroll: function(use){},
                /// 启用或禁用滚动功能
                TriggerScroll: function(){},
				/// 添加新的选项卡
				/// tabs: 新选项卡的配置, 添加多个使用数组表示
				/// index: 新加入的选项卡将插入的顺序
                AddTabButton: function (tabs, index) {},
				/// 移除选项卡, 此函数必定移除指定的选项卡, 忽略closable值
				/// tabBtn: 需要删除的选项卡按钮的HTML DOM对象或jQuery对象
                RemoveTabButton: function(tabBtn){},
                /// 刷新选项卡插件的显示
                /// 在某些特殊情况下,对解决选项卡界面显示方面的不正常现象有帮助
                RefreshTabView: function(){}
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
