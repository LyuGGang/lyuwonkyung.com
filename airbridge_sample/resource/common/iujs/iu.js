//this file only used in output file from IUEditor

//for console defined

var alertFallback = false;
if (typeof console === "undefined"
	|| typeof console.log === "undefined"
	|| typeof console.timeStart === "undefined"
	|| typeof console.timeEnd === "undefined"
) {
	if (typeof console === "undefined"){
		console = {};
	}
	if (typeof console.log === "undefined"){
		console.log = function() {};
	}
    
	if (alertFallback) {
		console.log = function(msg) {
			alert(msg);
		};
		console.timeStart = function(msg) {
			alert(msg);
		};
		console.timeEnd = function(msg) {
			alert(msg);
		};
	} else {
		console.timeStart = function() {};
		console.timeEnd = function() {};
	}
}

if (!Object.keys) Object.keys = function(o) {
	if (o !== Object(o))
		throw new TypeError('Object.keys called on a non-object');
	var k=[],p;
	for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
	return k;
}

function isMobile(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		return true;
	}
	else{
		return false;
	}
}

$.fn.hasAttr = function(name) {
	var attr = $(this).attr(name);
    
	// For some browsers, `attr` is undefined; for others,
	// `attr` is false.  Check for both.
	if (typeof attr !== typeof undefined && attr !== false) {
		return true;
	}
	return false;
};




function hasDefaultClickEvent(iu) {
    var classNamesWithClickEvent = ['IUCarousel', 'IUCollapsible', 'IUGoogleMap', 'IUMovie',
                               'IUPopUp', 'IUPanel', 'IUTableView', 'IUTransition', 'IUTweetButton', 'IUFBLike',
                               'IUWebMovie', 'PGButton', 'PGFileUpload', 'PGFlipSwitch', 'PGRadioButton',
                               'PGRangeSlide', 'PGRangeSlideBar', 'PGSelect', 'PGSlide', 'PGSlideBar',
                               'PGSlidePoint', 'PGSlideTextField', 'PGSwitch', 'PGTextField', 'PGTextView', 'IUEventClickTrigger', 'IUDefaultClickEvent'];
    for (var i=0; i<classNamesWithClickEvent.length; i++) {
	    if ($(iu).hasClass(classNamesWithClickEvent[i])) {
		    return true;
	    }
    }
    
    return false;
}

function hasDefaultKeyEvent(iu) {
    var classNamesWithKeyEvent = ['PGSlideTextField', 'PGTextField', 'PGTextView'];
    for (var i=0; i<classNamesWithKeyEvent.length; i++) {
	    if ($(iu).hasClass(classNamesWithKeyEvent[i])) {
		    return true;
	    }
    }
    return false;
}

/*
bind all mouse event in this function
@firefox do not collect in seperated mouse binding, so racing condition appears
*/

