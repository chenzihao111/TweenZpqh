//挂载对象
var chen = {};

chen.timeScroll = null       //挂载整屏动画切换的实例 
chen.currentStep = 'step1';  //当前的step

//初始化函数
chen.init = function(){
    chen.resize() //设置每一屏的高度和top值
    chen.events() //配置事件
    chen.configIntAnimate() //配置导航条的动画
    $('body').height(8500);
	chen.button3D(".start",".state1",".state2",0.3);
	chen.configTimeScroll(); //配置横屏切换的动画
	twoAnimate.init() ////配置第二屏里面的动画
}

//DOM加载完
$(document).ready(chen.init);


//配置事件的函数
chen.events = function(){
	$(window).resize(chen.resize) //窗口视图变化
	chen.nav();   //首屏交互
	$(window).bind('scroll',scrollFn); //浏览器滚动事件
	function scrollFn(){
		$(window).scrollTop(0);
	}
	//在滚动条滚动的过程中,计算页面中应该到哪一个时间点上去
	$(window).bind('scroll',chen.scrollStatus);

    //当mousedown的时候,解除scroll事件对应的scrollFn
    $(window).bind('mousedown',function(){
    	$(window).unbind('scroll',scrollFn)
    })

    //当mouseup的时候，让当前这一屏到达某个状态
	$(window).bind('mouseup',chen.mouseupFn)

	//滑动时阻止window的默认滚动
	$('.wrapper').bind('mousewheel',function(ev){  
        ev.preventDefault();
	})

	$('.wrapper').one('mousewheel',mousewheelFn)  //mousewheel时的交互
	var timer = null;
	function mousewheelFn(ev,direction){
		$(window).unbind('scroll',scrollFn); //解绑浏览器滚动事件
		clearTimeout(timer)
		if(direction<1){
		   //获取当前时间
		   var currentTime = chen.timeScroll.getLabelTime(chen.currentStep)
           //获取下一个状态值step，
           var afterStep = chen.timeScroll.getLabelAfter(currentTime)
           if(!afterStep)return;
           
           //获取动画的总时长
           var totalTIme = chen.timeScroll.totalDuration();
           //获取下个状态的时长
           var afterTime = chen.timeScroll.getLabelTime(afterStep);
           //获取到滚动条能够滚动的最大高度
           var maxH = $('body').height() - $(window).height();
           //计算出滚动条滚动的距离
           var positionY = afterTime/totalTIme * maxH;
           //滚动条滚动的距离的持续时间
           var d = Math.abs( chen.timeScroll.time() - afterTime );

           var scrollAnimate = new TimelineMax();
           scrollAnimate.to('html,body',d,{scrollTop:positionY}) //ff 滚动条实在html上的      

           //运动到下一个状态
           //chen.timeScroll.tweenTo(afterStep)
           //更新chen.currentStep 
           chen.currentStep = afterStep    
		}else{
		   //获取当前时间
		   var currentTime = chen.timeScroll.getLabelTime(chen.currentStep)	
		   //获取上一个状态值step，		
		   var beforeStep = chen.timeScroll.getLabelBefore(currentTime)
           if(!beforeStep)return;

           //获取动画的总时长
           var totalTIme = chen.timeScroll.totalDuration();
           //获取上个状态的时长
           var beforeTime = chen.timeScroll.getLabelTime(beforeStep);
           //获取到滚动条能够滚动的最大高度
           var maxH = $('body').height() - $(window).height();
           //计算出滚动条滚动的距离
           var positionY = beforeTime/totalTIme * maxH;
           //滚动条滚动的距离的持续时间
           var d = Math.abs( chen.timeScroll.time() - beforeTime );

           var scrollAnimate = new TimelineMax();
           scrollAnimate.to('html,body',d,{scrollTop:positionY}) //ff 滚动条实在html上的    当scrollTop发生变化时就会触发window的scroll事件

           //运动到上一个状态step
           //chen.timeScroll.tweenTo(beforeStep)		
           //更新chen.currentStep 
           chen.currentStep = beforeStep          
		}
		
		timer = setTimeout(function(){
		   $('.wrapper').one('mousewheel',mousewheelFn)
		},1500)
	}	

}

