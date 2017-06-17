$(document).ready(function(){

    var zindex = 0;
    var margin = 0;
    var item = 0;
    var dockmitems = 0;
    var dockwidth = 0;
    var dockposition = 0;
    var filecontent = 0;
    var windowpositions = [];
    var minimizednames = [];
    var transition = 600;
    var file = 1;
    var filenames = ["Twitter", "Steam", "MyAnimeList", "MyFigureCollection"];
    var shortnames = ["Tw", "St", "MAL", "MFC"];
    var fixedwindows = [];

    /* Add windows and dock items from subfolder "windows" 
        - Filenames HAVE to be 1.html, 2.html and so on
        - Each time a file is found, its name and short name is taken from arrays
        - Calls fixed size method after adding of all windows is done
    */

    createWindows();

    function createWindows(){
        $.ajax({
            url: 'windows/' + file + '.html',
            success: function(data){

                $.get('windows/' + file + '.html', function(data) {
                    filecontent = data;
                    appendItems();
                });

                /* Extra function because $.get is stupid */

                function appendItems(){

                    $(".desktop").append(
                       '<div class="window" id="' + filenames[file-1] + '-w">\
                            <div class="window-header">\
                                <div class="window-header-buttons">\
                                    <div class="window-header-button button-close"></div>\
                                    <div class="window-header-button button-minimize"></div>\
                                    <div class="window-header-button button-fullscreen"></div>\
                                </div>\
                                <span class="window-header-title">' + filenames[file-1] + '</span>\
                            </div>\
                            <div class="window-content">' + filecontent + '</div>\
                        </div>'
                    );

                    $(".dock").append(
                       '<div class="dock-item" id="' + filenames[file-1] + '">\
                            <div class="full-name">\
                                ' + filenames[file-1] + '\
                            </div>\
                            ' + shortnames[file-1] + '\
                        </div>'
                    );

                    file++;
                    createWindows();
                }
            },
            error: function(data){
                console.log("Flat is justice");
                setFixedSize();
            },
        });
    }

    /* Makes all windows in array fixed size, then calls everything else */

    function setFixedSize(){
        for (var i = 0; i < fixedwindows.length; i++) {
            $("#" + fixedwindows[i] + "-w").addClass("fixed-size");
        }
        windowsAdded();
    }

    /* Everything to run after windows have been built */

    function windowsAdded(){

        /* Call function to set initial width */

        setPseudoDockWidth();

        /* jQuery UI Draggable and Resizable functions */

        $( ".window" ).draggable({
            containment: "parent", handle: ".window-header",
            start: function() {
                if(margin > 0){
                    margin--;
                }
            }
        });
        
        $( ".window" ).not(".fixed-size").resizable({
            containment: "parent", minHeight: 200, minWidth: 200, handles: 'n, e, s, w'
        });

        /* Remove cover */

        $(".cover").css({"opacity" : "0", "visibility" : "hidden"});

        /* Makes all windows background when clicking desktop */

        $(".backdrop").click(function(){
            $(".window").removeClass("foreground");
        });

        /* Bring clicked window to foreground */

        $(".window").mousedown(function(){
            zindex++;
            item = $(this);
            if(!($(this).hasClass("window-minimized"))){
                $(this).css({"z-index" : zindex});
            }
            $(".window").removeClass("foreground");
            $(this).addClass("foreground");
        });

        /* Closes window
            - Also removes indicators from corresponding dock item
            - Adjusts default window margin value
        */

        $(".button-close").click(function(){
            $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").css({"display" : "none"});
            $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").removeClass("active");

            var item = $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").attr('id');
            item = item.slice(0, -2);
            $("#" + item).removeClass("active show-indicator");

            if(margin > 0){
                margin--;
            }
        });

        /* Minimizes window
            - Widens dock through padding
            - Minimizes window with class and specific "left" positioning property
            - Adds transition to window and removes it when done
            - Saves window position and window name in separate arrays
         */

        $(".button-minimize").click(function(){
            dockmitems++;
            setDockSize();

            $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").addClass("window-minimized");
            $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").css({"left" : 90*dockmitems, "transition" : transition + "ms", "z-index" : "10001"});
            $(this).parent(".window-header-buttons").parent(".window-header").css({"transition" : transition + "ms"});
            $(this).parent(".window-header-buttons").children(".window-header-button").css({"transform" : "scaleY(0)"});
            
            var item = $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").position();
            item = item.left;
            windowpositions.push(item);
            item = $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").attr('id');
            minimizednames.push(item);
            
            setLeftMargin();
        });

        /* Adjust left margin of minimized windows when window is resized
            - Also removes transition from minimized window to make then not behave weird as fuck
         */

        $(window).on('resize', function(){
            setLeftMargin();
            $(".window").css({"transition" : "0ms"});

            clearTimeout(item);
            item = setTimeout(setWindowTransition, 100);
        });

        /* Restores window
            - Adjusts dock padding
            - Restores window by removing class
            - Adjusts foreground classes
            - Fetches window name and searches for its position N in window name array
            - Grabs "left" value N from window position array
            - Sets "left" value for window
            - Removes name and position from array
            - Adds transition to window and removes it immediately
         */

        $(".window").mouseup(function(){
            if($(this).hasClass("window-minimized")){

                if(dockmitems > 0){
                    dockmitems--;
                }
                setDockSize();
                $(this).removeClass("window-minimized");
                $(".window").removeClass("foreground");
                $(this).addClass("foreground");
                $(this).children(".window-header").children(".window-header-buttons").children(".window-header-button").css({"transform" : "scaleY(1)"});

                var windowname = $(this).attr('id');
                windowname = jQuery.inArray( windowname, minimizednames);
                item = windowpositions[windowname];
                $(this).css({"left" : item});
                minimizednames.splice(windowname, 1);
                windowpositions.splice(windowname, 1);

                item = $(this);
                setTimeout(function(){
                    $(item).css({"transition" : "0ms", "z-index" : zindex});
                    $(item).children(".window-header").css({"transition" : "0ms"});
                }, 100);

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
                $(".window").removeClass("foreground");
                $("#" + id).addClass("active foreground");
            }
        });

        /* FUNCTIONS */

        /* Set general left margin for all minimized windows */

        function setLeftMargin(){
            dockposition = $(".dock-background").position();
            var item = 160 + dockposition.left;
            $(".window").each(function() {
                if($(this).hasClass("window-minimized")){
                    $(this).css({"margin-left" : item});
                }
            });
        }

        /* Sets pseudo dock width so minimized window positions can be taken from it*/

        function setPseudoDockWidth(){
            dockwidth = $(".dock").width();
            $(".dock-background").css({"width" : dockwidth});
        }

        /* Calculates dock padding */

        function setDockSize(){
            $(".dock").css({"padding-right" : 90*dockmitems+5});
            $(".dock-background").css({"padding-right" : 90*dockmitems+5});
        }

        /* Sets transition back to its value after window resizing done */

        function setWindowTransition(){
            $(".window").each(function(){
                if($(this).hasClass("window-minimized")){
                    $(".window").css({"transition" : transition + "ms"});
                }
            });
        }
    }
});