function initIUBind(){
	$('.IUBox').bind({
		mouseenter:function(event){
			var className = this.className;
                     
			if ($(this).hasClass('IUTransition')){
				var eventType = $(this).attr('transitionevent');
				if (eventType=='mouseOn'){
					transitionAnimationOn(event);
				}
			}
			else if ($(this).hasClass('IUCollapsibleHeader')){
				var eventType = $(this).parent().attr('collapsibleevent');
				if (eventType=='mouseOn'){
					toggleShowCollapsible($(this).parent() ,true);
				}
			}
                     
                     
			if ($(this).hasClass('IUEventHoverTrigger')){
				increaseEventTrigger(this);
			}
			if (isMobile() == false && $(this).hasClass('IUBoxWithHover')){
				$(this).addClass('iuhover');
			}
		},
		mouseleave:function(event){
			var className = this.className;
                     
			if ($(this).hasClass('IUTransition')){
				var eventType = $(this).attr('transitionevent');
				if (eventType=='mouseOn'){
					transitionAnimationOff(event);
				}
			}
			else if ($(this).hasClass('IUCollapsible')){
				var eventType = $(this).attr('collapsibleevent');
				if (eventType=='mouseOn'){
					toggleShowCollapsible(this, false);
				}
			}
			if ($(this).hasClass('IUEventHoverTrigger')){
				decreaseEventTrigger(this);
			}
			if (isMobile() == false && $(this).hasClass('IUBoxWithHover')){
				$(this).removeClass('iuhover');
			}
		},
		click:function(event){
			var className = this.className;
                     
			if ($('.IUPage').hasAttr('presentation') && hasDefaultClickEvent(this)) {
				event.stopPropagation();
			}
			/* IUBox classes */
			if ($(this).hasClass('IUCollapsibleHeader')){
				var eventType = $(this).parent().attr('collapsibleevent');
				if (eventType=='click'){
					var unfolded = $(this).parent().attr('unfoldedcollapsible') == 'true';
					toggleShowCollapsible($(this).parent(), !unfolded);	
				}
			}
			else if ($(this).hasClass('IUTransition')){
				var eventType = $(this).attr('transitionevent');
				if (eventType=='click'){
					transitionAnimation(event);
				}
			}
			else if ($(this).hasClass('PGSwitch')){
				var inputdiv = $(this).children()[0];
				if ($(inputdiv).val() == 0){
					$(inputdiv).val(1);
				}
				else {
					$(inputdiv).val(0);
				}
			}
			else if ($(this).hasClass('IUTabHeaderItem') || $(this).hasClass('IUSimpleTabButton')){
				clickTabHeaderItem(this, event);
			}
                     
                     
			/* event type */
			if ($(this).hasClass('IUEventClickTrigger')){
				increaseEventTrigger(this);
			}
			else if ($(this).hasClass('iuPopUpButton')){
                     
				var popUpId = $(this).attr('popupbuttontargetid');
				var popUp = $('#'+popUpId);
				toggleShowPopUp(popUp);
				event.stopPropagation();
			}
			else if ($(this).hasClass('iuPanelButton')){
				var panelId = $(this).attr('panelButtonTargetId');
				togglePanel(panelId);
				//external close 방지
				event.stopPropagation();
			}
                     
			/* check attr */
			//init scroll link event
			var scrollLink = $(this).attr('scrollLink');
			if (scrollLink=='1'){
				var firstChild = $(this).children().get(0);
				var parentElement = $(this).parent()[0];
				var link;
				if (firstChild != undefined && firstChild.href != undefined) {
					link = firstChild;
				}
				else if(parentElement.href != undefined) {
					link = parentElement;
				}
				
				var linkTarget = $(link).attr('target');
				if (linkTarget == undefined || linkTarget == "_self") {
					// split to link & div htmlID
					var div = link.href.split('#')[1];
					var linkIU = $('#'+div);
					if(linkIU.length == 1){
						event.preventDefault();
						$('html,body').scrollTo(linkIU.offset().left, linkIU.offset().top);
					}
				}
			}
		},
		keyup:function(event){
			if ($('.IUPage').hasAttr('presentation') && hasDefaultKeyEvent(this)) {
				event.stopPropagation();
			}
		}
	});
}

/**************************************
handle webview 
***************************************/

$(window).resize(function() {
                 
	//iuframe.js
	//resizeCollection();
    makefullSizeSection();
	reframeCenter();
	lazyReframeCenter();
	initScrollAnimator(true);
	runScrollAnimator();

	resetSlideInnerBarWidth();
	
	//iu.js
	reloadTextMediaQuery();
                 
	//iuboxes.js
	resizeCarousel();
	resetPanelPosition();
	rePositionCurrentDisplayPopUp();
	
	setTimeout(function(){
		reframeCenter();
		lazyReframeCenter();
	}, 20);
});


$(document).ready(function(){                  
	/* iuboxes.js */                  
	readyIUBoxes();
                                                      
	/* iuframe.js */
	makefullSizeSection();
	reloadTextMediaQuery();
	reframeCenter();
	lazyReframeCenter();
	runScrollEventMachine();
	//check link activate
	$("[iulink='1']").each(function(){ 
		var link = $(this).children().get(0);
		activateLink(link, 'parent');
	});
	
	//init tabview
	checkHashInTabView();   
});

$(window).load(function(){
	
	initLoadIUBoxes();
	window.isLoadedIUBoxes = true;
	/* binding */
	/* !warning! firefox bind racing condition */
	initIUBind();
	/* iuevent.js */
	initMobileMouseHover();
	
	//init presentation mode
	if ($(".IUPresentation").length > 0){
		initPresentationMode();
	}
	
	//init event variable
	if(typeof variableStorage != "undefined"){
		$.each( variableStorage, function( key, value ) {
			eval(key + " = " + value.initial);
		});
		initEventMachine();
	}
	lazyReframeCenter();
	reframeCenter();
	initAfterCenter();
	autoPlayAllIUMovieDuringFocusing();
	resizeCarousel();
	
	//check select code
	$('select').each(function(){
		if ( $(this).attr('selectedvalue') ){
			$(this).val($(this).attr('selectedvalue'));
		}
	});
});



$(window).scroll(function(){
	autoPlayAllIUWebMovieDuringFocusing();
	autoPlayAllIUMovieDuringFocusing();
	runScrollAnimator();
	runScrollEventMachine();
});

$(window).on('hashchange', function(){
	checkHashInTabView();
});

