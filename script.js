$(document).ready(function(){

    /* -- DO NOT CHANGE THESE -- */

    var zindex = 0;             //z-index for windows
    var margin = 0;             //margin for initial positioning of windows (counts windows occupying space)
    var item = 0;               //throwaway variable, used for absolutely everything
    var menuactive = 0;         //Is header menu open?
    var isLink = 0;             //Is the element in the header menu being clicked a link?
    var isButton = 0;           //Is the element below the mouse a window button?
    var dockmitems = 0;         //Amount of minimized windows
    var dockmitemswidth = 92;   //Width of minimized icons including margin
    var dockwidth = 0;          //Width of dock, is filled in automatically
    var dockposition = 0;       //Position of dock, is filled in automatically
    var filecontent = 0;        //Content of scanned file, needed for generation of windows
    var windowpositions = [];   //Storage for positions of windows being minimized
    var minimizednames = [];    //Storage for names of windows being minimized
    var transition = 600;       //Duration of all transitions
    var file = 1;               //Used to scan subdirectory

    /* -- CONFIGURABLE OPTIONS -- */

    // Titles of the default header files
    var SubfolderName = "windows";
    var DefaultDynamicMenu = "dynamic-default";
    var DefaultFixedMenu = "fixed-default";
    var DefaultIconName = "icon";

    // Title shown in default menu
    var id = "WebDesktop";
    var initialID = id;
    
    // Colours to be used in randomizer
    var colours = ["red", "pink", "purple", "deeppurple", "indigo", "lightblue", "cyan", "teal", "green", "lightgreen", "lime", "yellow", "amber", "orange", "deeporange"];
    
    // Names of windows being generated (Filenames are 1.html, 2.html and so on, so their names need to be specified
    var filenames = ["Twitter", "Steam", "GitHub", "MyAnimeList", "MyFigureCollection"];
    
    // Names of windows being non-resizable
    var fixedwindows = [];

    /* Add windows and dock items from subfolder "windows"
        - Filenames HAVE to be 1.html, 2.html and so on
        - Each time a file is found, its name and short name is taken from arrays
        - Calls fixed size method after adding of all windows is done
    */

    createWindows();

    function createWindows(){

        /* Load initial menus */

        filename = DefaultFixedMenu;
        loadInitialMenu();

        filename = DefaultDynamicMenu;
        loadInitialMenu();

        function loadInitialMenu(){

            if(filename == DefaultFixedMenu){

                $.get(SubfolderName + '/' + filename + '.html', function(response) {
                     filecontent = response;
                     filecontent  = filecontent .replace('<navbar>', '<div class="navbar">')
                                                .replace('<option>', '<div class="navbar-option"><img src="' + SubfolderName + '/' + DefaultIconName + '.png">')
                                                .replace(/<option>/g, '<div class="navbar-option">')
                                                .replace(/<submenu>/g, '<div class="navbar-submenu">')
                                                .replace(/<section>/g, '<div class="navbar-section">')
                                                .replace('ABOUT', '<a>About ' + id + '</a>')
                                                .replace('QUIT', '<a>Quit ' + id + '</a>')
                                                .replace(/<\/>/g, '</div>');
                     $('.menu-static').html(filecontent);
                });
            }else{
                $.get(SubfolderName + '/' + filename + '.html', function(response) {
                     filecontent = response;
                     filecontent  = filecontent .replace('<navbar>', '<div class="navbar">')
                                                .replace('<option>', '<div class="navbar-option navbar-option-first">' + id)
                                                .replace(/<option>/g, '<div class="navbar-option">')
                                                .replace(/<submenu>/g, '<div class="navbar-submenu">')
                                                .replace(/<section>/g, '<div class="navbar-section">')
                                                .replace('ABOUT', '<a>About ' + id + '</a>')
                                                .replace('QUIT', '<a>Quit ' + id + '</a>')
                                                .replace(/<\/>/g, '</div>');
                     $('.menu-dynamic').html(filecontent);
                });
            }
        }

        /* Generate windows and dock items */

        $.ajax({
            url: SubfolderName + '/' + file + '.html',
            success: function(data){

                $.get(SubfolderName + '/' + file + '.html', function(data) {
                    filecontent  = data .replace('<navbar>', '<div class="navbar">')
                                        .replace(/<option>/g, '<div class="navbar-option">')
                                        .replace(/<submenu>/g, '<div class="navbar-submenu">')
                                        .replace(/<section>/g, '<div class="navbar-section">')
                                        .replace(/<\/>/g, '</div>');
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
                       '<div class="dock-item" id="' + filenames[file-1] + '" style="background:url(' + SubfolderName + '/' + file + '.png) no-repeat center">\
                            <div class="full-name">\
                                ' + filenames[file-1] + '\
                            </div>\
                        </div>'
                    );


                    file++;
                    createWindows();
                }
            },
            error: function(){
                setFixedSizeWindows();
            },
        });
    }

    /* Makes all windows in array fixed size, then calls everything else */

    function setFixedSizeWindows(){
        for (var i = 0; i < fixedwindows.length; i++) {
            $("#" + fixedwindows[i] + "-w").addClass("fixed-size");
        }
        windowsAdded();
    }

    /* Everything to run after windows have been built */

    function windowsAdded(){

        /* Call function to set initial width */

        setPseudoDockWidth();

        /* Fade in desktop elements and remove transform to fix z-index afterwards */

        $("header").css({"transform" : "translateY(0)"});
        $("footer").css({"transform" : "translateY(0)"});
        setTimeout(function(){
            $("header").css({"transform" : "initial"});
            $("footer").css({"transform" : "initial"});
        }, 100);

        /* -- HEADER -- */

        /* Close menu */

        $(".header-space, .desktop, footer").on('mousedown', function(){
            if(menuactive == 1){
                $(".navbar-option").css({"background" : "initial"});
                $(".navbar-submenu").css({"display" : "none"});
                menuactive = 0;
            }
        });

        $(".menu").on('click', 'a', function(){
            $(".navbar-option").css({"background" : "initial"});
            $(".navbar-submenu").css({"display" : "none"});
            menuactive = 0;
        });

        /* Set isLink variable */

        $(".menu").on('mousedown', 'a', function(){
            isLink = 1;
        });

        $("body").on('mouseup', 'a', function(){
            isLink = 0;
        });

        /* Open menu or close if opened */

        $(".menu").on('mousedown', '.navbar-option', function(){
            if(menuactive == 1 && isLink == 0){
                $(this).css({"background" : "initial"});
                $(this).children(".navbar-submenu").css({"display" : "none"});
                menuactive = 0;
            }else{
                $(this).css({"background" : "#0664E0"});
                $(this).children(".navbar-submenu").css({"display" : "initial"});
                menuactive = 1;
            }
        });

        /* Switch over on hover if menu already opened */

        $(".menu").on('mouseover', '.navbar-option', function(){
            if(menuactive == 1){
                $(".navbar-option").css({"background" : "initial"});
                $(this).css({"background" : "#0664E0"});
                $(".navbar-submenu").css({"display" : "none"});
                $(this).children(".navbar-submenu").css({"display" : "initial"});
            }
        });

        /* Hide menu when hovering rest of header */

        $(".header-space").on('mouseover', function(){
            $(".navbar-option").css({"background" : "initial"});
            $(".navbar-submenu").css({"display" : "none"});
        });

        /* -- WINDOWS -- */

        /* jQuery UI Draggable and Resizable functions */

        $( ".window" ).draggable({
            containment: "parent", handle: ".window-header", cancel: ".window-header-button",
            start: function() {
                if(margin > 0){
                    margin--;
                }
            }
        });
        
        $( ".window" ).not(".fixed-size").resizable({
            containment: "parent", minHeight: 239, minWidth: 202, handles: 'n, e, s, w'
            /* minHeight 239px so first button in sidebar is always visible. 240 shows 1px of next button 
               minWidth 202 = 200 sidebar width + 2 border                                                  */
        });

        /* Remove cover */

        $(".cover").css({"transform" : "scale(1.5)", "opacity" : "0", "visibility" : "hidden"});

        /* Makes all windows background ones when clicking desktop, also clears dynamic menu */

        $(".backdrop").click(function(){
            $(".window").removeClass("foreground");
            filename = DefaultDynamicMenu;
            id = initialID;
            loadMenu(filename, id);
        });

        /* Bring clicked window to foreground, set dynamic menu accordingly */

        $(".window").mousedown(function(){
            if(isButton == 0){
                zindex++;
                item = $(this);
                if(!($(this).hasClass("window-minimized"))){
                    $(this).css({"z-index" : zindex});
                }
                $(".window").removeClass("foreground");
                $(this).addClass("foreground");

                if(!($(this).hasClass("window-minimized"))){
                    var id = $(this).attr('id');
                    id = id.slice(0, -2);
                    var filename = filenames.indexOf(id);
                    loadMenu(filename, id);
                }
            }
        });

        /* Sets isButton variable, needed for window mousedown */

        $(".window-header-button").hover(function(){
            if(isButton == 0){
                isButton = 1;
            }else{
                isButton = 0;
            }
        });

        /* Closes window
            - Also removes indicators from corresponding dock item
            - Adjusts default window margin value
        */

        $(".button-close").click(function(){
            $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").css({"display" : "none"});
            $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").removeClass("active");

            var id = $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").attr('id');
            id = id.slice(0, -2);
            $("#" + id).removeClass("active show-indicator");

            if(margin > 0){
                margin--;
            }

            filename = DefaultDynamicMenu;
            id = initialID;
            loadMenu(filename, id);
        });

        /* Minimizes window
            - Widens dock through padding
            - Minimizes window with class and specific "left" positioning property
            - Adds transition to window and removes it when done
            - Saves window position and window name in separate arrays
         */

        $(".button-minimize").click(function(){
            dockmitems++;
            SetDockPadding();

            $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").addClass("window-minimized");
            $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").css({"left" : dockmitemswidth*dockmitems, "transition" : transition + "ms", "z-index" : 10000+zindex});
            $(this).parent(".window-header-buttons").parent(".window-header").css({"transition" : transition + "ms"});
            $(this).parent(".window-header-buttons").children(".window-header-button").css({"transform" : "scaleY(0)"});

            $(".dock").css({"z-index" : zindex-1});

            setTimeout(function(){
                $(".dock").css({"z-index" : 10000});
            }, transition);
            
            var item = $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").position();
            item = item.left;
            windowpositions.push(item);
            item = $(this).parent(".window-header-buttons").parent(".window-header").parent(".window").attr('id');
            minimizednames.push(item);
            
            setLeftMargin();
            dockSeparator();
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
            - Sets dynamic menu
            - Adds transition to window and removes it immediately
         */

        $(".window").mouseup(function(){
            if($(this).hasClass("window-minimized")){

                if(dockmitems > 0){
                    dockmitems--;
                }
                SetDockPadding();
                $(this).removeClass("window-minimized");
                $(".window").removeClass("foreground");
                $(this).addClass("foreground");
                $(this).children(".window-header").children(".window-header-buttons").children(".window-header-button").css({"transform" : "scaleY(1)"});

                var id = $(this).attr('id');
                id = jQuery.inArray( id, minimizednames);
                item = windowpositions[id];
                $(this).css({"left" : item});
                minimizednames.splice(id, 1);
                windowpositions.splice(id, 1);

                id = $(this).attr('id');
                id = id.slice(0, -2);
                var filename = filenames.indexOf(id);
                loadMenu(filename, id);

                item = $(this);
                setTimeout(function(){
                    $(item).css({"transition" : "0ms", "z-index" : zindex});
                    $(item).children(".window-header").css({"transition" : "0ms"});
                }, 100);

                $(".window").each(function(){
                    if($(this).hasClass("window-minimized")){
                        var id = $(this).attr('id');
                        id = jQuery.inArray( id, minimizednames);
                        $(this).css({"left" : dockmitemswidth*(id+1)});
                    }
                });

                $(this).css({"margin-left" : "0"});
                setLeftMargin();
                dockSeparator();
            }
        });

        /* -- FOOTER -- */

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
            var filename = filenames.indexOf(id);
            
            loadMenu(filename, id);

            id += "-w";

            if(!($("#" + id).hasClass("window-minimized"))){
                zindex++;
                $("#" + id).css({"z-index" : zindex});
                $(".window").removeClass("foreground");
                $("#" + id).addClass("foreground");
            }
            
            if(!($(this).hasClass("bounce"))){
                setTimeout(function(){
                    $(item).removeClass("bounce-2");
                    if($("#" + id).hasClass("active")){
                        $(item).addClass("show-indicator");
                    }
                }, 1400);
            }

            if(!($(this).hasClass("show-indicator"))){
                $(this).addClass("bounce-1");
                setTimeout(function(){
                    $(item).removeClass("bounce-1");
                    $(item).addClass("bounce-2");
                }, 400);
                setTimeout(function(){
                    $(item).removeClass("bounce-2");
                    $(item).addClass("bounce-1");
                }, 700);
                setTimeout(function(){
                    $(item).removeClass("bounce-1");
                    $(item).addClass("bounce-2");
                }, 1100);
            }
            
            if(!($(this).hasClass("active"))){
                
                margin++;
                
                $("#" + id).css({"display" : "block"});

                var colour = colours[Math.floor(Math.random()*colours.length)];
                $("#" + id).children(".window-content").children(".title").addClass(colour);
                
                if(!($(this).hasClass("no-virgin"))){
                    $("#" + id).css({"left" : margin*40, "top" : margin*40});
                }
                
                $(this).addClass("active no-virgin");
                $(".window").removeClass("foreground");
                $("#" + id).addClass("active foreground");
            }
        });

        /* FUNCTIONS */

        /* Load html file, replace elements with actual divs (header) */

        function loadMenu(filename, id){
            if(filename == DefaultDynamicMenu){
                $.get(SubfolderName + '/' + filename + '.html', function(response) {
                     filecontent = response;
                     filecontent  = filecontent .replace('<navbar>', '<div class="navbar">')
                                                .replace('<option>', '<div class="navbar-option navbar-option-first">' + id)
                                                .replace(/<option>/g, '<div class="navbar-option">')
                                                .replace(/<submenu>/g, '<div class="navbar-submenu">')
                                                .replace(/<section>/g, '<div class="navbar-section">')
                                                .replace('ABOUT', '<a>About ' + id + '</a>')
                                                .replace('QUIT', '<a>Quit ' + id + '</a>')
                                                .replace(/<\/>/g, '</div>');
                     $('.menu-dynamic').html(filecontent);
                });
            }else{
                $.get(SubfolderName + '/' + (filename+1) + '.html', function(response) {
                     filecontent = response;
                     filecontent  = filecontent .replace('<navbar>', '<div class="navbar">')
                                                .replace('<option>', '<div class="navbar-option navbar-option-first">' + id)
                                                .replace(/<option>/g, '<div class="navbar-option">')
                                                .replace(/<submenu>/g, '<div class="navbar-submenu">')
                                                .replace(/<section>/g, '<div class="navbar-section">')
                                                .replace('ABOUT', '<a>About ' + id + '</a>')
                                                .replace('QUIT', '<a>Quit ' + id + '</a>')
                                                .replace(/<\/>/g, '</div>');
                     $('.menu-dynamic').html(filecontent);
                });
            }
        }

        /* Set general left margin for all minimized windows */

        function setLeftMargin(){
            item = 0;
            $(".dock-item").each(function(){
                item++
            });
            dockposition = $(".dock-background").position();
            var item = (70*(item-1))+23 + dockposition.left;
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
            $(".dock-separator").css({"transform" : "translateX(" + (dockwidth+22) + "px)"});
        }

        /* Calculates dock padding */

        function SetDockPadding(){
            if(dockmitems > 0){
                $(".dock").css({"padding-right" : dockmitemswidth*dockmitems+40});
                $(".dock-background").css({"padding-right" : dockmitemswidth*dockmitems+40});
            }else{
                $(".dock").css({"padding-right" : dockmitemswidth*dockmitems+6});
                $(".dock-background").css({"padding-right" : dockmitemswidth*dockmitems+6});
            }
        }

        /* Sets transition back to its value after window resizing done */

        function setWindowTransition(){
            $(".window").each(function(){
                if($(this).hasClass("window-minimized")){
                    $(this).css({"transition" : transition + "ms"});
                }
            });
        }

        function dockSeparator(){
            if(dockmitems > 0){
                $(".dock-separator").css({"visibility" : "visible", "opacity" : "1"});
            }else{
                $(".dock-separator").css({"visibility" : "hidden", "opacity" : "0"});
            }
        }
    }
});