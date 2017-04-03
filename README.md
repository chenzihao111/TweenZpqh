# web整屏切换
1. TweenMax库
2. $(window).scrollTop()/$('body').height() - $(window).height() = timeScroll.currentTime/timeScroll.totalDuration()
3. jquery mousewheel插件
4. $('.wrapper').one('mousewheel',mousewheelFn)
	function（）{
            ev.preventDefault();//阻止window默认事件
			timer = setTimeout(function(){
			   $('.wrapper').one('mousewheel',mousewheelFn)
			},1500)	
	}
5.