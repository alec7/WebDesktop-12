$(document).ready(function(){

	var zindex = 0;
	var margin = 0;
    
    $( ".window" ).draggable({
    	containment: "parent", handle: ".window-header",
    	start: function() {
        	if(margin > 0){
        		margin--;
        	}
      	},
    });
    
    $( ".window" ).not(".fixed-size").resizable({containment: "parent", minHeight: 200, minWidth: 200, handles: 'n, e, s, w'});

    $(".window").mousedown(function(){
    	zindex++;
    	$(this).css({"z-index" : zindex});
    });
    $(".button-close").click(function(){
    	$(this).parent(".window-header").parent(".window").css({"display" : "none"});

    	var item = $(this).parent(".window-header").parent(".window").attr('id');
    	item = item.slice(0, -2);
    	$("#" + item).removeClass("active show-indicator");

    	if(margin > 0){
        	margin--;
        }
    });

    /* DOCK */

	$(".dock-item").click(function(){
		
		var item = $(this);
		
		if(!($(this).hasClass("bounce"))){
			setTimeout(function(){
				$(item).removeClass("bounce");
				$(item).addClass("show-indicator");
				$(item).children(".full-name").removeClass("bounce-down");
			}, 1500);
		}

		if(!($(this).hasClass("show-indicator"))){
			$(this).addClass("bounce");
			$(this).children(".full-name").addClass("bounce-down");
		}

		var id = $(this).attr('id');
		id += "-w";
		if(!($(this).hasClass("active"))){
			margin++;
			zindex++;
			$("#" + id).css({"display" : "block", "z-index" : zindex});
			if(!($(this).hasClass("no-virgin"))){
				$("#" + id).css({"left" : margin*40, "top" : margin*40});
			}
			$(this).addClass("active no-virgin");
		}
	})
});