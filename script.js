$(document).ready(function(){

    var zindex = 0;
    var margin = 0;
    var dockmitems = 0;
    var dockwidth = 0;
    var dockposition = 0;
    var windowpositions = [];
    var minimizednames = [];

    $("body").mousedown(function(){
        $(".window").css({"transition" : "0ms"});
    });
    $("body").mouseup(function(){
        $(".window").css({"transition" : "600ms"});
    });
    
    $( ".window" ).draggable({
        containment: "parent", handle: ".window-header",
        start: function() {
            if(margin > 0){
                margin--;
            }
            $(".window").css({"pointer-events" : "none"});
        },
        stop: function() {
            $(".window").css({"pointer-events" : "initial"});
        }
    });
    
    $( ".window" ).not(".fixed-size").resizable({containment: "parent", minHeight: 200, minWidth: 200, handles: 'n, e, s, w'});

    $(".window").mousedown(function(){
        zindex++;
        $(this).css({"z-index" : zindex});
    });

    $(".button-close").click(function(){
        $(this).parent(".window-header").parent(".window").css({"display" : "none"});
        $(this).parent(".window-header").parent(".window").removeClass("active show-indicator");

        var item = $(this).parent(".window-header").parent(".window").attr('id');
        item = item.slice(0, -2);
        $("#" + item).removeClass("active show-indicator");

        if(margin > 0){
            margin--;
        }
    });
    $(".button-minimize").click(function(){
        dockmitems++;
        dockwidth = $(".dock").width();
        $(".dock").css({"padding-right" : 95*dockmitems});
        $(this).parent(".window-header").parent(".window").addClass("window-minimized fixed-size");
        $(this).parent(".window-header").parent(".window").css({"left" : dockwidth/2-130+90*dockmitems});
        var item = $(this).parent(".window-header").parent(".window").position();
        item = item.left;
        windowpositions.push(item);
        item = $(this).parent(".window-header").parent(".window").attr('id');
        minimizednames.push(item);
    });
    $(".window").mouseup(function(){
        if($(this).hasClass("window-minimized")){

            if(dockmitems > 0){
                dockmitems--;
            }
            $(".dock").css({"padding-right" : 95*dockmitems+5});
            $(this).removeClass("window-minimized fixed-size");

            var windowname = $(this).attr('id');
            windowname = jQuery.inArray( windowname, minimizednames);
            item = windowpositions[windowname];
            $(this).css({"left" : item});
            minimizednames.splice(windowname, 1);
            windowpositions.splice(windowname, 1);
        }
    });

    /* DOCK */

    $(".dock-item").click(function(){
        
        var item = $(this);
        var id = $(this).attr('id');
        id += "-w";
        
        if(!($(this).hasClass("bounce"))){
            setTimeout(function(){
                $(item).removeClass("bounce");
                $(item).children(".full-name").removeClass("bounce-down");
                if($("#" + id).hasClass("active")){
                    $(item).addClass("show-indicator");
                }
            }, 1500);
        }

        if(!($(this).hasClass("show-indicator"))){
            $(this).addClass("bounce");
            $(this).children(".full-name").addClass("bounce-down");
        }
        
        if(!($(this).hasClass("active"))){
            
            margin++;
            zindex++;
            
            $("#" + id).css({"display" : "block", "z-index" : zindex});
            
            if(!($(this).hasClass("no-virgin"))){
                $("#" + id).css({"left" : margin*40, "top" : margin*40});
            }
            
            $(this).addClass("active no-virgin");
            $("#" + id).addClass("active");
        }
    })
});