//当mouseup的时候，让当前这一屏到达某个状态
chen.mouseupFn =  function(){
	//在滚动条滚动完后 鼠标抬起时计算出的一个比例
	var scale = chen.scale();
	//得到当前页面到达的时间点
	var times = scale*chen.timeScroll.totalDuration();
	//获取到上一个状态和下一个状态
	var prevStep = chen.timeScroll.getLabelBefore(times); 
	var nextStep = chen.timeScroll.getLabelAfter(times);
	//获取上一个状态的时间和下一个状态的时间
	var prevTime = chen.timeScroll.getLabelTime(prevStep);
	var nextTime = chen.timeScroll.getLabelTime(nextStep);
	//console.log(`${times-prevTime}+${nextTime-times}`)
    if(times-prevTime>nextTime-times){ //向下一屏
           //获取动画的总时长
           var totalTIme = chen.timeScroll.totalDuration();
           //获取下个状态的时长
           var nextTime = chen.timeScroll.getLabelTime(nextStep);
           //获取到滚动条能够滚动的最大高度
           var maxH = $('body').height() - $(window).height();
           //计算出滚动条滚动的距离
           var positionY = nextTime/totalTIme * maxH;
           //滚动条滚动的距离的持续时间
           var d = Math.abs( chen.timeScroll.time() - nextTime );

           var scrollAnimate = new TimelineMax();
           scrollAnimate.to('html,body',d,{scrollTop:positionY}) //ff 滚动条实在html上的      

           //运动到下一个状态
           //chen.timeScroll.tweenTo(nextStep)
           //更新chen.currentStep 
           chen.currentStep = nextStep   
    }else{                             //向上一屏
           //获取动画的总时长
           var totalTIme = chen.timeScroll.totalDuration();
           //获取上个状态的时长
           var prevTime = chen.timeScroll.getLabelTime(prevStep);
           //获取到滚动条能够滚动的最大高度
           var maxH = $('body').height() - $(window).height();
           //计算出滚动条滚动的距离
           var positionY = prevTime/totalTIme * maxH;
           //滚动条滚动的距离的持续时间
           var d = Math.abs( chen.timeScroll.time() - prevTime );

           var scrollAnimate = new TimelineMax();
           scrollAnimate.to('html,body',d,{scrollTop:positionY}) //ff 滚动条实在html上的    当scrollTop发生变化时就会触发window的scroll事件

           //运动到上一个状态step
           //chen.timeScroll.tweenTo(prevStep)		
           //更新chen.currentStep 
           chen.currentStep = prevStep  
    }  
}

//计算滚动条在滚动过程中的一个比例
chen.scale = function(){
	var scrollT = $(window).scrollTop();
    var maxH = $('body').height() - $(window).height();
    var s = scrollT/maxH;
    return s; 
}

//在滚动条滚动的过程中,计算页面中应该到哪一个时间点上去
chen.scrollStatus = function(){
    var times = chen.scale() * chen.timeScroll.totalDuration();  //页面中的时间点
    //当滚动条在滚动的过程中，让页面中的动画到达某个时间点
    chen.timeScroll.seek(times,false)
}

//配置整屏切换的动画以及每一屏中的小动画
chen.configTimeScroll = function(){

	//当前时间点
    var time = chen.timeScroll ? chen.timeScroll.time() : 0;  //chen.timeScroll.time()当前运动的时间点
    if(chen.timeScroll) chen.timeScroll.clear()

	chen.timeScroll = new TimelineMax(); //整屏动画切换的实例 
	chen.timeScroll.add('step1');
	chen.timeScroll.to('.scene2',.8,{top:0,ease:Cubic.easeInOut});
	chen.timeScroll.to({},0.1,{onComplete:function(){
		menu.changeMenu('menu_state2');
	},onReverseComplete:function(){
		menu.changeMenu('menu_state1');
	}},'-=.2')
	//当切换到第二屏上的时候,翻转第二屏上的第一个动画
	chen.timeScroll.to({},0,{onComplete:function(){
		twoAnimate.timeline.tweenTo('state1');
	}},'-=.2')
	chen.timeScroll.add('step2');
	chen.timeScroll.to('.scene3',.8,{top:0,ease:Cubic.easeInOut});
	chen.timeScroll.to({},0.1,{onComplete:function(){
		menu.changeMenu('menu_state3');
	},onReverseComplete:function(){
		menu.changeMenu('menu_state2');
	}},'-=.2')	
    chen.timeScroll.add('step3');
	chen.timeScroll.to('.scene4',.8,{top:0,ease:Cubic.easeInOut});
	chen.timeScroll.to({},0.1,{onComplete:function(){
		menu.changeMenu('menu_state4');
	},onReverseComplete:function(){
		menu.changeMenu('menu_state3');
	}},'-=.2')	
    chen.timeScroll.add('step4');
	chen.timeScroll.to('.scene5',.8,{top:0,ease:Cubic.easeInOut});
	chen.timeScroll.add('step5');
	chen.timeScroll.stop();
	//当改变浏览器的大小时，让动画走到之前已经到达的时间点
	chen.timeScroll.seek(time);
}

