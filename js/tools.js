var tools = (function(){
  var toolsObj = {
    $:function(selector,context){
      /*

       * #id
       * .class
       * 标签
       * "#id li"
       * ".class a"
       * */
      context = context || document;
      if(selector.indexOf(" ") !== -1){
        return context.querySelectorAll(selector);
      }else if( selector.charAt(0) === "#" ){
        return document.getElementById(selector.slice(1))
      }else if( selector.charAt(0) === "." ){
        return context.getElementsByClassName(selector.slice(1));
      }else{
        return context.getElementsByTagName(selector);
      }
    },
    addEvent:function(ele,eventName,eventFn){
      ele.addEventListener(eventName,eventFn,false);
    },
    removeEvent:function(ele,eventName,eventFn){
      ele.removeEventListener(eventName,eventFn,false);
    },
    addClass:function (element,clsNames){
      if( typeof clsNames === "string" ){
        if(!tools.hasClass(element,clsNames)){
          element.className += " "+clsNames;
        }
      }
    },
    removeClass:function (element,clsNames){
      var classNameArr = element.className.split(" ");
      for( var i = 0; i < classNameArr.length; i++ ){
        if( classNameArr[i] === clsNames ){
          classNameArr.splice(i,1);
          i--;
        }
      }
      element.className = classNameArr.join(" ");
    },
    hasClass:function(ele,classNames){
      
      var classNameArr = ele.className.split(" ");
      for( var i = 0; i < classNameArr.length; i++ ){
        if( classNameArr[i] === classNames ){
          return true;
        }
      }

      return false;
    },
    toggleClass:function (ele,classNames){
      if( tools.hasClass(ele,classNames) ){
        tools.removeClass(ele,classNames);
        return false;
      }else{
        tools.addClass(ele,classNames);
        return true;
      }
    },
    parents:function(obj,selector){
      /*

       * selector
       * id
       * class
       * 标签
       * */

      if( selector.charAt(0) === "#" ){
        while(obj.id !== selector.slice(1)){
          obj = obj.parentNode;
        }
      }else if( selector.charAt(0) === "." ){
        while((obj && obj.nodeType !== 9) && !tools.hasClass(obj,selector.slice(1))){
          obj = obj.parentNode;
        }
      }else{
        while(obj && obj.nodeType !== 9 && obj.nodeName.toLowerCase() !== selector){
          obj = obj.parentNode;
        }
      }

      return obj && obj.nodeType === 9  ? null : obj;
    },
    each:function(obj,callBack){
      for( var i = 0; i < obj.length; i++ ){
        callBack(obj[i],i);
      }
    },
    getEleRect:function(obj){
      return obj.getBoundingClientRect();
    },
    collisionRect:function(obj1,obj2){
      var obj1Rect = tools.getEleRect(obj1);
      var obj2Rect = tools.getEleRect(obj2);

      var obj1W = obj1Rect.width;
      var obj1H = obj1Rect.height;
      var obj1L = obj1Rect.left;
      var obj1T = obj1Rect.top;

      var obj2W = obj2Rect.width;
      var obj2H = obj2Rect.height;
      var obj2L = obj2Rect.left;
      var obj2T = obj2Rect.top;
      //碰上返回true 否则返回false
      if( obj1W+obj1L>obj2L && obj1T+obj1H > obj2T && obj1L < obj2L+obj2W && obj1T<obj2T+obj2H ){
        return true
      }else{
        false;
      }
    },
    store:function (namespace, data)  {
      if (data) {
        return localStorage.setItem(namespace, JSON.stringify(data));
      }

      var store = localStorage.getItem(namespace);
      return (store && JSON.parse(store)) || [];
    },
    extend:function (obj){
      var newArr = obj.constructor === Array ? [] : {};
      for( var attr in obj ){
        if( typeof obj[attr] === "object"){
          newArr[attr] = tools.extend(obj[attr]);
        }else{
          newArr[attr] = obj[attr];
        }
      }
      return newArr;
    },
    hide:function (element){
      return element.style.display = "none";
    },
    show:function (element){
      return element.style.display = "block";
    },
    getOffset:function (obj){
      return {
        width:obj.offsetWidth,
        height:obj.offsetHeight
      }
    },
    function getStyle(obj,attr){
      if(obj.currentStyle){
        return obj.currentStyle[attr];
      }
      else{
        return getComputedStyle(obj,false)[attr];
      }
    },
    function startMove(obj,json,endFn){
      
      clearInterval(obj.timer);
      
      obj.timer = setInterval(function(){
        
      var bBtn = true;
        
      for(var attr in json){
        
        var iCur = 0;
      
        if(attr == 'opacity'){
          if(Math.round(parseFloat(tools.getStyle(obj,attr))*100)==0){
          iCur = Math.round(parseFloat(tools.getStyle(obj,attr))*100);
          
          }
          else{
            iCur = Math.round(parseFloat(tools.getStyle(obj,attr))*100) || 100;
          } 
        }
        else{
          iCur = parseInt(tools.getStyle(obj,attr)) || 0;
        }
        
        var iSpeed = (json[attr] - iCur)/8;
      iSpeed = iSpeed >0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
        if(iCur!=json[attr]){
          bBtn = false;
        }
        
        if(attr == 'opacity'){
          obj.style.filter = 'alpha(opacity=' +(iCur + iSpeed)+ ')';
          obj.style.opacity = (iCur + iSpeed)/100;
          
        }else{
          obj.style[attr] = iCur + iSpeed + 'px';
        }
        
        
      }
        
      if(bBtn){
          clearInterval(obj.timer);
          
          if(endFn){
            endFn.call(obj);
          }
        }
        
      },30);
      
    }        

  }
  return toolsObj;

}())
