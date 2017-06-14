$(document).ready(function(){

    var zindex = 0;
    var margin = 0;
    var dockmitems = 0;
    var dockwidth = 0;
    var dockposition = 0;
    var windowpositions = [];
    var minimizednames = [];

    /* Makes resizing and dragging not lag */

    $("body").mousedown(function(){
        $(".window").css({"transition" : "0ms"});
    });
    $("body").mouseup(function(){
        $(".window").css({"transition" : "600ms"});
    });
    
    /* jQuery UI Draggable and Resizable functions */

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

    /* Bring clicked window to foreground */

    $(".window").mousedown(function(){
        zindex++;
        $(this).css({"z-index" : zindex});
    });

    /* Closes window
        - Also removes indicators from corresponding dock item
        - Adjusts default window margin value
    */

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

    /* Minimizes window
        - Widens dock through padding
        - Minimizes window with class and specific "left" positioning property
        - Saves window position and window name in separate arrays
     */

    $(".button-minimize").click(function(){
        dockmitems++;
        dockwidth = $(".dock").width();
        $(".dock").css({"padding-right" : 95*dockmitems+10});
        $(this).parent(".window-header").parent(".window").addClass("window-minimized fixed-size");
        $(this).parent(".window-header").parent(".window").css({"left" : 95*dockmitems});
        
        var item = $(this).parent(".window-header").parent(".window").position();
        item = item.left;
        windowpositions.push(item);
        item = $(this).parent(".window-header").parent(".window").attr('id');
        minimizednames.push(item);
        
        setLeftMargin();
    });

    /* Set general left margin for all minimized windows */

    function setLeftMargin(){
        dockposition = $(".dock").position();
        var item = 160 + dockposition.left;
        $(".window").each(function() {
            if($(this).hasClass("window-minimized")){
                $(this).css({"margin-left" : item});
            }
        });
    }

    /* Adjust left margin of minimized windows when window is resized */

    $(window).on('resize', function(){
        setLeftMargin();
    });

    /* Restores window
        - Adjusts dock padding
        - Restores window by removing class
        - Fetches window name and searches for its position N in window name array
        - Grabs "left" value N from window position array
        - Sets "left" value for window
        - Removes name and position from array
        - Sets left value of each minimized window when a window gets restored
     */

    $(".window").mouseup(function(){
        if($(this).hasClass("window-minimized")){

            if(dockmitems > 0){
                dockmitems--;
            }
            $(".dock").css({"padding-right" : 90*dockmitems+5});
            $(this).removeClass("window-minimized fixed-size");

            var windowname = $(this).attr('id');
            windowname = jQuery.inArray( windowname, minimizednames);
            item = windowpositions[windowname];
            $(this).css({"left" : item});
            minimizednames.splice(windowname, 1);
            windowpositions.splice(windowname, 1);

            $(".window").each(function(){
                if($(this).hasClass("window-minimized")){
                    var windowname = $(this).attr('id');
                    windowname = jQuery.inArray( windowname, minimizednames);
                    $(this).css({"left" : 90*(windowname+1)});
                }
            });

            $(this).css({"margin-left" : "0"});
            setLeftMargin();
        }
    });

    /* DOCK */

    /* Opens window
        - Only adds bounce animation when not already active
        - Adds indicator below item after bounce ends
        - Opens window only when not already indicated as active
        - Sets window margin to default value, N+1 times as high depending how many windows occupy the value N (you get what I mean)
        - Adds active indicator to dock item and window, adds no-virgin class for ^
     */

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