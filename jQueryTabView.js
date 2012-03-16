
/*!
 * jQuery Tab View
 *
 * Copyright 2012, Darkmuleth
 * http://blog.163.com/darkmuleth 
 *
 * Date: 2012-2-24
 */

; (function ($) {
    
    var S;
    function Console(msg, view){
        ///<summary>
        /// 控制台调用函数
        ///</summary>
        if(msg){
            if(view){
                if(S.GetConfig(view).option.debug == false){ return;}
                msg = S.GetTabViewUID(view) + " > " + msg; }
            Console.log(msg); }
    };
    Console.log = function(msg){
        if(typeof console != "undefined"){
            console.log(msg);
        }else if(typeof opera != "undefined"){ opera.postError(msg);}
    };
    var CC = Console;

    /// 公用命名空间
    var Static = {
        /// 插件默认设置
        defaultOption: {
            /// 选项卡配置对象(若是多个选项卡可使用数组表示)
            tabs: {
                // 选项卡的CSS编号值(符合CSS命名规则的字符串)
                cssId: null,
                // 选项卡的CSS类值(符合CSS命名规则的字符串), 添加多个可用空格隔开
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
                //      type: "POST",
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
                padding: null,
                /////////////////// 以下是事件设置 ////////////////////
                // 点击选项卡事件
                // onClick: function(api, content, panel, event){}
                // api: 插件的api引用
                // content: 选项卡对应的面板对象的'内容'对象,如果usePanel为false, 则值为null
                // panel: 选项卡对应的面板对象,如果usePanel为false, 则值为null
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
            /// 面板的默认内边距(像素)
            padding: 5,
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
                AddText: "请输入新选项卡的名字",
                ScrollLeft: "双击移动到最左端",
                ScrollRight: "双击移动到最右端",
                LoadingFail: "载入失败",
                ConnectFail: "无法访问该地址"
            },
            /// 使用面板功能
            usePanel: true,
            /// 不创建选项卡工具, 如果此值设为true,那么scrollable将默认设置为true
            noTools: false,
            /// debug模式(开启后将向浏览器控制台打印信息)
            debug: false,
            /////////////////// 以下是事件设置 ////////////////////
            /// 所有选项卡按钮的默认'点击'事件; 若返回false, 则点击事件中断, 后续的点击操作将被忽略
            /// onTabClick: function(api, content, panel, event){}
            /// api: 插件的api引用
            /// content: 选项卡对应的面板对象的'内容'对象,如果usePanel为false, 则值为null
            /// panel: 选项卡对应的面板对象,如果usePanel为false, 则值为null
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
        },
        /// 用于计算选项卡插件的UID
        TabViewCount: 0,
        /// 选项卡的标记名命名空间(主要用于 $.data())
        Tag: {
            /// 选项卡插件的uid标记名
            ViewUID: "JQueryTabViewUID",
            /// 选项卡API标记名
            TabAPI: "TabViewAPI",
            /// 选项卡Config标记名
            TabConfig: "TabViewConfig",
            /// 选项卡插件的滚动按钮启用/禁用标记名
            ScollEnabled: "TabScollEnabled",
            /// 选项卡按钮的UID标记名
            TabUID: "TabButtonUID",
            /// 选项卡按钮的序号标记名
            TabIndex: "TabButtonIndex",
            /// 选项卡按钮的设置对象标记名
            TabOption: "TabButtonOption",
            /// 特殊按钮标记名
            TabSpec: "TabSpecialBtn",
            /// 选项卡按钮连续移动标记名
            TabsMove: "IsTabGoTo",
            /// 选项卡定时器标记名
            TabTimeOut: "TabsMoveTimeOut",
            /// 内联框架的url标记名
            IframeURL: "TabIframeURL"
        },
        //////////////// 公用函数 /////////////////
        Trim: function(str, chars){
            /// <summary>
            /// 去除字符串str头尾的指定字符串,如果没有给定指定要去除的字符串,则默认去除空格
            /// </summary>
            if (!S.isType(str, "String")){ return "";}
            if( !S.isType(chars, "String")){ chars = ' '; }
            // 去除前面所有的空格
            var cl = chars.length;
            while ( (str.length >= cl) && (str.substring(0, cl) == chars) ) {
                str = str.substring(cl);
            }
            // 去除后面的空格
            var ld = str.length - cl;
            while ( (ld >= 0) && (str.substring(ld) == chars)) {
                str = str.substring(0, ld);
                ld = str.length - cl;
            }
            return str;
        },
        Copy: function(obj){
            /// <summary>
            /// 拷贝一个对象
            /// </summary>
            return $.extend({}, obj);
        },
        ConExec: function (con, fun, args, self) {
            ///<summary>
            /// 如果条件( con )为true 则执行函数( fun )
            ///</summary>
            if (con === true) { this.Exec(fun, args, self); }
        },
        Exec: function(fun, args, self){
            ///<summary>
            /// 将指定参数当做函数执行,返回函数执行结果(如果没有则返回 undefined),如果不是函数则什么都不做
            /// fun:    需要执行的函数;
            /// args:   需要传给函数的参数,必须使用数组;
            /// self:   函数fun执行时,其函数内部的this指针所指的对象, 
            ///         使用时必须存在第二个参数, 即使第二个参数为null;
            ///</summary>
            var retn;
            if($.isFunction(fun)){
                if(typeof self == "object"){
                    if($.isArray(args)){
                        retn = fun.apply(self, args);
                    }else{
                        retn = fun.call(self, args); }
                }else{
                    if($.isArray(args)){
                        retn = fun.apply(window, args);
                    }else{
                        retn = fun.call(window, args); } } }
            return retn;
        },
        isType: function(obj, type){
            ///<summary>
            /// 判断对象是否是指定类型
            ///</summary>
            return (type === "Null" && obj === null) ||
                (type === "Undefined" && obj === void(0)) ||
                //(type === "Number" && $.isNumeric(obj)) ||
                (type === "Number" && !isNaN( parseFloat(obj) ) && isFinite( obj )) ||
                 Object.prototype.toString.call(obj).slice(8,-1) === type;
        },
        isURL: function(url){
            ///<summary>
            /// 判断对象是否是URL字符串
            ///</summary>
            var urlPattern = /^(?:(?:(?:\w+\:\/\/(?=\w))?(?:\w[-_]+\w|\w)+(?:\.(?:\w[-_]+\w|\w)+)*(?:\:\d+)?(?:\/(?!\/))?)|\.\.\/(?!\/))(?:[^\*\?<>\|\:"\/\\]+(?:\/(?!\/)))*/;            
            
            return S.isType(url, "String") && urlPattern.test(S.Trim(url));
        },
        Process: function(obj, type, filter){
            ///<summary>
            /// 处理指定对象, 返回处理后的结果
            ///</summary>
            // 如果是字符串
            if(S.isType(obj, "String")){
                obj = S.Trim(obj).replace(/#|\./g, "");
                // 如果不是要处理class值
                if(type !== "CssClass"){
                    obj = obj.replace(/\s*/g, "");
                }
                // 执行自定的操作
                var str = S.Exec(filter, [obj]);
                if(S.isType(str, "String")){
                    obj = str;
                }
            }
            return obj;
        },
        GetBorderWidth: function (ele, fail, isVertical) {
            ///<summary>
            /// 获取指定元素的边框宽度; 
            /// isVertical = true 时只计算纵向边框; 为false 时则只计算横向的边框 ; 
            /// isVertical不存在时则计算全部的边框
            ///</summary>
            if (!fail){fail = 0;}
            var border = {};
            var temp;
            var style;
            // 如果不是只计算纵向的边框
            if (isVertical !== false) {
                style = ele.css("boder-top-width");
                if (!style){ temp = fail;}
                else{ temp = +style.replace("px", "");}
                border.top = temp;
                style = ele.css("boder-bottom-width");
                if (!style){ temp = fail;}
                else{ temp = +style.replace("px", "");}
                border.bottom = temp;
            }

            if (isVertical == true){ return border;}

            style = ele.css("boder-left-width");
            if (!style){ temp = fail;}
            else{ temp = +style.replace("px", "");}
            border.left = temp;
            style = ele.css("boder-right-width");
            if (!style){ temp = fail;}
            else{ temp = +style.replace("px", "");}
            border.right = temp;

            return border;
        },
        GetStyleWidth: function (ele, isVertical) {
            ///<summary>
            /// 获取指定元素的水平/垂直方向上的边框,内边距的和
            ///</summary>
            var direc_1 = "left";
            var direc_2 = "right";
            // 边框默认值
            var df_1 = 0;
            // 内边距默认值
            var df_2 = 3;

            var sum = 0;
            var temp;
            var style;

            // 如果要的是纵向的
            if (isVertical == true) {
                direc_1 = "top";
                direc_2 = "bottom";

                // 获取纵向的边框和
                var border = S.GetBorderWidth(ele, df_1, true);
                sum += border.top + border.bottom;
            } else {
                // 获取横向的边框和
                var border = S.GetBorderWidth(ele, df_1, false);
                sum += border.left + border.right; }

            // 计算内边距
            style = ele.css("padding-" + direc_1);
            if (!style){ temp = df_2;}
            else temp = +style.replace("px", "");
            sum += temp;
            style = ele.css("padding-" + direc_2);
            if (!style){ temp = df_2;}
            else{ temp = +style.replace("px", "");}
            sum += temp;

            return sum;
        },
        GetElementSize: function (ele) {
            ///<summary>
            /// 获取指定元素的大小(包含边框)
            ///</summary>
            var size = {};
            //var border = S.GetBorderWidth(ele, 1);
            size.width = ele.get(0).offsetWidth; // + border.left + border.right;
            size.height = ele.get(0).offsetHeight; // + border.top + border.bottom;

            return size;
        },
        SortBubble: function(arr, compare){
            ///<summary>
            /// 对指定数组进行冒泡排序, compare是排序中使用的比较函数
            ///</summary>
            var flag = true;
            var temp = 0;
            for ( i = 0; i < arr.length - 1; i ++){
                flag = true;
                for (j = 0; j < arr.length - i - 1; j ++){
                    if (compare(arr[j], arr[j + 1]) > 0){
                        temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                        flag = false; } }
                if (flag == true){ break;} }
        },
        Registration: function(view){
            ///<summary>
            /// 注册选项卡插件
            ///</summary>
            /// 将插件对象放入全局的选项卡列表中去
            if((typeof $.fn.JQueryTabView.TabViewArray == "undefined")
                || ( ($.fn.JQueryTabView.TabViewArray instanceof Array) == false )){
                // 如果没有定义列表数组
                $.fn.JQueryTabView.TabViewArray = new Array(); }
            $.fn.JQueryTabView.TabViewArray.push(view);
        },
        ExtendTabs: function(tabs){
            ///<summary>
            /// 扩展指定的选项卡设置,让其具备完整的配置
            ///</summary>
            // 如果是数组(有多个选项卡按钮)
            if($.isArray(tabs)){
                var temp = new Array(tabs.length);
                // 对每一个选项卡按钮设置都进行扩展
                for (i = 0; i < tabs.length; i++) {
                    temp[i] = $.extend(true, {}, S.defaultOption.tabs, tabs[i]); }
                tabs = temp;
            }else{
                tabs = $.extend(true, {}, S.defaultOption.tabs, tabs); }
            return tabs;
        },
        ExtendOption: function(usop){
            ///<summary>
            /// 使用指定的设置来微调默认插件设置,返回整合后的插件设置
            ///</summary>
            this.userOption = usop;
            var dfop = S.defaultOption;
            var op = null;
            var usop2 = S.Copy(usop);
            if (usop.tabs) {  // 用户设置了选项卡按钮
                usop2.tabs = S.ExtendTabs(usop.tabs);
            }
            // 深层次地扩展对象
            op = $.extend(true, {}, dfop, usop2);

            return op;
        },
        ///////////////////////////////////////////////////////
        ////////// 可供外部使用的API函数的主体部分 //////////////
        GetTabViewIndex: function(view){
            ///<summary>
            /// 获取当前插件对象在选项卡列表中的序号
            ///</summary>
            var views = $.fn.JQueryTabView.TabViewArray;
            var i;
            for(var i=0,l=views.length; i<l; i++){
                if(views[i].data(S.Tag.ViewUID) == view.data(S.Tag.ViewUID)){ break;} }
            return (i - 1);
        },
        GetDefaultOption: function(){
            ///<summary>
            /// 获取默认配置对象
            ///</summary>
            return S.Copy(S.defaultOption);
        },
        SetConfig: function(obj, cfg){
            ///<summary>
            /// 为指定jQuery对象的HTML DOM添加指定的config对象
            ///</summary>
            obj.data(S.Tag.TabConfig, cfg);
        },
        GetConfig: function(obj){
            ///<summary>
            /// 获取选项卡插件的config对象
            ///</summary>
            return obj.data(S.Tag.TabConfig);
        },
        SetAPI: function(obj, api){
            ///<summary>
            /// 为指定jQuery对象的HTML DOM添加指定的API对象
            ///</summary>
            obj.data(S.Tag.TabAPI, api);
        },
        GetAPI: function(obj){
            ///<summary>
            /// 获取选项卡插件的API对象
            ///</summary>
            return S.Copy(obj.data(S.Tag.TabAPI));
        },
        SetTabOption: function(tabBtn, tabOp){
            ///<summary>
            /// 对指定的选项卡按钮保存一个设置对象
            ///</summary>
            tabBtn.data(S.Tag.TabOption, tabOp);
        },
        GetTabOption: function(tabBtn){
            ///<summary>
            /// 获取指定的选项卡按钮的设置对象
            ///</summary>
            return tabBtn.data(S.Tag.TabOption);
        },
        GetTabViewUID: function(view){
            ///<summary>
            /// 获取选项卡插件的uid
            ///</summary>
            return view.data(S.Tag.ViewUID);
        },
        GetScollEnabled: function(view){
            ///<summary>
            /// 获取滚动按钮的启用状态
            ///</summary>
            var fun = function(val){
                if(val == "true"){ return true;
                }else if(val == "false"){ return false;
                }else{ return val;} };
            var enb = {};
            var C = S.GetConfig(view);
            enb.left = fun(C.GetLeftScollEnabled());
            enb.right = fun(C.GetRightScollEnabled());
            return enb;
        },
        UseScroll: function(view, use){
            ///<summary>
            /// 启用或禁用滚动功能, 如果不显示设置是否启用, 将默认启用滚动
            ///</summary>
            var C = S.GetConfig(view);
            if(typeof use != "boolean"){ use = true;}
            use = C.UseScroll(use);
            if( use == true ){
                // 修改滚动按钮高度
                $(".TabScrollBtn", view).css("height", "" 
                    + ($(".TabShowArea", view).eq(0).get(0).offsetHeight - 2) + "px"); }
            return use;
        },
        TriggerScroll: function(view){
            ///<summary>
            /// 启用或禁用滚动功能
            ///</summary>
            return this.UseScroll(view, !S.GetConfig(view).option.scrollable);
        },
        AddTabButton: function (view, tabs, index) {
            ///<summary>
            /// 添加新的选项卡按钮, index是新选项卡按钮要插入的位置, 最小值为0
            ///</summary>
            // 扩展选项卡设置
            tabs = S.ExtendTabs(tabs);
            var C = S.GetConfig(view);
            if(!C){ 
                CC("严重错误, 无法获取配置对象, 添加按钮失败!", view);
                return alert("错误!");}
            // 添加新选项卡
            C.AddNewTabButtons(tabs, index);
            // 如果没有设置选项卡位置则目标选项卡为该位置的第一个选项卡按钮
            if((typeof index != "number") || isNaN(index)){
                // 如果是数组
                if($.isArray(tabs)){
                    var temp = new Array();
                    for(var i=0,l=tabs.length;i<l;i++){
                        temp.push(tabs[i].index); }
                    // 从小到大排序
                    temp.sort(function(a, b){return a - b;});
                    // 获取其中的最小值
                    index = temp[0];
                }else{ index = tabs.index;} }
            if(index >= C.TabArray.length){ index = C.TabArray.length - 1;}
            // 如果当前不存在激活的选项卡,则将新选项卡设置为激活并显示
            if(C.GetActiveTab() === null){
                C.ShowActiveTab(C.GetTabObject(index));
            }else{
                // 移动到新选项卡的位置
                C.MoveToTabButton(C.GetTabObject(index));
            }
        },
        RemoveTabButton: function(view, tabBtn){
            ///<summary>
            /// 移除选项卡按钮
            ///</summary>
            var C = S.GetConfig(view);
            if(typeof tabBtn == "string"){ tabBtn = +tabBtn;}
            if(S.isType(tabBtn)){
                tabBtn = C.GetTabObject(tabBtn);
                if( tabBtn == null ){ return;}
            }else if(!(tabBtn instanceof $)){ tabBtn = $(tabBtn);}
            C.RemoveTabButton(tabBtn);
        }
    };
    S = Static;


    /// 选项卡配置类
    function TabConfig(tabMainArea, op){
        ///////// 类属性 ///////////////////
        /// 选项卡控件对象引用
        this.TabView = tabMainArea;
        /// 整合用户设置后的插件设置
        this.option = op;
        /// 用户输入的插件设置
        this.userOption = null;
        /// 选项卡按钮对象数组(保存的是按钮的jQuery对象)
        this.TabArray = new Array();
        /// 选项卡对应的面板数组
        this.PanelArray = new Array();
        /// 保存选项卡按钮组移动行为所需要的数据
        this.TabsMoveObj = {
            // 处于原始偏移位置时的横坐标值(坐标原点,一般不需要改变)
            MaxOffset: 0,
            // 处于最大偏移位置时的横坐标值(能够移动的最大位置,小于或等于0的数字,可能根据选项卡按钮数量的变化而变化)
            MinOffset: 0,
            // 显示区域宽度暂存数据(用于临时改变显示区域宽度的情况)
            ShowAreaWidthTemp: null,
            // 选项卡显示区域的基点位置(从选项卡显示区域最左侧开始算起)
            ShowAreaBase: 0,
            // 选项卡按钮的基点位置(从选项卡按钮的最左侧开始算起)
            TabButtonBase: 0,
            // 步进向量(单次移动的移动量)
            StepDistance: -100,
            toString: function(view, msg){
                ///<summary>
                /// 打印移动数据
                ///</summary>
                var M = this;
                if(typeof msg == "undefined"){ msg = "";}
                var str = msg + " 当前移动数据信息: ";
                str += "\n\t -> 偏移原点: \t\t" + M.MaxOffset;
                str += "\n\t -> 偏移极限: \t\t" + M.MinOffset;
                str += "\n\t -> 显示区域暂存宽度: \t" + M.ShowAreaWidthTemp;
                str += "\n\t -> 选项卡显示区域基点: \t" + M.ShowAreaBase;
                str += "\n\t -> 选项卡按钮基点: \t" + M.TabButtonBase;
                str += "\n\t -> 步进向量: \t\t" + M.StepDistance;
                if(typeof view != "undefined"){ CC(str, view);}
                return str;
            }
        };
        /// 选项卡进级设置面板
        this.AdvancePanel = null;
        /// 用于计算选项卡按钮的UID
        this.TabCount = 0;
        
        ///////// 类的共同部分 ///////////////////
        // 如果还没有定义过类的共同部分
        if(typeof TabConfig._i_initialized_i_ == "undefined"){
            ///////// 类共有属性 ///////////////////
            /// '添加按钮'的设置
            TabConfig.prototype.addButtonOption = {
                title: "",
                width: 23,
                closable: false,
                // 选项卡类型
                type: "TabAddButton",
                onClick: function(C){
                    ///<summary>
                    /// 创建一个用于添加新选项卡的临时选项卡按钮
                    ///</summary>
                    //var C = S.GetConfig(this.parents(".TabMainArea").eq(0));
                    var view = C.TabView;
                    if($(".TabButtonArea", view).children(".TabTemporaryBtn").length > 0){ return;}
                    // 临时按钮的属性设置
                    var _op = {
                        title: C.option.tabMessage.AddText,
                        width: C.option.tabWidth,
                        closable: false,
                        type: "TabTemporaryBtn",
                        onClick: function(){ return false;}
                    };
                    _op = S.ExtendTabs(_op);
                    // 创建临时按钮
                    var add = C.CreateTabElement(_op);
                    C.SetTabWidth(add, _op.width);
                    C.SetElementHeight(add);
                    var tempEle = add.children(".TabButtonPackage");
                    // 清空临时按钮内部
                    tempEle.html("");
                    // 创建文本框
                    var txt = $("<input type='text'/>");
                    // 将文本框放入临时按钮
                    tempEle.append(txt);
                    _op = C.TabArray.length - 1;
                    if(_op >= 0){
                        // 获取最后一个普通标签按钮
                        tempEle = C.TabArray[_op];
                        // 添加间距
                        tempEle.css("margin-right", "" + C.option.spacing + "px"); 
                    }
                    // 绑定失去焦点事件
                    txt.blur(function(){
                        var temp = $(this);
                        // 获取用户的输入文本
                        var temp = S.Trim(temp.val());
                        // 移除临时按钮
                        add.remove();
                        if(temp != ""){
                            // 执行事件函数
                            if(S.Exec(C.option.onAddClick, 
                                    [S.ExtendTabs({caption: temp}), 
                                        S.GetAPI(view)],
                                     view) 
                               != false){
                                // 创建一个标签按钮
                                S.AddTabButton(view, {caption: temp});
                                // 标记已添加一个选项卡
                                temp = true;
                            }
                        }
                        if((temp !== true) && (_op >= 0)){
                            tempEle.css("margin-right", 0);
                            // 刷新宽度
                            C.RefreshTabsWidth();
                            // 检查是否需要移动
                            C.MoveTabsAfterUpdate(); }
                    });
                    // 绑定键盘事件
                    txt.keypress(function(e){
                        // 如果是回车键
                        if(e.which == 13){  
                            // 激发失去焦点事件
                            txt.blur();
                            return false; }
                    });
                    if(C.CanScroll() == false){
                        // 将这个临时按钮放入自己前面
                        this.before(add);
                    }else{
                        $(".TabButtonArea", view).eq(0).append(add); }
                    // 刷新宽度
                    C.RefreshTabsWidth();
                    // 关闭全局的动画效果
                    $.fx.off = true;
                    // 移动以显示临时按钮
                    C.MoveToTabButton(add);
                    // 开启全局的动画效果
                    $.fx.off = false;
                    // 触发获取焦点事件
                    txt.focus();

                    return false;
                }
            };

            ///////// 类方法 ///////////////////
            TabConfig.prototype.GetTabIndex = function (tabBtn) {
                ///<summary>
                /// 获取指定tab对象在TabArray的数组中的序号,没有则返回-1
                ///</summary>
                var index = -1;
                $.each(this.TabArray, function(key, val){
                    //if(this.TabArray[i].is(tabBtn)){    // 此.is()函数只有jQuery 1.6 及以上版本才能判断选择器以外的元素
                    if(val.get(0) == $(tabBtn).get(0)){
                        index = key;
                        // 返回false中断each循环
                        return false;
                    }
                });
                return index;
            };
            TabConfig.prototype.GetTabObject = function (index) {
                ///<summary>
                /// 获取TabArray数组中指定序号中的选项卡对象,没有则返回null
                ///</summary>
                var tabBtn = null;
                index = Math.abs(index);
                if (this.TabArray.length > index) {
                    tabBtn = this.TabArray[index];
                }
                return tabBtn;
            };
            TabConfig.prototype.GetPanelObject = function ( tabBtn ) {
                ///<summary>
                /// 根据指定选项卡按钮获取对应的面板jQuery对象
                ///</summary>
                var uid;
                if(tabBtn instanceof $){
                    uid = tabBtn.data(S.Tag.TabUID);
                // }else if(S.isType(tabBtn, typeof S.Tag.TabUID)){
                }else if(S.isType(tabBtn, "String")){
                    uid = tabBtn;
                }else{ return; }
                if(S.isType(uid, "Undefined")){ return; }
                var panel = null;
                $.each(this.PanelArray, function(key, val){
                    if(!S.isType(val.data(S.Tag.TabUID), "Undefined") 
                        && (val.data(S.Tag.TabUID) === uid)){
                        panel = val;
                        // 保存在数组中的序号
                        panel.data('PanelArrayIndex', key);
                        return false;
                    }
                });
                return panel;
            };
            TabConfig.prototype.ExecSelfFun = function (fun, args) {
                ///<summary>
                /// 以插件对象为执行者执行指定函数
                ///</summary>
                S.Exec(fun, args, this.TabView);
            };
            TabConfig.prototype.GetActiveTab = function(){
                ///<summary>
                /// 获取处于激活状态的选项卡按钮
                ///</summary>
                var tabBtn = null;
                $.each(this.TabArray, function(key, val){
                    if(val.hasClass("TabActive")){
                        tabBtn = val;
                        return false;
                    }
                });
                return tabBtn;
            };
            TabConfig.prototype.SetActiveTab = function (tabBtn) {
                ///<summary>
                /// 设置指定的选项卡按钮为激活状态
                ///</summary>
                // 类对象的句柄
                var C = this;
                if(S.isType(tabBtn, "Number")){
                    tabBtn = C.GetTabObject(tabBtn);
                    if (tabBtn == null){ return;}
                }
                //C.TabView.find(".TabButton").removeClass("TabActive");
                $(".TabButton", C.TabView).removeClass("TabActive");
                tabBtn.addClass("TabActive");
                return tabBtn;
            };
            TabConfig.prototype.ShowActiveTab = function (tabBtn) {
                ///<summary>
                /// 显示激活的选项卡
                ///</summary>
                var C = this;
                if(S.isType(tabBtn, "Undefined")){
                    tabBtn = C.GetActiveTab();
                }
                // 获取选项卡的设置对象
                var tab = S.GetTabOption(tabBtn);

                if((tabBtn == null) || (tab.enable === false)){
                    return null;
                }else{
                    C.SetActiveTab(tabBtn);
                }
                // 移动以显示按钮
                C.MoveToTabButton(tabBtn);

                // 获取对应激活的面板
                var panel = C.GetPanelObject(tabBtn);
                if(panel != null){
                    var panels = $(".TabPanelsArea", C.TabView).eq(0).children(".TabPanel");
                    // 如果面板不是显示出来的
                    if(panel.is(":hidden")){
                        // 隐藏所有的面板
                        panels.hide();
                        panels.css("z-index", -1);
                        // 显示面板
                        panel.css("opacity", 0);
                        panel.show();
                        panel.css("z-index", 0);
                        var pack = panel.children(".TabPanelPackage");
                        // 获取默认内边距
                        var p = !S.isType(C.option.padding, "Number") ? 0 : C.option.padding;
                        // 获取选项卡单独设置的内边距(如果有)
                        p = !S.isType(tab.padding, "Number") ? p : tab.padding;
                        // 取绝对值
                        p = Math.abs(p);
                        var dbP = p * 2;
                        // 设置内部包装容器的宽和高, 即面板的内边距
                        pack.width(panel.width() - dbP);
                        pack.height(panel.height() - dbP);
                        pack.css("top", p + "px");
                        // 动画效果显示面板
                        panel.animate({opacity: "+=1"}, "slow", function(){
                            // 获取面板的内容对象
                            var content = pack.children(".TabContent").eq(0);
                            if(content.length <= 0){
                                content = $("<div class='TabContent' />");
                                pack.html("");
                                pack.append(content);
                            }
                            // ajax功能代码 ...
                            // 获取用户的ajax设置
                            var ajax = tab.ajax;

                            if(ajax != null){
                                // 初始化 ajax 对象
                                var _ajax = {
                                        _type: "POST",
                                        _dataType: "text",
                                        _data: {}
                                    };
                                // 设置ajax参数
                                if(S.isURL(ajax)){
                                    _ajax.url = ajax;
                                }else if(S.isType(ajax, "Object")){
                                    if(S.isURL(ajax.url)){
                                        _ajax.url = ajax.url;
                                        // 只有设置了success事件后才能改变ajax返回数据的类型
                                        if($.isFunction(ajax.success) 
                                            && S.isType(ajax.dataType, "String") && (S.Trim(ajax.dataType) !== "")){
                                            _ajax._dataType = ajax.dataType;
                                        }
                                        // 设置请求类型
                                        if(S.isType(ajax.type, "String") && (S.Trim(ajax.dataType) !== "")){
                                            _ajax._type = ajax.type;
                                        }
                                        // 设置数据
                                        if(!S.isType(ajax.data, "Undefined")){
                                            _ajax._data = ajax.data;
                                        }
                                    }else{ _ajax = null; }
                                }else{ _ajax = null; }
                                // 如果可以进行ajax
                                if(_ajax != null){
                                    // 添加loading class
                                    content.addClass("TabLoading");
                                    // 清空内容
                                    content.html("");
                                    // 进行ajax操作
                                    $.ajax({
                                      url: _ajax.url,
                                      type: _ajax._type,
                                      dataType: _ajax._dataType,
                                      data: _ajax._data,
                                      complete: function(xhr, textStatus) {
                                        // 执行用户设置的complete事件
                                        S.Exec(ajax.complete, [xhr, textStatus], content);
                                      },
                                      success: function(data, textStatus, xhr) {
                                        // 移除载入中class
                                        content.removeClass("TabLoading");
                                        if($.isFunction(ajax.success)){
                                            // 执行用户设置的success事件
                                            S.Exec(ajax.success, [data, textStatus, xhr], content);
                                        }else{
                                            content.html(data);
                                        }
                                      },
                                      error: function(xhr, textStatus, errorThrown) {
                                        // 移除载入中class
                                        content.removeClass("TabLoading");
                                        // 添加载入失败信息
                                        content.append(C.option.tabMessage.LoadingFail);
                                        // 执行用户设置的error事件
                                        S.Exec(ajax.error, [xhr, textStatus, errorThrown], content);
                                      }
                                    });
                                }
                            }else{
                                var url = content.data(S.Tag.IframeURL);
                                // 如果是url,则说明content是iframe元素,设置其src
                                if(S.isURL(url)){
                                    content.attr("src", url);
                                }
                            }
                        });
                    }
                }
                return tabBtn;
            };
            TabConfig.prototype.GetTabLocation = function(tabBtn){
                ///<summary>
                /// 获取指定的选项卡按钮在选项卡显示区域中的位置
                ///</summary>
                // 选项卡按钮的横向比对基点(0表示最左侧)
                var tag = this.TabsMoveObj.TabButtonBase;
                // 计算基点相对于父容器(选项卡组)的偏移量
                tag += tabBtn.get(0).offsetLeft;    // tabBtn.get(0).offsetLeft 将获取到指定选项卡最左侧相对于父容器的偏移量
                // 获取选项卡组当前的偏移量
                var offset = this.GetNowOffset(0);
                
                // 计算指定选项卡按钮的位置
                offset += this.TabsMoveObj.ShowAreaBase + tag;
                return offset;
            };
            TabConfig.prototype.CreateTabElement = function ( tab, htmlTag ) {
                ///<summary>
                /// 根据指定选项卡配置,创建一个选项卡按钮元素,并不实际放入页面
                ///</summary>
                // 类对象的句柄
                var C = this;
                var btn = null;
                switch(htmlTag){
                    case "div":
                        btn = $("<div class='TabButton'/>");
                        break;
                    default:
                        btn = $("<li class='TabButton'/>");
                        break;}

                // 设置内部元素
                C.SetTabElement(btn, tab);

                var disable = 0.4;

                // 绑定事件
                btn.click(function (event) {
                    // 如果使用者点击的是 关闭按钮
                    //if ($(event.target).hasClass("TabCloseButton")){ return false;}
                    btn.children(".TabButtonPackage").css("opacity", 1);
                    btn.children(".TabCloseButton").css("opacity", 1);
                    if(S.GetTabOption(btn).enable === false){
                        btn.children(".TabButtonPackage").css("opacity", disable);
                        btn.children(".TabCloseButton").css("opacity", disable);
                    }else{
                        // 获取API对象
                        var api = S.GetAPI($(this).parents(".TabMainArea").eq(0));
                        // 获取对应的面板对象
                        var panel = C.GetPanelObject(btn);
                        // 面板的内部容器
                        var content = null;
                        if(panel != null){
                            content = $(".TabContent", panel);
                        }
                        // 如果不是特殊按钮(即,是普通的选项卡按钮)
                        if( btn.data(S.Tag.TabSpec) !== S.Tag.TabSpec){
                            // 执行选项卡默认点击事件,并检测其返回值
                            if(S.Exec(C.option.onTabClick, [api, content, panel, event], btn) !== false){
                                // 执行用户设置的点击事件,并检测其返回值
                                if(S.Exec(tab.onClick, [api, content, panel, event], btn) !== false){
                                    // 返回值不为 false 则继续执行默认的点击操作

                                    // 将指定选项卡按钮设置为激活按钮并显示
                                    C.ShowActiveTab(btn);
                                    // 执行选项卡默认点击后事件
                                    S.Exec(C.option.onTabClicked, [api, content, panel, event], btn); } }
                        }else{
                            // 执行按钮的点击事件
                            S.Exec(tab.onClick, [C, api, event], btn); }
                    }
                });
                // 添加关闭按钮
                if((tab.closable === true) 
                    || ((typeof tab.closable != "boolean") && (C.option.tabClosable === true))){
                    var msg = C.option.tabMessage.Close;
                    if(tab.closeMessage != null){ msg = tab.closeMessage;}
                    //var closeBtn = $("<div class='TabCloseButton' title='" + msg + "'>×</div>");
                    var closeBtn = $("<div class='TabCloseButton' title='" + msg + "'/>");
                    btn.append(closeBtn);
                    closeBtn.click(function (event) {
                        btn.children(".TabButtonPackage").css("opacity", 1);
                        closeBtn.css("opacity", 1);
                        // 如果选项卡被禁用了
                        if(S.GetTabOption(btn).enable === false){
                            btn.children(".TabButtonPackage").css("opacity", disable);
                            closeBtn.css("opacity", disable);
                        }else{
                            var api = S.GetAPI($(this).parents(".TabMainArea").eq(0));
                            // 获取对应的面板对象
                            var panel = C.GetPanelObject(btn);
                            // 面板的内部容器
                            var content = null;
                            if(panel != null){
                                content = $(".TabContent", panel);
                            }
                            // 执行选项卡默认关闭事件,并检测其返回值
                            if(S.Exec(C.option.onTabClose, [api, content, panel, event], btn) !== false){
                                // 执行用户设置的关闭事件,并检测其返回值
                                if(S.Exec(tab.onClose, [api, content, panel, event], btn) !== false){
                                    // 返回值不为 false 则继续执行默认的关闭操作
                                    //// 关闭该选项卡按钮 ...
                                    C.RemoveTabButton(btn);
                                    // 执行选项卡默认关闭后事件
                                    S.Exec(C.option.onTabClosed, [api, content, panel, event], btn); } }
                        }
                        // 阻止事件传递到祖先元素
                        event.stopPropagation();
                    });
                }

                if(tab.enable === false){
                    btn.children(".TabButtonPackage").css("opacity", disable);
                    btn.children(".TabCloseButton").css("opacity", disable);
                }
                return btn;
            };
            TabConfig.prototype.SetTabElement = function (btn, tab) {
                ///<summary>
                /// 根据指定选项卡配置对指定的按钮元素进行设置
                ///</summary>
                // 类对象的句柄
                var C = this;

                var tabPack = btn.children(".TabButtonPackage");
                if(tabPack.length <= 0){
                    btn.html("");
                    tabPack = $("<div class='TabButtonPackage'/>");
                    btn.append(tabPack);
                }

                // 重置样式
                btn.css("margin", "0");
                btn.css("padding", "3px");

                if(C.option.scrollable == false){
                    // 添加行距
                    btn.css("margin-bottom", "" + C.option.lineHeight + "px");
                }
                // 对特殊按钮不提供以下功能
                if(S.isType(tab.type, "Undefined")){
                    // 添加id
                    if(S.isType(tab.cssId, "String")){
                        btn.attr("id", S.Process(tab.cssId));
                    }else if((C.option.autoTabId === true) && S.isType(C.option.tabIdText, "String")){
                        btn.attr("id", S.Process(C.option.tabIdText) + "_" + C.TabArray.length);
                    }
                    // 添加class
                    if(S.isType(tab.cssClass, "String")){
                        btn.addClass(S.Process(tab.cssClass, "CssClass"));
                    }
                    if(S.isType(C.option.tabCssClass, "String")){
                        btn.addClass(S.Process(C.option.tabCssClass, "CssClass"));
                    }
                    // 添加选项卡UID
                    btn.data(S.Tag.TabUID, C.option.name + "_Tab_" + (C.TabCount++));
                }
                // 保存设置对象
                S.SetTabOption(btn, tab);

                // 添加选项卡图标
                if (tab.icon != null) {
                    tabPack.append("<img class='TabIcon' alt='-' src='" + tab.icon + "' />");
                }
                // 检查caption属性
                if(!S.isType(tab.caption, "String") && !S.isType(tab.caption, "Number")){
                    tab.caption = S.defaultOption.tabs.caption;
                }
                // 优先添加图片
                if (tab.image != null) {
                    // 去除内边距
                    btn.css("padding", "0");
                    tabPack.append("<img class='TabImage' alt='" + tab.caption + "' src='" + tab.image + "' />");
                // 如果不是特殊选项卡
                } else if(S.isType(tab.type, "Undefined")) {
                    // 添加选项卡文本
                    tabPack.append("<label class='TabCaption'>" + tab.caption + "</label>");
                // 如果是特殊选项卡
                }else if(!S.isType(tab.type, "Undefined")){
                    btn.addClass(tab.type);
                    // 绑定一个特殊标记
                    btn.data(S.Tag.TabSpec, S.Tag.TabSpec);
                    btn.addClass(S.Tag.TabSpec);
                }
                // 添加鼠标悬停提示信息
                if(!S.isType(tab.title, "String") && !S.isType(tab.title, "Number")){
                    tab.title = tab.caption;
                }
                btn.attr("title", tab.title);
                // 添加排序序号
                var index = tab.index;
                if(!S.isType(index, "Number") || (index < 0)){
                    index = S.defaultOption.tabs.index;
                }
                btn.data(S.Tag.TabIndex, index);

                return btn;
            };
            TabConfig.prototype.CreatePanelElement = function(tabBtn, tab){
                ///<summary>
                /// 创建一个面板元素,并不实际放入页面
                ///</summary>
                var C = this;

                if(S.isType(tab, "Undefined")){
                    tab = S.GetTabOption(tabBtn);
                }
                // 对特殊按钮不提供面板功能
                //if(S.isType(tab, "Undefined") || S.isType(tab, "Null")){ return null;}
                if(tab == null || !S.isType(tab.type, "Undefined")){ return null;}

                var panel = $("<div class='TabPanel'/>");

                var suf = "_P";
                // 添加id
                if(S.isType(tab.cssId, "String")){
                    panel.attr("id", S.Process(tab.cssId) + suf);
                }else if((C.option.autoTabId === true) && S.isType(C.option.tabIdText, "String")){
                    panel.attr("id", S.Process(tabBtn.attr("id")) + suf);
                }
                // 添加class
                function _Filter(str){
                    // 为所有的class名添加后缀
                    return S.Trim(str.replace(/\s+/g, suf + " ")) + suf;
                };
                if(S.isType(tab.cssClass, "String")){
                    panel.addClass(S.Process(tab.cssClass, "CssClass", _Filter));
                }
                if(S.isType(C.option.tabCssClass, "String")){
                    panel.addClass(S.Process(C.option.tabCssClass, "CssClass", _Filter));
                }

                // 设置面板的UID
                panel.data(S.Tag.TabUID, tabBtn.data(S.Tag.TabUID));

                var pack = $("<div class='TabPanelPackage'/>");
                panel.append(pack);

                // 隐藏
                panel.hide();
                panel.css("z-index", -1);

                return panel;
            };
            TabConfig.prototype.SetElementHeight = function (ele, height) {
                ///<summary>
                /// 设置指定元素的高度
                ///</summary>
                return this.SetElementWidth(ele, height, true);
            };
            TabConfig.prototype.SetElementWidth = function (ele, width, isHeight) {
                ///<summary>
                /// 设置指定元素的宽度
                ///</summary>
                // 如果没有给定宽度,则按照选项卡按钮的方式来设置宽度
                if (!width) {
                    if (isHeight == true){
                        this.SetTabHeight(ele);
                    }else{ this.SetTabWidth(ele);}
                } else {
                    // 实际宽度设为 减去左右边框和内边距后的值
                    //width -= S.GetStyleWidth(ele);
                    var prop = "width";
                    if (isHeight == true){ prop = "height";}
                    ele.css(prop, "" + width + "px");
                }
                return width;
            };
            TabConfig.prototype.SetTabHeight = function (tabBtn) {
                ///<summary>
                /// 设置指定选项卡按钮的高度
                ///</summary>
                var op = this.option;
                var height = op.tabHeight;
                // 实际高度设为 减去上下边框和内边距后的值
                height -= S.GetStyleWidth(tabBtn, true);
                //height -= tabBtn.get(0).offsetHeight;
                // 检查是否低于最小高度
                if (height < op.tabMinHeight){ height = op.tabMinHeight;}
                // 对内部是图片的选项卡进行特别调整
                if($(".TabImage", tabBtn).length > 0 ){
                    var temp = height - 6;
                    if(temp < op.tabMinHeight){ height += op.tabMinHeight - temp;}
                }
                tabBtn.css("height", "" + height + "px");

                return height;
            };
            TabConfig.prototype.SetTabWidth = function (tabBtn, tabWidth, isSpec) {
                ///<summary>
                /// 设置指定选项卡按钮为指定的宽度, 如果没有设置宽度则使用默认值
                ///</summary>
                var op = this.option;
                var width = op.tabWidth;
                if (tabWidth){ width = tabWidth;}
                width -= S.GetStyleWidth(tabBtn);
                //width -= tabBtn.get(0).offsetWidth;
                // 检查是否低于最小宽度
                // 如果宽度小于最小宽度且不是特殊选项卡
                if ((width < op.tabMinWidth) && (isSpec !== true)){ 
                    width = op.tabMinWidth;}
                tabBtn.css("width", "" + width + "px");

                return width;
            };
            TabConfig.prototype.AddNewTabButtons = function(tabs, index, noRefresh){
                ///<summary>
                /// 添加一个或多个tab选项卡按钮
                ///</summary>
                CC("\n\t\tAdd Tab > 添加选项卡按钮开始, 数量: " + ($.isArray(tabs) ? tabs.length : 1), this.TabView);
                if($.isArray(tabs)){
                    for (i = (tabs.length - 1); i >= 0; i--) {
                        this.AddTabButton(tabs[i], index);
                    }
                } else {
                    this.AddTabButton(tabs, index);
                }
                if(typeof index == "boolean"){ noRefresh = index;}
                if(noRefresh !== true){ this.RefreshTabButton();}
                CC("Add Tab > 添加选项卡按钮完成\n\n", this.TabView);
            };
            TabConfig.prototype.RefreshTabButton = function(){
                ///<summary>
                /// 根据TabArray的内容来刷新选项卡按钮
                ///</summary>
                var C = this;
                var view = C.TabView;
                CC("Refresh Button > 刷新选项卡组数据开始", view);
                var btnArea = $(".TabButtonArea", view).eq(0);
                // 先从DOM中移除
                //btnArea.find(".TabButton").detach();
                // 根据选项卡的排序序号进行排序
                S.SortBubble(C.TabArray, function(a,b){
                    a = +a.data(S.Tag.TabIndex);
                    b = +b.data(S.Tag.TabIndex);
                    return a - b;
                });
                if(C.TabArray.length > 0){
                    // 按顺序重新放入DOM中
                    for(i=C.TabArray.length - 1;i>=0;i--){
                        btnArea.prepend(C.TabArray[i]);
                        // 设置选项卡的间距
                        C.TabArray[i].css("margin-right", "" + C.option.spacing + "px");
                        // 重新设置排序序号
                        C.TabArray[i].data(S.Tag.TabIndex, i);
                    }
                    // 去除最后一个选项卡的右边距
                    C.TabArray[C.TabArray.length - 1].css("margin-right", "0");
                }
                CC("-- 选项卡按钮重新排序, 选项卡按钮数量: " + C.TabArray.length, view);

                C.RefreshTabsWidth();
                CC("Refresh Button > 刷新选项卡组数据完毕", view);
            };
            TabConfig.prototype.AddTabButton = function (tab, index) {
                ///<summary>
                /// 添加一个tab选项卡按钮
                ///</summary>
                var C = this;
                if (C.TabView == null) return;
                    var tabView = C.TabView,
                        btnArea = $(".TabButtonArea", tabView).eq(0);
                    
                if(S.isType(index, "Number")){
                    tab.index = index; }

                var tabBtn = C.CreateTabElement(tab);

                // 如果不是要构造普通的选项卡按钮
                if(index === false){
                    // 放入选项卡按钮组的最后面, 并且不加入数组
                    btnArea.append(tabBtn);
                    // 在左边添加间隔
                    tabBtn.css("margin-left", "" + C.option.spacing + "px");
                }else{
                    // 放入选项卡按钮组的最前面
                    btnArea.prepend(tabBtn);
                    //this.TabArray.push(tabBtn);
                    // 放入数组头部
                    C.TabArray.unshift(tabBtn);

                    // 如果使用了面板功能
                    if(C.option.usePanel === true){
                        // 创建并添加面板
                        var panel = C.CreatePanelElement(tabBtn, tab);
                        $(".TabPanelsArea", tabView).eq(0).append(panel);
                        C.PanelArray.push(panel);
                        // 构造内容对象
                        var content = $("<div class='TabContent'/>");

                        var tcont = tab.content;
                        // 捕获可能出现的跨域问题所产生的错误
                        try{
                            // 优先使用ajax
                             if(!S.isType(tab.ajax, "String") && (tab.ajax == null)){
                                if(S.isType(tcont, "String") || S.isType(tcont, "Object")){
                                    var cont = $(tcont);
                                    // 如果是选择器字符串,jQuery对象 或 HTML DOM对象
                                    if(cont.length > 0){
                                        content.append(cont);
                                    // 如果是一个URL字符串
                                    }else if(S.isURL(tcont)){
                                        // 使用内联框架
                                        content = $("<iframe class='TabContent' height='100%' width='100%' frameborder='0' scrolling='auto' onerror=\"this.src='http://" 
                                            + tcont + "';\" >" + C.option.tabMessage.ConnectFail + ": '" + tcont + "'</iframe>");
                                        // 如果载入错误,则尝试调整url
                                        content.error(function(){
                                            this.src = "http://" + tcont;
                                        })
                                        // 保存url
                                        content.data(S.Tag.IframeURL, tcont);
                                        // content.attr("src", tcont);
                                    }
                                }
                            }
                            panel.children(".TabPanelPackage").append(content);

                            // content.append(">>> " + tabBtn.data(S.Tag.TabUID));
                        }catch(err){
                            content.remove();
                            panel.children(".TabPanelPackage").append("<div class='TabContent'>" 
                                + C.option.tabMessage.ConnectFail + ": '" + tcont + "'</div>");
                        }
                    }
                }

                /// 以下部分必须在按钮实际放入页面(存在于HTML DOM之中)之后才能正确进行
                // 设置高度 =================
                C.SetTabHeight(tabBtn);
                // 设置宽度 =========================
                if (tab.width != null){ 
                    C.SetTabWidth(tabBtn, tab.width, (typeof tab.type != "undefined") ? true : false);
                }else{ C.SetTabWidth(tabBtn);}

                if (tab.active == true) {
                    C.SetActiveTab(tabBtn);
                }

                return tabBtn;
            };
            TabConfig.prototype.RemoveTabButton = function (btn) {
                ///<summary>
                /// 移除一个tab选项卡按钮
                ///</summary>
                // 类对象的句柄
                var C = this;
                CC("\n\t\tRemove Tab > 选项卡按钮删除开始", C.TabView);
                var count = btn.length - 1;
                var del = 0;
                btn.each(function(){
                    var tabBtn = $(this);
                    if(C.GetTabIndex(tabBtn) > -1){
                        tabBtn.animate({width: 0, opacity: 0}, 500, function () {
                            tabBtn.hide();
//                            tabBtn.css("opacity", 1);
                            var isAct = false;
                            if(tabBtn.hasClass("TabActive")){
                                isAct = true;
                            }
                            // 移除对应的面板
                            C.RemoveTabPanel(tabBtn.data(S.Tag.TabUID));
                            // 从页面中移除
                            tabBtn.remove();
                            // 从数组中移除
                            C.TabArray.splice(C.GetTabIndex(tabBtn), 1);
                            del++;
                            // 如果移除的是激活选项卡则将移除后的第一个选项卡设为激活并显示
                            if(isAct && (C.TabArray.length > 0)){
                                // 刷新按钮
                                C.RefreshTabButton();
                                C.ShowActiveTab(C.TabArray[0]);
                                count--;
                            } 
                            // 如果是最后一个可删除的选项卡按钮
                            else if(count <= 0){
                                // 刷新按钮
                                C.RefreshTabButton();
                                // 检查是否需要移动选项卡组
                                C.MoveTabsAfterUpdate();
                                CC("Remove Tab > 选项卡按钮删除完成, 共删除选项卡数量: " + del + "个\n\n", C.TabView);
                            }else{ count--; }
                        });
                    }else{ count--;}
                });
            };
            TabConfig.prototype.RemoveTabPanel = function (tabBtn) {
                ///<summary>
                /// 移除指定面板或选项卡按钮对应的面板或拥有指定UID的面板
                ///</summary>
                var C = this;
                var panel = C.GetPanelObject(tabBtn);
                if(panel == null){ return; }
                panel.animate({height: 0, opacity: 0}, 500, function () {
                    // 从数组中移除
                    C.PanelArray.splice(panel.data('PanelArrayIndex'), 1);
                    // 从页面中移除
                    panel.remove();
                });
            };
            TabConfig.prototype.RemoveAddButton = function ( tabsWidth ) {
                ///<summary>
                /// 移除内部'添加按钮'
                ///</summary>
                var C = this;
                var view = C.TabView;
                var btn = $(".TabButtonArea", view).eq(0).children("." + C.addButtonOption.type);
                // 如果不存在内部"添加按钮'或者 '当前'的显示区域宽度大于等于'当前'的选项卡组宽度
                if((btn.length <= 0) || (C.GetShowAreaWidth() >= tabsWidth)){ return;}
                // 计算移除内部'添加按钮'之后的选项卡组宽度
                tabsWidth -= btn.get(0).offsetWidth + C.option.spacing;
                // 移除按钮
                btn.remove();

                // 显示外部'添加按钮'
                $(".TabRightTools", view).children("." + C.addButtonOption.type).show();

                var area = $(".TabShowArea", view).eq(0);
                // 获取显示区域正常情况下的宽度
                var w = C.TabsMoveObj.ShowAreaWidthTemp;
                if(w != null){
                    // 使用暂存宽度数据
                    area.css("width", "" + w + "px");
                    // 清空暂存数据
                    C.TabsMoveObj.ShowAreaWidthTemp = null;
                }else{ area.css("width", "" + tabsWidth + "px"); }
                area.children(".TabButtonArea").eq(0).css("width", "" 
                    + tabsWidth + "px");
                CC("移除内部'添加按钮'", view);
            };
            TabConfig.prototype.CreateAddButton = function () {
                ///<summary>
                /// 创建并添加一个内部'添加按钮'
                ///</summary>
                var C = this;
                var view = C.TabView;
                if(($(".TabButtonArea", view).eq(0).children("." + C.addButtonOption.type).length > 0)
                    || C.option.noTools === true){
                    return; }
                // 添加一个内部'添加按钮'
                var btn = C.AddTabButton(S.ExtendTabs(C.addButtonOption), false);
                btn.attr("title", C.option.tabMessage.Add);
                
                // 隐藏外部'添加按钮'
                $(".TabRightTools", view).children("." + C.addButtonOption.type).hide();

                // 获取显示区域的宽度
                var w = C.GetShowAreaWidth();
                // 保存显示区域宽度
                C.TabsMoveObj.ShowAreaWidthTemp = w;
                if(C.option.scrollable == true){
                    // 获取选项卡组的总宽度
                    var width = C.GetTabsWidth();
                    var area = $(".TabShowArea", view).eq(0);
                    if(width < w){
                        area.css("width", "" + (w + btn.get(0).offsetWidth + C.option.spacing) + "px");
                    }else{
                        area.css("width", "" + width + "px"); }
                    area = $(".TabButtonArea", area).eq(0);
                    area.css("width", "" + width + "px");
                }
                CC("创建内部'添加按钮', 当前显示区域宽度: " + width, view);
            };
            //////////////////////////////////////
            TabConfig.prototype.MoveTabsAfterUpdate = function () {
                ///<summary>
                /// 检查更新(添加/移除)选项卡组后是否需要滚动选项卡组, 需要移动则返回true
                ///</summary>
                var C = this;
                if (C.option.scrollable == false){ return false;}
                var x = C.GetNowOffset(0);
                if(x >= 0){ 
                    C.MoveTabs(1);
                    //this.MoveToLeft();
                    return true; 
                }else{ 
                    var width = C.GetTabsWidth();
                    width += x;
                    width -= C.GetShowAreaWidth();
                    if (width < 0) {
                        C.MoveTabs(width);
                        return true;
                    }
                }
            };
            TabConfig.prototype.CanScroll = function(tabsWidth, showWidth){
                ///<summary>
                /// 检测插件当前是否可以滚动
                ///</summary>
                var ok = false;
                if(this.option.scrollable == true){
                    if((typeof tabsWidth != "number") || (isNaN(tabsWidth) == true)){
                        tabsWidth = this.GetTabsWidth(); }
                    if((typeof showWidth != "number") || (isNaN(showWidth) == true)){
                        showWidth = this.GetShowAreaWidth(); }
                    // 如果选项卡组区域大于显示区域
                    if(tabsWidth > showWidth){
                        ok = true; } }
                return ok;
            };
            TabConfig.prototype.ShowScroll = function (callback, isHide) {
                ///<summary>
                /// 显示滚动按钮
                ///</summary>
                var C = this;
                var view = C.TabView;
                var enb = true;
                var obj = $(".TabScrollBtn", view);
                // 缩减为匹配到的前两个
                obj = obj.slice(0, 2);
                if (isHide == true) {
                    if(!obj.is(":hidden")){
                        CC("隐藏滚动按钮", view);
                        obj.hide();
                        // 创建内部'添加按钮'
                        C.CreateAddButton();
                        enb = false;
                    }
                } else{
                    if(obj.is(":hidden")){
                        CC("显示滚动按钮", view);
                        obj.show();
                    }
                }
                C.EnabledScrollingLeft(enb);
                C.EnabledScrollingRight(enb);
                
                S.Exec(callback, null, view);
            };
            TabConfig.prototype.HideScroll = function (callback) {
                ///<summary>
                /// 隐藏滚动按钮
                ///</summary>
                this.ShowScroll(callback, true);
            };
            TabConfig.prototype.EnabledScrollingLeft = function (enabled, time, callback) {
                ///<summary>
                /// 启用或禁用左滚动按钮
                ///</summary>
                CC("设置'左'滚动按钮启用状态: " + enabled, this.TabView);
                this.EnabledScrolling($(".TabLeftBtn", this.TabView), enabled, time, callback);
            };
            TabConfig.prototype.EnabledScrollingRight = function (enabled, time, callback) {
                ///<summary>
                /// 启用或禁用右滚动按钮
                ///</summary>
                CC("设置'右'滚动按钮启用状态: " + enabled, this.TabView);
                this.EnabledScrolling($(".TabRightBtn", this.TabView), enabled, time, callback);
            };
            TabConfig.prototype.EnabledScrolling = function(btn, enabled, time, callback){
                ///<summary>
                /// 启用或禁用指定滚动按钮
                ///</summary>
                if (btn.css("display") != "none") {
                    var noTime = false;
                    if (!time || ((typeof time) != "number") || (time <= 0)) {
                        // 如果没有设置时间
                        noTime = true;
                        if(typeof time == "function") callback = time;
                    }
                    var C = this;
                    if (enabled == true) {
                        // 启用
                        btn.data(S.Tag.ScollEnabled, "true");
                        if(noTime == true){
                            btn.css("opacity", 1);
                            C.ExecSelfFun(callback);
                        }else{
                            btn.animate({opacity: 1}, time, "linear", function(){
                                C.ExecSelfFun(callback);
                            });
                        }
                    } else {
                        // 禁用
                        btn.data(S.Tag.ScollEnabled, "false");
                        if(noTime == true){
                            btn.css("opacity", 0.4);
                            C.ExecSelfFun(callback);
                        }else{
                            btn.animate({opacity: 0.4}, time, "linear", function(){
                                C.ExecSelfFun(callback);
                            });
                        }
                    }
                } else {
                    // 不显示的滚动按钮将被禁用
                    btn.data(S.Tag.ScollEnabled, "false");
                }
            };
            TabConfig.prototype.GetLeftScollEnabled = function(isRight){
                ///<summary>
                /// 获取左滚动按钮的启用状态
                ///</summary>
                var btn;
                if(isRight == true){ btn = $(".TabRightBtn", this.TabView);
                }else{ btn = $(".TabLeftBtn", this.TabView);}
                return btn.data(S.Tag.ScollEnabled);
            };
            TabConfig.prototype.GetRightScollEnabled = function(){
                ///<summary>
                /// 获取右滚动按钮的启用状态
                ///</summary>
                return this.GetLeftScollEnabled(true);
            };
            TabConfig.prototype.CheckScrollEnabled = function (callback) {
                ///<summary>
                /// 检查并调整滚动条的启用或禁用状态
                ///</summary>
                var C = this;
                var btnArea = $(".TabButtonArea", C.TabView).eq(0);
                // 获取当前偏移位置
                var x = C.GetNowOffset(0);
                var time = 250;
                // 如果当前位置在'最左'与'最右' 之间
                if ((x < 0) && (x > C.TabsMoveObj.MinOffset)) {
                    var flag = false;
                    // 如果左滚动按钮被禁用了
                    if(C.GetLeftScollEnabled() == "false"){
                        C.EnabledScrollingLeft(true, time, callback);
                        // 销毁可能存在的callback, 防止后面的语句重复执行这个callback
                        callback = null;
                        flag = true;
                    }
                    if(C.GetRightScollEnabled() == "false"){
                        C.EnabledScrollingRight(true, time, callback);
                        flag = true;
                    }
                    if(flag == false){
                        C.ExecSelfFun(callback);
                    }
                } else {
                    // 如果在'最左'端
                    if (x >= 0) {
                        // 禁用左滚动
                        C.EnabledScrollingLeft(false, time, callback);
                        // 如果插件当前还可以移动且'右滚动'按钮被禁用了
                        if((C.TabsMoveObj.MinOffset != 0) 
                            && (C.GetRightScollEnabled() == "false")){
                            C.EnabledScrollingRight(true, time);
                        }
                    // 如果在'最右'端
                    }else if (x <= C.TabsMoveObj.MinOffset) {
                        // 禁用右滚动
                        C.EnabledScrollingRight(false, time, callback);
                        // 如果插件当前还可以移动且'左滚动'按钮被禁用了
                        if((C.TabsMoveObj.MinOffset != 0) 
                            && (C.GetLeftScollEnabled() == "false")){
                            C.EnabledScrollingLeft(true, time);
                        }
                    }
                }
            };
            TabConfig.prototype.GetShowAreaWidth = function () {
                ///<summary>
                /// 获取选项卡显示区域的宽度
                ///</summary>
                var V = this.TabView.get(0);
                var showArea = $(".TabShowArea", V).eq(0);
                // var leftTool = $(".TabLeftTools", V).eq(0).get(0);
                // var rightTool = $(".TabRightTools", V).eq(0).get(0);
                // var leftBtn = $(".TabLeftBtn", V).eq(0).get(0);
                // var rightBtn = $(".TabRightBtn", V).eq(0).get(0);
                // 刷新显示区域的宽度
                showArea.width(V.offsetWidth 
                    - $(".TabLeftTools", V).eq(0).get(0).offsetWidth - $(".TabRightTools", V).eq(0).get(0).offsetWidth
                    - $(".TabLeftBtn", V).eq(0).get(0).offsetWidth - $(".TabRightBtn", V).eq(0).get(0).offsetWidth);

                return showArea.get(0).clientWidth;
            };
            TabConfig.prototype.GetTabsWidth = function ( flag ) {
                ///<summary>
                /// 获取选项卡组的宽度, 根据选项卡数量和各选项卡的实际设置来进行宽度的计算, 
                /// flag为false时将只计算普通的选项卡按钮的宽度
                ///</summary>
                var tabs = this.TabArray;
                var width = 0;
                var spac = this.option.spacing;
                var l = tabs.length - 1
                for (i = 0; i <= l; i++) {
                    //var w = tabs[i].get(0).clientWidth;
                    var w = tabs[i].get(0).offsetWidth;
                    if (w != 0) {
//                        // 选项卡本身的宽度 + 左右边框宽度 + 选项卡间的间距
//                        var border = S.GetBorderWidth(tabs[i], 0, false);
//                        width += w + (border.left + border.right) + spac;
                        width += w; 
                        // 最后一个不加间隔
                        if( i < l){ width += spac;}
                    } 
                }
                var obj = $(".TabButtonArea", this.TabView).children("." + S.Tag.TabSpec);
                l = obj.length;
                // 如果有特殊按钮
                if((flag != false) && (l > 0)){
                    for(i=l-1; i>=0; i--){
                        // 获取特殊按钮的外边距
                        var mL = +obj.css("margin-left").replace("px");
                        if(isNaN(mL)){ mL = 0;}
                        var mR = +obj.css("margin-right").replace("px");
                        if(isNaN(mR)){ mR = 0;}
                        // 使用其中最大的一个
                        mL = Math.max(mL, mR);
                        if(mL <= 0){
                            // 加上特殊按钮及间隔
                            width += obj.get(0).offsetWidth + spac; 
                        }else{ width += obj.get(0).offsetWidth + mL; }
                    }
                }
                return width;
            };
            TabConfig.prototype.CheckScrollVisibility = function (tabsAreaWidth) {
                ///<summary>
                /// 检查并调整滚动按钮的可见性
                ///</summary>
                CC("检查并调整滚动按钮的可见性", this.TabView);
                //if (!tabsAreaWidth) tabsAreaWidth = this.GetTabsWidth();
                // 当设置为可滚动,并且选项卡组区域的宽度大于选项卡显示区域的宽度时才会显示滚动按钮
                if(this.CanScroll(tabsAreaWidth, this.GetShowAreaWidth())){
                    this.ShowScroll();
                } else {
                    this.HideScroll();
                }
            };
            TabConfig.prototype.RefreshTabsWidth = function () {
                ///<summary>
                /// 根据选项卡数量和各选项卡的实际设置来刷新选项卡组的宽度, 返回刷新后的宽度
                ///</summary>
                var C = this;
                if(C.option.scrollable == true) {
                    CC("Refresh Width > 刷新选项卡组宽度开始", C.TabView);
                    var width = C.GetTabsWidth();

                    // 移除内部'添加按钮'
                    C.RemoveAddButton(width);
                    //var width = this.GetTabsWidth();
                    var btnArea = $(".TabButtonArea", C.TabView).eq(0);
                    btnArea.css("width", "" + width + "px");
                    CC("-- 更新选项卡组宽度, 选项卡组宽度: " + width, C.TabView);

                    C.RefreshTabsMoveObj();
                    C.CheckScrollVisibility(width);
                
                    CC("Refresh Width > 刷新选项卡组宽度完毕", C.TabView);
                    return width;
                }else return null;
            };
            TabConfig.prototype.RefreshTabsMoveObj = function () {
                ///<summary>
                /// 刷新选项卡组移动所需要的数据
                ///</summary>
                var widthA = this.GetShowAreaWidth();
                var widthB = this.GetTabsWidth();
                if (widthB > widthA) {
                    this.TabsMoveObj.MinOffset = widthA - widthB;
                } else {
                    this.TabsMoveObj.MinOffset = 0; }
                this.TabsMoveObj.toString(this.TabView, "刷新选项卡组移动数据信息,");
                //CC("刷新选项卡组移动数据信息, 选项卡组最大可偏移横坐标: " + this.TabsMoveObj.MinOffset, this.TabView);
            };
            TabConfig.prototype.UseScroll = function (use) {
                ///<summary>
                /// 使用滚动功能
                ///</summary>
                var C = this;
                var tabs = $(".TabButtonArea", C.TabView).eq(0);
                if (use == true) {
                    CC("== 启用滚动功能 ==", C.TabView);
                    // 修改配置
                    C.option.scrollable = true;

                    tabs.css("width", "" + C.GetTabsWidth() + "px");
                    tabs.css("position", "relative");

                    // 移除行距
                    tabs.children(".TabButton").css("margin-bottom", "0");
                    
                    // 设置步进距离
                    C.TabsMoveObj.StepDistance = C.option.moveOffset;
                    // 刷新
                    C.RefreshTabsWidth();

                    var act = tabs.children(".TabActive").eq(0);
                    var x = C.GetNowOffset(0);
                    // 如果存在激活的选项卡按钮
                    if(act.length == 1){
                        C.MoveToTabButton(act);
                    // 如果当前位置处于最左边
                    }else if(x >= C.TabsMoveObj.MaxOffset){ 
                        C.MoveToLeft();
                    // 如果当前位置处于最右边
                    }else if(x <= C.TabsMoveObj.MinOffset){ 
                        C.MoveToRight();
                    }

                    CC("== 启用滚动功能结束 ==", C.TabView);

                } else {
                    CC("== 禁用滚动功能 ==", C.TabView);
                    C.option.scrollable = false;
                    use = false;

                    C.HideScroll();
                    tabs.css("width", "100%");
                    tabs.css("position", "static");
                    tabs.css("left", 0);
                    
                    // 添加行距
                    tabs.children(".TabButton").css("margin-bottom", "" + C.option.lineHeight + "px");
                    
                }
                return use;
            };
            TabConfig.prototype.GetNowOffset = function (failNum) {
                ///<summary>
                /// 获取选项卡组当前的偏移量; 
                /// 若给定了failNum, 则获取失败后的返回值为failNum, 否则返回NaN
                ///</summary>
                // 在字符串之前添加 + 运算符可以将字符串转为十进制数字,转换失败则值为 NaN
                // 注意: IE下,未显示设置过left样式的,left值为'auto',而火狐则是'0px'
                var offset = +$(".TabButtonArea", this.TabView).eq(0).css("left").replace("px", "");
                if (isNaN(offset) == true) {
                    offset = failNum; }
                return offset;
            };
            TabConfig.prototype.MoveToTabButton = function(tabBtn){
                ///<summary>
                /// 移动选项卡组,以显示指定的选项卡按钮
                ///</summary>
                if(this.CanScroll() == true){
                    CC("移动到指定的选项卡按钮 ===", this.TabView);
                    this.MoveTabs(-this.GetTabLocation(tabBtn)); }
            };
            TabConfig.prototype.MoveToPosition = function(position, time, isVelocity){
                ///<summary>
                /// 移动到指定位置
                ///</summary>
                var C = this;
                // 获取需要移动的距离
                var offset = position - C.GetNowOffset(0);
                // 如果time代表的是速度(单位: 毫秒/像素)
                if((isVelocity === true) && S.isType(time, "Number")){
                    // 计算所需时间
                    time = Math.abs(offset / time);
                }
                // 开始移动
                C.MoveTabs(offset, time);
            };
            TabConfig.prototype.MoveToLeft = function (toRight, callback) {
                ///<summary>
                /// 向左移动选项卡按钮组
                ///</summary>
                CC("向" + (toRight == true ? "右" : "左") + "滚动 ===", this.TabView);
                var offset = Math.abs(this.TabsMoveObj.StepDistance);

                if (toRight == true) offset = -offset;
                else if( ((typeof toRight) == "function") && !callback) callback = toRight;
                this.MoveTabs(offset, callback);
            };
            TabConfig.prototype.MoveToRight = function (callback) {
                ///<summary>
                /// 向右移动选项卡按钮组
                ///</summary>
                this.MoveToLeft(true, callback);
            };
            TabConfig.prototype.MoveTabs = function (offset, time, callback) {
                ///<summary>
                /// 将选项卡按钮组移动指定的距离
                ///</summary>
                // 类对象的句柄
                var C = this;
                if(typeof time == "function"){
                    callback = time;
                }
                if (typeof time != "number"){
                    time = "slow";
                }
                // 获取当前偏移位置
                var x = C.GetNowOffset(0);
                CC("滚动开始, 当前偏移位置: " + x, C.TabView);

                // 刷新偏移数据
                C.RefreshTabsMoveObj();
                if (((x == 0) && (offset > 0))
                     || ((x == C.TabsMoveObj.MinOffset) && (offset < 0))) {
                    // 如果当前位置已经在极限位置(最左或最右端),而接下来的移动又会导致超出极限位置时,取消移动
                    C.CheckScrollEnabled(callback);
                    CC("当前位置无法滚动, 中止, 当前偏移位置: " + x, C.TabView);
                    return;
                } else {
                    // 如果当前没有在极限位置,但接下来的移动又会导致超出极限位置时,调整偏移量或取消移动
                    var temp = offset + x;
                    if (temp > 0) {
                        offset -= temp; // 0 - temp + offset
                    } else if (temp < C.TabsMoveObj.MinOffset) {
                        offset = C.TabsMoveObj.MinOffset - temp + offset;
                    }
                    if (offset == 0){
                        C.CheckScrollEnabled(callback);
                        CC("实际步进量为: 0, 滚动中止, 当前偏移位置: " + x, C.TabView);
                        return;
                    }
                }
                var btnArea = $(".TabButtonArea", C.TabView).eq(0);
                btnArea.clearQueue().animate({ "left": "+=" + offset + "px" }, time, function () {
                    C.CheckScrollEnabled(callback);
                    CC("滚动结束, 实际步进量: " + offset + ", 当前偏移位置: " + C.GetNowOffset(), C.TabView);
                });
            };
            TabConfig.prototype.ShowAdvance = function(){
                ///<summary>
                /// 显示选项卡进级设置面板
                ///</summary>
                var advance = this.AdvancePanel;
                advance instanceof $ ? advance.show() : 0;
            };
            TabConfig.prototype.CloseAdvance = function(){
                ///<summary>
                /// 关闭选项卡进级设置面板
                ///</summary>
                var advance = this.AdvancePanel;
                advance instanceof $ ? advance.hide() : 0;
            };
            TabConfig.prototype.Init = function(){
                ///<summary>
                /// 初始化配置, 运行插件
                ///</summary>
                var C = this;
                var view = C.TabView;
                var op = C.option;
                var dfop = S.defaultOption;
                /// 构造插件的HTML结构==================
                CC("开始构造插件HTML内部结构", view);

                // 左工具区
                var leftTool = $("<div class='TabLeftTools'/>"),
                // 右工具区
                    rightTool = $("<div class='TabRightTools'/>");

                // 向左按钮
                var leftBtn = $("<div class='TabLeftBtn TabScrollBtn'>&nbsp;</div>"),
                // 向右按钮
                    rightBtn = $("<div class='TabRightBtn TabScrollBtn'>&nbsp;</div>");

                // 选项卡按钮显示区域
                var showArea = $("<div class='TabShowArea'/>");

                // 选项卡按钮主体
                var btnArea = $("<ul class='TabButtonArea'/>");

                // 工具区域
                var toolsArea = $("<div class='TabToolsArea'/>");

                // 面板显示区域
                var panelArea = $("<div class='TabPanelsArea'/>");
                // 面板包装区域(计划用于'移动显示激活面板'--动画)
                var panelWrap = $("<div class='TabPanelsWrap'/>").hide();

                view.append(leftTool);
                view.append(leftBtn);
                view.append(showArea);
                view.append(rightBtn);
                view.append(rightTool);
                view.append(toolsArea);
                view.append(panelArea);
                showArea.append(btnArea);
                panelArea.append(panelWrap);

                // // 设置显示区域的宽度 (比主区域短)
                // showArea.width(view.get(0).clientWidth - 120);
                // 设置面板区域显隐
                if(C.option.usePanel !== true){
                    panelArea.hide();
                }
                CC("主要结构构造完毕, 开始添加选项卡按钮", view);

                // 构造选项卡按钮
                if(op.tabs != null){
                    C.AddNewTabButtons(op.tabs); }
                //CC("选项卡按钮添加完成", view);
            
                if(op.noTools !== true){
                    CC("添加工具按钮", view);
                    // 在左工具区添加'展开/收起'按钮
                    function ExpanFun(btn, noExpan){
                        if(noExpan == true){
                            btn.attr("title", op.tabMessage.Expansion);
                            btn.children(".TabButtonPackage").text("∨");
                        }else{
                            btn.attr("title", op.tabMessage.Shrink);
                            btn.children(".TabButtonPackage").text("∧");
                        }
                    };
                    var expanOp = {
                        caption: op.tabMessage.Expansion,
                        width: 19,
                        closable: false,
                        type: "TabExpanBtn",
                        onClick: function(){
                            ExpanFun(this, S.TriggerScroll(view) == true);
                            return false;
                        }
                    };
                    expanOp = S.ExtendTabs(expanOp);
                    var expanBtn = C.CreateTabElement(expanOp, "div");
                    ExpanFun(expanBtn, op.scrollable);
                    leftTool.append(expanBtn);

                    // 在右工具区域添加一个外部'添加按钮'
                    // 修改提示信息
                    C.addButtonOption.caption = op.tabMessage.Add;
                    var addOp = S.ExtendTabs(C.addButtonOption);
                    var addBtn = C.CreateTabElement(addOp, "div");
                    rightTool.append(addBtn);
                    var tempArray = [[expanBtn, expanOp.width], 
                                    [addBtn, addOp.width]];
                    for(var l=tempArray.length, i=0; i<l; i++){
                        C.SetTabWidth(tempArray[i][0], tempArray[i][1], true);
                        C.SetElementHeight(tempArray[i][0]);
                        tempArray[i][0].css("margin", "0 3px");
                    }

                    // // 在主工具区添加一个遮罩层
                    // var mask = $("<div class='JQueryTabViewMask'/>");
                    // toolsArea.append(mask);

                    // 获取一个选项卡进级配置面板
                    var advance = $(".JQueryTabViewAdvance", $("body")).eq(0);
                    if(advance.length <= 0){
                        advance = $("<div class='JQueryTabViewAdvance TabAdvance'><h5 class='TabAdvanceTitle'>选项卡进级设置</h5><div class='TabAdvancePackage'/></div>");
                        $("body").append(advance);
                        var adPack = advance.children(".TabAdvancePackage");
                        // 构造一个选项卡(在此之前advance和adPack对象必须已经存在于HTML页面之中并且是可视的!)
                        adPack.JQueryTabView({
                            tabs: [{
                                caption: "常规"
                            },{
                                caption: "内容"
                            },{
                                caption: "外观"
                            },{
                                caption: "事件",
                                title: "'事件'当前不可用",
                                enable: false
                            }],
                            active: 0,
                            spacing: 0,
                            padding: 0,
                            tabWidth: 127,
                            tabClosable: false,
                            // 不将noTools设置成true的话程序可能出错!
                            noTools: true
                        });
                        var adBtns = advance.find(".TabButton").css("background-image", "none");
                        adBtns.css("border", "1px solid #adf");
                        adBtns.css("border-bottom-color", "transparent");
                        var adOK = $("<input type='button' value='OK'/>");
                        adOK.css("margin-right", "50px");
                        var adCancel = $("<input type='button' value='Cancel'/>");
                        var adTemp = $("<div style='text-align:center;margin:10px 0;'/>");
                        adTemp.append(adOK);
                        adTemp.append(adCancel);
                        advance.append(adTemp);

                        advance.hide();
                        
                        advance.css("left", "650px");
                    }
                    // 保存进级设置面板
                    C.AdvancePanel = advance;

                }else{
                    // 若不生成工具,则必须默认可滚动
                    op.scrollable = true;
                    // 重新设置显示区域的宽度
                    // showArea.width(view.get(0).clientWidth - 34);
                }
                CC("插件HTML内部结构构造完毕", view);
                /// =================================
                // 设置默认激活的选项卡
                if(S.isType(op.active, "Number")){
                    // 取绝对值
                    op.active = Math.abs(op.active);
                    // C.SetActiveTab(op.active);
                    C.ShowActiveTab(C.SetActiveTab(op.active));
                }else if(typeof op.active == "string"){
                    op.active = S.Trim(op.active);
                    var temp = null;
                    if((op.active.indexOf("#") == 0) || (op.active.indexOf(".") == 0)){
                        // 如果是CSS的id或class
                        temp = btnArea.children(op.active).eq(0);
                    }
                    if(C.GetTabIndex(temp) > -1){
                        // C.SetActiveTab(temp);
                        C.ShowActiveTab(temp);
                    }
                }else if(typeof op.active == "object"){
                    // C.SetActiveTab($(op.active));
                    C.ShowActiveTab($(op.active));
                }
                // 启用或禁用滚动功能
                $.fx.off = true;
                C.UseScroll(op.scrollable);
                $.fx.off = false;
                if(C.CanScroll() == false){ $(".TabAddButton", rightTool).hide();};

                // 高度设置为与选项卡组的按钮一样(不含边框)
                var h = btnArea.children(".TabButton").eq(0).get(0).clientHeight;
                C.SetElementHeight(leftBtn, h);
                C.SetElementWidth(leftBtn, 15);
                C.SetElementHeight(rightBtn, h);
                C.SetElementWidth(rightBtn, 15);
            
                // 向左按钮, 单击事件
                leftBtn.click(function (event) {
                    // 如果当前可以移动,且不是'连续移动'
                    if ( ($(this).data(S.Tag.ScollEnabled) === "true") 
                            && ($(this).data(S.Tag.TabsMove) !== "true") ) {
                        C.MoveToLeft(op.onScrolledLeft);
                    }
                });
                // 双击事件
                leftBtn.attr("title", op.tabMessage.ScrollLeft);
                leftBtn.dblclick(function(){
                    // 如果当前可以移动,且不是'连续移动'
                    if ( ($(this).data(S.Tag.ScollEnabled) === "true") 
                            && ($(this).data(S.Tag.TabsMove) !== "true") ) {
                        if(C.TabArray.length > 0){ C.MoveToTabButton(C.TabArray[0]); } }
                });
                function DoMove(obj, position){
                    ///<summary>
                    /// 开始连续移动
                    ///</summary>
                    obj.data(S.Tag.TabsMove, "false");
                    if (obj.data(S.Tag.ScollEnabled) === "true") {
                        // 设置定时器
                        obj.data(S.Tag.TabTimeOut, setTimeout(function(){
                            // 设置'连续移动'标记
                            obj.data(S.Tag.TabsMove, "true");
                            // 以指定速度(每毫秒0.25像素)移动到最左边
                            //C.MoveToPosition(position, 0.25, true);
                            C.MoveToPosition(position, op.moveSpeed, true);
                        // 用户按住鼠标400毫秒后开始连续移动
                        }, 400));
                    }
                }
                function StopMove(obj){
                    ///<summary>
                    /// 停止连续移动
                    ///</summary>
                    // 获取定时器
                    var timeOut = obj.data(S.Tag.TabTimeOut);
                    if((typeof timeOut != "undefined") && (timeOut != null)){
                        // 清除定时器
                        clearTimeout(timeOut);
                        obj.data(S.Tag.TabTimeOut, null);
                        if(obj.data(S.Tag.TabsMove) === "true"){
                            var t = setTimeout(function(){
                                // 停止连续移动
                                btnArea.stop();
                                C.CheckScrollEnabled();
                                clearTimeout(t);
                            // 延迟一定毫秒停止
                            }, 250);
                        }
                    }
                }
                // 鼠标按下事件
                leftBtn.mousedown(function(event){
                    // 开始连续移动
                    DoMove($(this), C.TabsMoveObj.MaxOffset);
                });
                // 向右按钮, 单击事件
                rightBtn.click(function () {
                    // 如果当前可以移动,且不是'连续移动'
                    if ( ($(this).data(S.Tag.ScollEnabled) === "true") 
                            && ($(this).data(S.Tag.TabsMove) !== "true") ) {
                        C.MoveToRight(op.onScrolledRight);
                    }
                });
                // 双击事件
                rightBtn.attr("title", op.tabMessage.ScrollRight);
                rightBtn.dblclick(function(){
                    // 如果当前可以移动,且不是'连续移动'
                    if ( ($(this).data(S.Tag.ScollEnabled) === "true") 
                            && ($(this).data(S.Tag.TabsMove) !== "true") ) {
                        var l = C.TabArray.length;
                        if(l > 0){C.MoveToTabButton(C.TabArray[l - 1]);}
                    }
                });
                // 鼠标按下事件
                rightBtn.mousedown(function(event){
                    // 开始连续移动
                    DoMove($(this), C.TabsMoveObj.MinOffset);
                });
                
                var scollBtn = $(".TabScrollBtn");
                // 滚动按钮的鼠标松开事件
                scollBtn.mouseup(function(event){
                    // 停止连续移动
                    StopMove($(this));
                });
                // 滚动按钮的鼠标离开事件
                scollBtn.mouseleave(function(){
                    $(this).mouseup();
                });

                // 处理在opera浏览器下的显示bug
                if( (C.TabArray.length <= 0) && (typeof opera != "undefined")){
                    btnArea.width($(".TabButton", btnArea).eq(0).get(0).offsetWidth + 25);
                }
            };  /// 初始化函数结束 ====================================

            // 创建'类共有部分已经构造'标记,防止重复定义类方法
            TabConfig._i_initialized_i_ = true;
        }
    };

    // 插件函数入口 ///////////////////////////////////////////////////////////////////////////////////////////
    $.extend($.fn, {
        JQueryTabView: function (setting) {
            ///<summary>
            /// JQuery选项卡插件
            ///</summary>
            
            // 检查使用者是否提供了设置对象
            if(S.isType(setting, "Undefined")){ setting = {};}
            // 执行初始化事件函数
            S.Exec(setting.onInit, null, this);

            $.fn.JQueryTabView.toString = function () { return "JQuery选项卡 \n\tAuthor: Darkmuleth"; };
            
            // 默认设置
            var dfop = S.defaultOption;
            // 默认插件设置
            $.fn.JQueryTabView.defaultOption = S.Copy(dfop);

            var op = S.ExtendOption(setting);
            if (op == null) {
                CC(S.TabViewCount + " > 插件初始化失败");
                return;
            }
            ////////////// 对插件设置进行检查 //////////
            // 如果使用者没有添加选项卡
            if(S.isType(setting.tabs, "Undefined")){ op.tabs = null; }
            // 检查最小高度
            if (!S.isType(op.tabMinHeight, "Number")){
                op.tabMinHeight = S.defaultOption.tabMinHeight;
            }else if (op.tabMinHeight < 0){ op.tabMinHeight = Math.abs(op.tabMinHeight);}
            // 检查最小宽度
            if (!S.isType(op.tabMinWidth, "Number")){
                op.tabMinWidth = S.defaultOption.tabMinWidth;
            }else if (op.tabMinWidth < 0){ op.tabMinWidth = Math.abs(op.tabMinWidth);}
            // 检查步进距离
            if (!S.isType(op.moveOffset, "Number") || (op.moveOffset === 0)) {
                op.moveOffset = dfop.moveOffset;
            }else if(op.moveOffset < 0){
                op.moveOffset = Math.abs(op.moveOffset);
            }
            // 检查移动速度
            if(!S.isType(op.moveSpeed, "Number") || (op.moveSpeed === 0)){
                op.moveSpeed = dfop.moveSpeed;
            }else if(op.moveSpeed < 0){
                op.moveSpeed = Math.abs(op.moveSpeed);
            }
            //检查间距
            if(!S.isType(op.spacing, "Number")){
                op.spacing = dfop.spacing;
            }
            // 检查行距
            if(!S.isType(op.lineHeight, "Number")){
                op.lineHeight = dfop.lineHeight;
            }
            
            // 插件目标区域
            var Target = $(this).addClass("TabParent");
            // 插件主区域
            var view = $("<div class='TabMainArea'/>");
            // 将主区域添加进目标区域
            Target.append(view);

            // 新建一个选项卡配置
            var C = new TabConfig(view, op);


            // 将配置对象放入自身的DOM对象中去
            S.SetConfig(view, C);
            // 注册
            S.Registration(view);

            // 设置插件的uid
            if(!op.name || !S.isType(op.name, "String")){ op.name = dfop.name;}
            view.data(S.Tag.ViewUID, op.name + "_" + S.TabViewCount++ );
            CC("插件用户配置扩展完成, 获取UID: " + S.GetTabViewUID(view), view);
            

            // 运行配置对象, 初始化插件 ////////
            C.Init();

            //////// 以下定义插件精确 API /////////////////////////////////////////////////////
            var api = {
                GetTabViewIndex: function(){
                    /// 获取当前插件对象在选项卡列表中的序号
                    return S.GetTabViewIndex(view);
                },
                GetTabViewUID: function(){
                    /// 获取选项卡插件的uid
                    return S.GetTabViewUID(view);
                },
                GetConfig: function(){
                    /// 获取配置对象
                    return S.GetConfig(view);
                },
                UseScroll: function(use){
                    /// 启用或禁用滚动功能, 如果不显示设置是否启用, 将默认启用滚动
                    return S.UseScroll(view, use);
                },
                TriggerScroll: function(){
                    /// 启用或禁用滚动功能
                    return S.TriggerScroll(view);
                },
                AddTabButton: function (tabs, index) {
                    /// 添加新的选项卡按钮
                    S.AddTabButton(view, tabs, index);
                },
                RemoveTabButton: function(tabBtn){
                    /// 移除选项卡按钮
                    S.RemoveTabButton(view, tabBtn);
                }
            };
            // 扩展
            api = $.extend(Target, api);
            // 保存api句柄
            S.SetAPI(view, api);
            //////// 精确 API 设置结束 /////////////////////////////////////////////////////

            CC("==== 初始化完成 ====\n\n", view);

            // 执行准备完成事件函数
            S.Exec(op.onReady, [api], view);

            // 返回api句柄对象
            return S.GetAPI(view);
        },
        //////// 以下定义插件全局 API /////////////
        GetTabViewIndex: function(){
            ///<summary>
            /// 获取当前插件对象在选项卡列表中的序号
            ///</summary>
            // 注意: 因为此处的插件对象(主区域对象)是查找目标区域的符合条件的第一个主区域对象,
            // 所以当目标区域中构造了多个选项卡插件后,将可能会导致取值不如人意(此后的类似方法都存在此问题)
            return S.GetTabViewIndex($(".TabMainArea", this).eq(0));
        },
        GetTabViewUID: function(){
            ///<summary>
            /// 获取选项卡插件的uid
            ///</summary>
            return S.GetTabViewUID($(".TabMainArea", this).eq(0));
        },
        UseScroll: function(use){
            ///<summary>
            /// 启用或禁用滚动功能, 如果不显示设置是否启用, 将默认启用滚动
            ///</summary>
            return S.UseScroll($(".TabMainArea", this).eq(0), use);
        },
        TriggerScroll: function(){
            ///<summary>
            /// 启用或禁用滚动功能
            ///</summary>
            return S.TriggerScroll($(".TabMainArea", this).eq(0));
        },
        AddTabButton: function (tabs, index) {
            ///<summary>
            /// 添加新的选项卡按钮
            ///</summary>
            // 获取插件的配置对象
            S.AddTabButton($(".TabMainArea", this).eq(0), tabs, index);
            return $(this);
        },
        RemoveTabButton: function(tabBtn){
            ///<summary>
            /// 移除选项卡按钮
            ///</summary>
            S.RemoveTabButton($(".TabMainArea", this).eq(0), tabBtn);
            return $(this);
        }
    });

})(jQuery);