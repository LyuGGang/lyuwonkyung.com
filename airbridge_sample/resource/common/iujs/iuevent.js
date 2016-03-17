/**************************************
Default Event
***************************************/

function initEventMachine(){
	//trigger event show
	$('.IUJQueryShowEventReceiver').each(function(){
		var evalValue;
		try{
			evalValue = eval($(this).attr('jqueryshowcondition'));
		}
		catch (e){
			return;
		}
		if (evalValue == false) {
			$(this).hide();
		}
		else {
			$(this).show();
		}
	});
    
	//scroll event show
	runScrollEventMachine();
}

function runEventMachine(variable){
	$('.IUJQueryShowEventReceiver').each(function(){
		var condition = $(this).attr('JQueryShowCondition');
		try {			
			if ( condition.indexOf(variable) >= 0 ) {
				var evalValue = eval(condition);
				toggleShowIU(this, evalValue);
			};
		}
		catch (e){
			return false;
		}
	});
}


function runScrollEventMachine(){
	$('.IUJQueryScrollShowEventReceiver').each(function(){
		var currScrollTop = $(window).scrollTop();
		var from = $(this).attr('JQueryScrollShowFrom');
		var to = $(this).attr('JQueryScrollShowTo');
		if (to == undefined){
			to = $(document).height();
		}

		if (currScrollTop > from && currScrollTop < to){
			if ($(this).data('scrollEvent') ==  false){
				toggleShowIU(this, true);	
			}
			else if ($(this).data('scrollEvent') == undefined){ // 초기값 undefined 처리 
				$(this).show();
			}
			$(this).data('scrollEvent', true);
		}
		else{
			if ($(this).data('scrollEvent')){
				toggleShowIU(this, false);	
			}
			else if ($(this).data('scrollEvent') == undefined){ // 초기값 undefined 처리 
				$(this).hide();
			}
			$(this).data('scrollEvent', false);
		}
	});
}


function increaseEventTrigger(iu){
	var variable = $(iu).attr('VariableTriggerVariable');
	var value = eval(variable);
	var maximumValue = variableStorage[variable].maximum;
	if (value == maximumValue){
		eval( variable+'=0;');
	}
	else {
		eval( variable+'++');
	}
	runEventMachine(variable);
}

function decreaseEventTrigger(iu){
	var variable = $(iu).attr('VariableTriggerVariable');
	var value = eval(variable);
	var maximumValue = variableStorage[variable].maximum;
	if (value == 0){
		eval( variable+'='+ maximumValue +';');
	}
	else {
		eval( variable+'--');
	}
	runEventMachine(variable);
}

/**************************************
Show Animation
***************************************/

function toggleShowIU(iu, toggle, animation, duration, option, callback){
	var reverseAnimation =  $(iu).hasClass('velocity-animating');
	
	if (animation == undefined){
		animation = $(iu).attr('JQueryShowAnimation');
	}
	if(option == undefined){
		option = {};
	}
	//set duration
	if (duration == undefined){
		duration = parseFloat($(iu).attr('JQueryShowDuration'))*1000;
	}
	option['duration'] = duration;
	
	//set option call 
	var begin = option['begin'];
	option['begin'] = function(){
		if (begin != undefined){
			begin();
		}
		reframeCenterIU(iu);
	}
    
	if (toggle) {
		if(duration > 0){
			option['complete'] = function(){
				if (callback != undefined) {
					callback();
				}
				reframeCenterIU(iu);
			}
			
			if (reverseAnimation){
				$(iu).velocity("stop");
			}
			$(iu).css('display', 'block');
			$(iu).velocity(animation, option);	
		}
		else{
			$(iu).css('display', 'block');
			reframeCenterIU(iu);
			if (callback != undefined) {
				callback();
			}
		}
		if (window.isLoadedIUBoxes) {
			$('.IUGoogleMap').each(function(){
				resizeIUGoogleMap(this);
			});
		}
	}
	else {
		if(duration > 0){
			//callback function organize : center
			
			var closeAnimation = animation;
			if (closeAnimation.indexOf("Down") > 0){
				closeAnimation = closeAnimation.replace("Down", "Up");
			}
			if (closeAnimation.indexOf("In") > 0){
				closeAnimation = closeAnimation.replace("In", "Out");
			}
			
			option['display'] = "none";			
			if (callback != undefined) {
				option['complete'] = callback;
			}
			
			
			if (reverseAnimation){
				$(iu).velocity("stop");
			}
			$(iu).velocity(closeAnimation, option);	

		}
		else{
			$(iu).css({"display":"none"});
			if (callback != undefined) {
				callback();
			}
		}
	}
}


