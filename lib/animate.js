

// TODO:
// way to store events on element
var _uid = 0;

var util = require("util");
var events = require("events");
var keyframe = require("./keyframe");

var ANIMATION_KEYFRAME_PREFIX = "animation-keyframe-";
var DOC = document;

var caches = {};

function generateKeyframeName(){
    _uid ++;
    return ANIMATION_KEYFRAME_PREFIX + _uid;
}

function Animate(props, duration, easing, options){
    var style = DOC.createElement("style");
    var styleString = "";
    var cacheKey = JSON.stringify(props);

    options = options || {};

    this.isTemp = !!options.temp;

    if(caches[cacheKey] && !options.temp){
        return caches[cacheKey];
    }else{
        var name = generateKeyframeName();
        var frameText = keyframe.generate(name, props, options.elem);

        this.frameText = frameText;
        this.name = name;
        this.styleTag = style;
        this.duration = duration || 200;
        this.easing = easing || "linear";
        this.props = props;
        style.innerHTML = this.frameText;
        DOC.head.appendChild(style);
        if(!options.temp){
            caches[cacheKey] = this;
        }else if(options.elem){
            this._apply(options.elem);
        }
        return this;
    }
}

util.inherits(Animate,events);

Animate.prototype.destroy = function(){
    DOC.head.removeChild(this.styleTag);
};

Animate.prototype._apply = function(elem){
    if(elem.current_anim && elem.current_anim.isTemp){
        elem.current_anim.destroy();
    }
    var self = this;
    var has_events = elem._events;

    keyframe.apply(elem, [this]);

    elem._events = elem._events || {
        animation_start: [],
        animation_end: []
    };

    elem._events.animation_start.push(function(e){
        if(self.name == e.animationName){
            self.running = elem._anim_running = true; // 是否要靠elem来管理_anim_running状态？
            self.emit("start",e);
        }
    });

    elem._events.animation_end.push(function(e){
        if(self.name == e.animationName){
            for(var prop in self.props){
                self.running = elem._anim_running = false;
                elem.style[prop] = window.getComputedStyle(elem)[prop];
            }
            if(self.isTemp){
                self.destroy();
            }
            self.emit("end",e);
        }
    });

    if(!has_events){
        elem.addEventListener("webkitAnimationStart",function(e){
            elem._events.animation_start.forEach(function(func){
                func.call(self,e);
            });
        });
        elem.addEventListener("webkitAnimationEnd",function(e){
            elem._events.animation_end.forEach(function(func){
                func.call(self,e);
            });
        });
        elem._has_anim_events = true;
    }
};


module.exports = Animate;