//设置每一屏的高和top值
chen.resize = function(){
	$('.scene').height($(window).height());  //设置每一屏的高
    $('.scene:not(":first")').css('top',$(window).height()); //设置除了第一屏的其他屏的top值
    chen.configTimeScroll();
    if($(window).width() <= 950){
    	$('body').addClass('r950')
    	$('.menu').css('top',0)
    }else{
    	$('body').removeClass('r950')
    	$('.menu').css('top',22)
    }
}

//配置首屏导航条动画
chen.configIntAnimate = function(){
    var initAnimate = new TimelineMax(); //创建一个动画实例

    initAnimate.to('.menu',.5,{opacity:1})
    initAnimate.to('.menu',.4,{left:22},'-=.3')
    initAnimate.to('.nav',.4,{opacity:1})

    //设置首屏动画
    initAnimate.to('.scene1_logo',.4,{opacity:1})
    initAnimate.staggerTo('.scene1_1 img',.3,{opacity:1,rotationX:0,ease:Elastic.easeout},.2)
    initAnimate.to('.light_left',.5,{rotationZ:0,ease:Elastic.easeout},'-=.2')
    initAnimate.to('.light_right',.5,{rotationZ:0,ease:Elastic.easeout},'-=.7')
    initAnimate.to('.controls',.5,{bottom:20,opacity:1},'-=.2')
    initAnimate.to('body',0,{'overflow-y':'scroll'})


}

//首屏交互
chen.nav = function(){
	var navAnimate = new TimelineMax(); //创建一个动画实例

	//导航tab切换
	$('.nav a').bind('mouseenter',function(){
		var This = $(this)
		var w = This.width()
		var l = This.offset().left;
		navAnimate.clear();
		navAnimate.to('.line',.2,{'opacity':1,'left':l-3,'width':w,ease:Elastic.easeout})
	}).mouseleave(function(){
        navAnimate.clear();
        navAnimate.to('.line',.2,{'opacity':0,ease:Elastic.easeout})
	})

	//language语言选择
	var languageAnimate = new TimelineMax(); //创建一个动画实例
	$('.language').bind('mouseenter',function(){
		languageAnimate.clear();
		languageAnimate.to('.dropdown',.3,{'opacity':1,'display':'block',ease:Elastic.easeout})
	}).mouseleave(function(){
        languageAnimate.clear();
        languageAnimate.to('.dropdown',.3,{'opacity':0,'display':'none',ease:Elastic.easeout})
	})

	//btn_mobile侧边栏
	$('.btn_mobile').bind('click',function(){
		var leftnavAnimate = new TimelineMax(); //创建一个动画实例
		leftnavAnimate.to('.left_nav',.5,{'left':0,ease:Elastic.easeout})
	})

	$('.l_close').bind('click',function(){
		var leftnavAnimate = new TimelineMax(); //创建一个动画实例
		leftnavAnimate.to('.left_nav',.5,{'left':-300,ease:Elastic.easeout})
	})

}

//3D翻转效果
chen.button3D = function(obj,element1,element2,t){
    var button3DAnimate = new TimelineMax();
    button3DAnimate.to($(obj).find(element1),0,{rotationX:0,transformPerspective:600,transformOrigin:'center bottom'});
    button3DAnimate.to($(obj).find(element2),0,{rotationX:-90,transformPerspective:600,transformOrigin:'top center'});

    $(obj).bind('mouseenter',function(){
    	var enterAnimate = new TimelineMax();
    	var ele1 = $(this).find(element1)
    	var ele2 = $(this).find(element2)
        enterAnimate.clear();
    	enterAnimate.to(ele1,t,{rotationX:90,top:-ele1.height(),ease:Cubic.easeInOut})
    	enterAnimate.to(ele2,t,{rotationX:0,top:0,ease:Cubic.easeInOut},'-=t')
    }).mouseleave(function(){
        var leaveAnimate = new TimelineMax();
        var ele1 = $(this).find(element1)
    	var ele2 = $(this).find(element2)
        leaveAnimate.clear();
    	leaveAnimate.to(ele1,t,{rotationX:0,top:0,ease:Cubic.easeInOut},'0')
        leaveAnimate.to(ele2,t,{rotationX:-90,top:ele1.height(),ease:Cubic.easeInOut},'0')
	})
}