/**************************************
Scroll Animator
***************************************/

function initScrollAnimator(resize){
    // Initialize position with pre and save y position (if there is post y position, save it. else save the first y position)
    $('.IUScrollAnimator').each(function(){
	    
        var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var jsonStr = $(this).attr('scrollAnimator').replace(/\'/g,'\"');
        var jsonData = JSON.parse(jsonStr);
        var mediaQueryArray = Object.keys(jsonData).reverse();
        var animatorKey = null;
        for (var i = 0; i < mediaQueryArray.length; i++) {
            if (parseInt(mediaQueryArray[i]) <= viewport
            ||  i == (mediaQueryArray.length-1)) {
	            if (resize && ($(this).data('prevMediaQuery') == parseInt(mediaQueryArray[i]))) {
		            return;
	            }
	            $(this).data('prevMediaQuery', parseInt(mediaQueryArray[i]));
                animatorKey = mediaQueryArray[i];
                break;
            }
        }
        
        if (animatorKey == null || animatorKey == undefined) {
            animatorKey = mediaQueryArray[mediaQueryArray.length-1];
        }
        
        
        if (resize) {
	        $.Velocity.hook(this, 'translateX', '0px');
	        $.Velocity.hook(this, 'translateY', '0px');
		    $(this).css({'transform':'', 'opacity':'', 'left':'', 'right':'', 'top':'', 'bottom':''});
	    }
        
        var scrollAnimatorData = jsonData[animatorKey];
        var propertyKeys = Object.keys(scrollAnimatorData); //scrollAnimatorX, scrollAnimatorY, scrollOpacity
        $(this).data('postCenterY', $(this).offset().top + $(this).outerHeight()/2);                               
        for(var i=0; i<propertyKeys.length; i++){
            var propertyKey = propertyKeys[i];
            var pre = parseInt(scrollAnimatorData[propertyKey]['pre']);
            var post = parseInt(scrollAnimatorData[propertyKey]['post']);
            var unit = scrollAnimatorData[propertyKey]['unit'];
            if(propertyKey == "scrollAnimatorX"){ 
                if ($(this).css('left') == 'auto') {
                    $(this).css('right', pre + unit);
                }
                else {
                    $(this).css('left', pre + unit);
                }
            }else if(propertyKey == "scrollAnimatorY"){
                if ($(this).css('top') == 'auto') {
                    $(this).css('bottom', pre + unit);
                }
                else {
                    $(this).css('top', pre + unit);
                }
            }else if(propertyKey == "scrollOpacity"){
                $(this).css('opacity', pre);
            }
        }
    });
}
                                    
function calcScrollAnimatorValue(aPropertyKey, moveDistanceOfView, animationBound, pre, post){
	var cssValue = pre + ( moveDistanceOfView * (post - pre) ) / animationBound;
	if(post > pre){
		if(pre <= cssValue && cssValue <= post){
			return cssValue;
		}else{
			return post;
		}
	}else{
		if(post <= cssValue && cssValue <= pre){
			return cssValue;
		}else{
			return post;
		}
	}
}
                                    
function getScrollAnimatorPropertyKeys(iu) {
	var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var jsonStr = $(iu).attr('scrollAnimator').replace(/\'/g,'\"');
	var jsonData = JSON.parse(jsonStr);
	var mediaQueryArray = Object.keys(jsonData).reverse();
	var animatorKey = null;
	for (var i = 0; i < mediaQueryArray.length; i++) {
		if (parseInt(mediaQueryArray[i]) <= viewport) {
			animatorKey = mediaQueryArray[i];
			break;
		}
	}
	if (animatorKey == null || animatorKey == undefined) {
		animatorKey = mediaQueryArray[mediaQueryArray.length-1];
	}
	var scrollAnimatorData = jsonData[animatorKey];
	var propertyKeys = Object.keys(scrollAnimatorData); //scrollAnimatorX, scrollAnimatorY, scrollOpacity
                                                                                       
	return propertyKeys;
}
                                                                                       
function getScrollAnimatorValue(widget, aPropertyKey, pre, post, animationEndY){
	var viewHeight = $(window).height();
	var animationBound = viewHeight/2;
	var viewAndWidgetDistance = $(widget).data('postCenterY') - animationEndY;
	var moveDistanceOfView;
	var animationValue = null;
                                                                                       
	if (0 < viewAndWidgetDistance && viewAndWidgetDistance < animationBound){
		moveDistanceOfView = viewHeight/2 - viewAndWidgetDistance;
		animationValue = calcScrollAnimatorValue(aPropertyKey, moveDistanceOfView, viewHeight/2, pre, post);
	}
	else if (viewAndWidgetDistance >= animationBound){
		animationValue = pre;
	}
	else if (viewAndWidgetDistance <= 0){
		animationValue = post;
	}
	return animationValue;
}
                                                       
function runScrollAnimator(){
	/* make scroll animator data */
    $('.IUScrollAnimator').each(function(){
        var currScrollTop = $(window).scrollTop();
        var viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var viewHeight = $(window).height();
        var viewCenterY = viewHeight/2 + currScrollTop;
        var viewBottomY = viewHeight + currScrollTop;
        var documentHeight = $(document).height();
        var bottomAnimationBound = documentHeight - viewHeight/2;
        var topAnimationBound = viewHeight;
        var postWidgetCenterY = $(this).data('postCenterY');
                                                                                                               
        var jsonStr = $(this).attr('scrollAnimator').replace(/\'/g,'\"');
        var jsonData = JSON.parse(jsonStr);
        var mediaQueryArray = Object.keys(jsonData).reverse();
        var animatorKey = null;
        for (var i = 0; i < mediaQueryArray.length; i++) {
            if (parseInt(mediaQueryArray[i]) <= viewport
            || i == (mediaQueryArray.length-1)) {
                animatorKey = mediaQueryArray[i];
                break;
            }
        }
        if (animatorKey == null || animatorKey == undefined) {
            animatorKey = mediaQueryArray[mediaQueryArray.length-1];
        }
        var scrollAnimatorData = jsonData[animatorKey];
        var propertyKeys = Object.keys(scrollAnimatorData); //scrollAnimatorX, scrollAnimatorY, scrollOpacity
                                                                                                                                                                    
        for(var i=0; i<propertyKeys.length; i++){
            var destination = null;	
            var aPropertyKey = propertyKeys[i];
            var pre = parseFloat(scrollAnimatorData[aPropertyKey]['pre']);
            var post = scrollAnimatorData[aPropertyKey]['post'];
            var unit = scrollAnimatorData[aPropertyKey]['unit'];
            if (post == "horizontalcenter"){
                post = $(this).data('postHCenter');
            }
            else if (post == "verticalcenter"){
                post = $(this).data('postVCenter');
            }
            else {
                post = parseFloat(scrollAnimatorData[aPropertyKey]['post']);
            }
                                                                                                                                                                    
            if (topAnimationBound > postWidgetCenterY){
                destination = post;
            }
            else if (bottomAnimationBound < postWidgetCenterY){
                var widgetAndDocumentDistance = $(document).height() - postWidgetCenterY;
                destination = getScrollAnimatorValue(this, aPropertyKey, pre, post, viewBottomY - widgetAndDocumentDistance);
            }
            else {
                destination = getScrollAnimatorValue(this, aPropertyKey, pre, post, viewCenterY);
            }
                                                                                                                                                                    
            if(destination!=null){
	            var animationValue = 0;
                if(aPropertyKey == "scrollAnimatorX"){ 
                    if ($(this).css('left') == 'auto') {
	                    if (unit == "px") {
		                    animationValue = pre - destination;
	                    }
	                    else {
		                    // unit이 percent일때 pixel로 한번바꿔줘야햠 (translateX, translateY는 자신의 width, height를 가지고 %를 계산함)
		                    animationValue = (pre - destination) * $(this).offsetParent().width() / 100;
	                    }
                    }
                    else {
	                    if (unit == "px") {
		                    animationValue = destination - pre;
	                    }
	                    else {
		                    // unit이 percent일때 pixel로 한번바꿔줘야햠 (translateX, translateY는 자신의 width, height를 가지고 %를 계산함)
		                    animationValue = (destination - pre) * $(this).offsetParent().width() / 100;
	                    }
                    }
                    $.Velocity.hook(this, 'translateX', Math.round(animationValue) +'px');
                }else if(aPropertyKey == "scrollAnimatorY"){
                    if ($(this).css('top') == 'auto') {
	                    if (unit == "px") {
		                    animationValue = pre - destination;
	                    }
	                    else {
		                    // unit이 percent일때 pixel로 한번바꿔줘야햠 (translateX, translateY는 자신의 width, height를 가지고 %를 계산함)
		                    animationValue = (pre - destination) * $(this).offsetParent().height() / 100;
	                    }
                    }
                    else {
	                    if (unit == "px") {
		                    animationValue = destination - pre;
	                    }
	                    else {
		                    // unit이 percent일때 pixel로 한번바꿔줘야햠 (translateX, translateY는 자신의 width, height를 가지고 %를 계산함)
		                    animationValue = (destination - pre) * $(this).offsetParent().height() / 100;
	                    }
                    }
                    $.Velocity.hook(this, 'translateY', Math.round(animationValue) +'px');
                }else if(aPropertyKey == "scrollOpacity"){
	                animationValue = Math.round(destination*100)/100;
                    $(this).css('opacity', animationValue);
                }  
            }
        }
    });
}
                                                                                                                   
/**************************************
Hover Event
***************************************/
                                                                                                                   
var prevTouchX;
var prevTouchY;
                                                                                                                   
function initMobileMouseHover(){
	if (isMobile()){
		if (/Android 4/i.test(navigator.userAgent)){
			$(".IUBoxWithHover").bind({
				touchstart: function(event){
					$(this).addClass('iuhover');
				},
				touchmove:function(event){
					$(this).removeClass('iuhover');
				},
				touchend:function(event){
					$(this).removeClass('iuhover');
				},
				touchcancle:function(event){
					$(this).removeClass('iuhover');
				}
			});
		}
		else {
			$(".IUBoxWithHover").bind({
				touchstart: function(event){
					$(this).addClass('iuhover');
				},
				touchend:function(event){
					$(this).removeClass('iuhover');
				},
				touchcancle:function(event){
					$(this).removeClass('iuhover');
				}
			});
		}
	}
                                                                                                                   
}
                                                                                                                   
function getBottomTouchEvent(event){
	var bottomTouchEvent = event.originalEvent.changedTouches[0];
	for (var i=1; i<event.originalEvent.changedTouches.length; i++){
		if (bottomTouchEvent.pageY < event.originalEvent.changedTouches[i].pageY){
			bottomTouchEvent = event.originalEvent.changedTouches[i]; 
		}
	}
	return bottomTouchEvent;
}
                                                                                                                   
