function initPresentationMode(){
	currentPageURL = $('.IUPage').attr('iuname') + '.html';
	document.addEventListener('keyup', function(event){
		if (event.keyCode == 34 || event.keyCode == 39) {
			if (currentPageURL == lastPageURL){
				alert("Last Page");
			}
			else {
				window.location.replace(nextPageURL);	
			}
		}	
		else if (event.keyCode == 33 || event.keyCode == 37) {
			if (currentPageURL == firstPageURL){
				alert("First Page");
			}
			else {
				window.location.replace(prevPageURL);	
			}
		}});
		$(document).click(function(e) {
			var center = $(window).width()/4;
			if(e.pageX <center){
				if (currentPageURL == firstPageURL){
					alert("First Page");
				}
				else {
					window.location.replace(prevPageURL);	
				}
			}
			else{
				if (currentPageURL == lastPageURL){
					alert("Last Page");
				}
				else {
					window.location.replace(nextPageURL);	
				}
			}
		});
}