//配置第二屏的动画
var twoAnimate = {};
twoAnimate.timeline = new TimelineMax();
//具体的第二屏里面动画要实现的细节
twoAnimate.init = function(){
	twoAnimate.timeline.staggerTo(".scene2_1 img",1.5,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.1);
	twoAnimate.timeline.to(".points",0.2,{bottom:20},"-=1");

	//初始第一个按钮
	twoAnimate.timeline.to(".scene2 .point0 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point0 .point_icon",0,{"background-position":"right top"});


		twoAnimate.timeline.add("state1");

	twoAnimate.timeline.staggerTo(".scene2_1 img",0.2,{opacity:0,rotationX:90},0);

	twoAnimate.timeline.to(".scene2_2 .left",0.4,{opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_2 .right img",0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0,"-=0.4");

	//第二个按钮

	twoAnimate.timeline.to(".scene2 .point .text",0,{opacity:0},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point1 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point .point_icon",0,{"background-position":"left top"},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point1 .point_icon",0,{"background-position":"right top"},"-=0.4");

		twoAnimate.timeline.add("state2");

	twoAnimate.timeline.to(".scene2_2 .left",0.4,{opacity:0});
	twoAnimate.timeline.staggerTo(".scene2_2 .right img",0.3,{opacity:0,rotationX:90,ease:Cubic.easeInOut},0,"-=0.4");
	twoAnimate.timeline.to(".scene2_3 .left",0.4,{opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_3 .right img",0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0,"-=0.4");

	//第三个按钮

	twoAnimate.timeline.to(".scene2 .point .text",0,{opacity:0},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point2 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point .point_icon",0,{"background-position":"left top"},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point2 .point_icon",0,{"background-position":"right top"},"-=0.4");

		twoAnimate.timeline.add("state3");

	twoAnimate.timeline.to(".scene2_3 .left",0.4,{opacity:0});
	twoAnimate.timeline.staggerTo(".scene2_3 .right img",0.3,{opacity:0,rotationX:90,ease:Cubic.easeInOut},0,"-=0.4");
	twoAnimate.timeline.to(".scene2_4 .left",0.4,{opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_4 .right img",0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0,"-=0.4");

	//第三个按钮

	twoAnimate.timeline.to(".scene2 .point .text",0,{opacity:0},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point3 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point .point_icon",0,{"background-position":"left top"},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point3 .point_icon",0,{"background-position":"right top"},"-=0.4");

		twoAnimate.timeline.add("state4");

	twoAnimate.timeline.stop();
};

//实现导航条3D翻转动画
var menu = {};
//每滚动一屏的时候，就调用这个函数。函数里面是3D翻转的具体实现细节
menu.changeMenu = function(stateClass){ //参数的作用:切换到某一屏的时候，要传入的class名字
	//具体实现3D翻转效果
	var oldMenu = $(".menu");
	var newMenu = oldMenu.clone();
	newMenu.removeClass("menu_state1").removeClass("menu_state2").removeClass("menu_state3");
	newMenu.addClass( stateClass );

	$(".menu_wrapper").append(newMenu);

	oldMenu.addClass("removeClass");

    var menuAnimate = new TimelineMax();
	menuAnimate.to( newMenu,0,{top:100,rotationX:-90,transformPerspective:600,transformOrigin:"top center"} );
	menuAnimate.to( oldMenu,0,{rotationX:0,top:22,transformPerspective:600,transformOrigin:"center bottom"} );

	menuAnimate.to( oldMenu,0.3,{rotationX:90,top:-55,ease:Cubic.easeInOut,onComplete:function(){
		$(".removeClass").remove();
	}} );

    menuAnimate.to(newMenu,0.3,{rotationX:0,top:22,ease:Cubic.easeInOut},"-=0.3")

   chen.button3D(".start",".state1",".state2",0.3);
   chen.nav(); //执行导航条的鼠标移入移除的动画
}