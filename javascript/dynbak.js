/*!
 * Dynamic Background
 * http://affiliates.istripper.com/
 *
 * Copyright Totem Entertainment
 * All Rights Reserved
 *
 * Date: 2016-08-31T17:46Z
 * Version: 1.4.1
 */

/*jslint browser: true, white: true, multivar: true, for: true */
/*global window, document, event, Image, screen, setTimeout, XMLHttpRequest, console */

if(!window.TotemTools) {
    window.TotemTools = {};
}

window.TotemTools._requestAnimationFrame = function(t) {
    return window["webkitR" + t] || window["r" + t] || window["mozR" + t]
          || window["msR" + t] || function(fn) { setTimeout(fn, 60) }
}(window, "equestAnimationFrame");

window.TotemTools.dynamicBackground = function(args){
    "use strict";
    var default_config = {
        // Your link code ID.
        // THIS VALUE IS REQUIRED
        linkCode:       "YOUR_ID",

        // The picture will be spaced this length minimum from the top of the window
        top:            120,

        // The picture will be spaced this length minimum from the left or right of the window
        side:           100,

        // The picture will never exceed this height
        maxHeight:      400,

        // The picture stays on the sceen during this duration
        duration:       5000,

        // Fade animation speed (from opacity:1 to opacity:0)
        speed:          1000,

        // The z-index CSS property shorthand
        zIndex:         0,

        // Position of the picture (accept: "left","right","random")
        position:       "left",

        // Do you want to show a specific model? If update is set to true, you will retreive
        // only pictures on this model from our servers. Please visit our model page on tools
        // to see allowed values here. (0: All models)
        model:          0,

        // Same as model but with an array of moId
        models:          [],

        // How much do you want to expose the user to nudity
        // Accepted values:
        // 0: Must contain no nudity (SFW)
        // 1: Hidden nudity (sexual area blurred or hidden)
        // 2: Nudity allowed but no pornography: Only sensual (nude or not) content
        // 3: Nudity required: Same as above but only nude picture (NSFW)
        // 4: Nudity and pornography allowed: Allow sexually explicit pictures
        // 5: Pornography required: Only sexually explicit pictures
        nudityLevel:    0,

        // Do you want a specific landing page version ? Please see landing pages tools
        // for more information about allowed and availables versions
        version:        0,

        // Do you want to upgrade connection in https if you are in http ?
        forceSSL:       false,

        // Default cards used if our server are not available
        defaults:       ['e0111','e0017','e0044','e0085','e0116','e0221','e0243','e0302','e0304','e0280','e0356'],

        // Use our server to get all cards list (updated daily). If set to false, you will only
        // use the 'defaults' list above.
        update:         true,

        // Wrapper ID used in HTML. This must be an unused ID in your website
        wrapper:        "Totem_DynamicBackgroundWrapper",

        // Change the behaviour when user click on the picture
        // Possibles values: _blank (open in new tab), _self (open in same tab)
        target:         "_blank",

        // Domain from where pictures and scripts are called.
        // OVERRIDE ONLY IF YOU WERE ASKED TO.
        domain:         "bnrs.it",

        // Do you want to show a specific product code.
        // @DEPRECATED: THIS IS A LEGACY BEHAVIOUR
        product:        28
    };

    var options = [];
    for(var idx in default_config)
    {
        if(args && args[idx] !== undefined) {
            options[idx] = args[idx];
        } else {
            options[idx] = default_config[idx];
        }
    }

    var protocol_in_use     = 'http'+((options.forceSSL || window.location.protocol === 'https') ? 's' : '')+'://';
    var pathFull            = protocol_in_use+options.domain+"/customdata/banner/pngFull/";
    var images              = [];
    var element             = false;
    var timeout             = null;

    var build_images = function(source)
    {
        for(var idx in source)
        {
            if(source[idx].length < 6) {
                images.push(source[idx]+"_full.png");
            }
        }
    };

    var get_sizes = function()
    {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        var h =( y - options.top > options.maxHeight ) ? options.maxHeight : (y - options.top);
        if(y < options.top)
        {
            h = 0;
        }

        return {height:h,width:x};
    };

    var set_style = function(elm,props)
    {
        for(var property in props)
        {
            elm.style[property] = props[property];
        }
    };

    var get_element = function(classname)
    {
        if(!element)
        {
            var append_div = document.createElement('div');
            var append_link = document.createElement('a');
            var append_close = document.createElement('div');

            append_div.id = options.wrapper;
            document.body.appendChild(append_div);
            element = document.getElementById(options.wrapper);

            append_link.href = "javascript:;";
            append_link.target = options.target;
            element.appendChild(append_link);

            append_close.innerHTML = "X";
            append_close.className = "close_button";
            append_close.dataset.position = "left";
            set_style(append_close,{
                display:        "inline-block",
                background:     "#555",
                border:         "1px solid #222",
                color:          "#fff",
                padding:        "0 4px",
                "font-family":  "Arial",
                "font-size":    "10px",
                "font-weight":   "bold",
                position:       "fixed",
                bottom:         "10px",
                "line-height":  "17px",
                left:           (options.side+10)+"px",
                cursor:         "pointer",
                "border-radius":"50%"
            });
            append_close.onclick = function()
            {
                clearTimeout(timeout);
                element.remove();
            }
            element.appendChild(append_close);
        }
        if(!classname)
        {
            return element;  
        } 
        else 
        {
            return element.getElementsByClassName(options.wrapper+"_"+classname)[0];  
        }
    };

    var fade_out = function(el)
    {
        if(el)
        {
            var end_time = +new Date() + options.speed;
            el.style.opacity = 1;

            function fade() {
                el.style.opacity = (end_time - (+new Date()))/options.speed;
                if (el.style.opacity < 0) {
                    el.remove();
                } else {
                    window.TotemTools._requestAnimationFrame(fade);
                }
            }
            fade();
        }
        return;
    };

    var fade_in = function(el)
    {
        if(el)
        {
            var end_time = +new Date() + options.speed;
            el.style.opacity = 0;
            el.style.display = "block";

            function fade() {
                var val = 1-((end_time - (+new Date()))/options.speed);

                if (val <= 1) {
                    el.style.opacity = val;
                    window.TotemTools._requestAnimationFrame(fade);
                } else {
                    var btn = get_element().getElementsByClassName("close_button")[0];
                    el.style.opacity = 1;
                    if(el.className === options.wrapper + "_next")
                    {
                        el.className = options.wrapper + "_current";
                    }
                    if(btn && el.dataset.position && btn.dataset.position !== el.dataset.position)
                    {
                        btn.dataset.position = el.dataset.position;
                        if(btn.dataset.position === "right")
                        {
                            btn.style.left = "auto";
                            btn.style.right = (options.side+10)+"px";
                        }
                        else
                        {
                            btn.style.right = "auto";
                            btn.style.left = (options.side+10)+"px";
                        }
                    }
                    get_element().getElementsByTagName('a')[0].href = "http://istri.it/?s=" + options.linkCode + "&p=" + options.product + "&cardid=" + el.dataset.id + "&v=" + options.version;
                }
            }
            fade();
        }
        return;
    };

    var create_image = function(id)
    {
        var rand_number,
            last_image = get_element("next") || get_element("current"),
            position = "",
            image = new Image();
        
        if(images.length > 1 && last_image && last_image.dataset)
        {
            do
            {
                rand_number = Math.round(Math.random()*(images.length-1));
            }
            while(last_image.dataset.id === images[rand_number].substr(0,5))
        }
        else
        {
            rand_number = Math.round(Math.random()*(images.length-1));
        }

        if(options.position === "random")
        {
            position = Math.round(Math.random()*(2)) === 1 ? "left" : "right";
        }

        if(options.position === "left" || position === "left")
        {
            image.style.left = options.side+"px";
            position = "left";
        }
        if(options.position === "right" || position === "right")
        {
            image.style.right = options.side+"px";
            position = "right";
        }
        image.src = pathFull+images[rand_number];
        image.className = options.wrapper + "_"+id;
        image.dataset.id = images[rand_number].substr(0,5);
        image.dataset.position = position;

        set_style(image,{
            position:   "fixed",
            opacity:    "0",
            height:     1300 + "px",
            bottom:     "-45%",
            left:     "47%",
            width:      "auto",
            display:    "none",
            "z-index":  0
        });
        return image;
    };

    var create_next = function()
    {
        var next_image = create_image("next");
        get_element().getElementsByTagName('a')[0].appendChild(next_image);
    }

    var change_image = function()
    {

        if(images.length > 1)
        {
            var next_image = get_element("next");
            if(next_image && next_image.complete)
            {
                fade_out(get_element("current"));
                fade_in(get_element("next"));
            }
            // Do not create if awaiting load
            if(!next_image || next_image.complete)
            {
                create_next();
            }
        }
        timeout = setTimeout(change_image, options.duration);
    };

    // Check options validity
    options.maxHeight = Math.min(options.maxHeight,900);
    options.duration = Math.max(options.duration,2000);

    if(parseInt(options.speed)>(options.duration/2))
    {
        options.speed = Math.round(options.duration/2);
    }

    // If you want to retreive card list directly from Totem Services
    if(options.update)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === 4)
            {
                if(xhttp.status === 200) {
                    if(xhttp.responseText) {
                        images = [];
                        build_images(xhttp.responseText.split(","));
                    } else {
                        build_images(options.defaults);
                    }
                } else {
                    build_images(options.defaults);
                }
            }
        };
        if(options.models.length > 0) options.model = options.models.join();
        xhttp.open("GET", pathFull+"get_cards.php?pr="+options.product+"&mo="+options.model+"&nudelevel="+options.nudityLevel, true);
        xhttp.send();
    }

    // Fallback: Fail during build
    if(images.length === 0)  {
        build_images(options.defaults);
    }
    if(images.length === 0) {
        if(window.console) {
            console.error('Invalid arguments: Your default list is empty or invalid');
        }
        return 0;
    }

    // Fallback: Custom product override set to default
    if(options.product < 20) {
        options.product = defaults.product;
    }

    // We bind a resize event handler
    window.addEventListener('resize', function(){

        var image_height = get_sizes().height;

        get_element("current").style.height = image_height+"px";
        if(get_element("next"))
        {
            get_element("next").style.height = image_height+"px";
        }

    });

    var current = create_image("current");
    current.onload = function(){
        fade_in(this);
        change_image();
    };
    get_element().getElementsByTagName('a')[0].appendChild(current);
    return 1;
};

// Async loading execution
if(window.TotemTools._dynamicBackground) {
    window.TotemTools.dynamicBackground(window.TotemTools._dynamicBackground);
}