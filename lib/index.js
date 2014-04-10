
// Opt in to strict mode of JavaScript, [ref](http://is.gd/3Bg9QR)
// Use this statement, you can stay away from several frequent mistakes
'use strict';

var EventEmitter = require("events");
var _ = require("lang");
var util = require("util");
var Animate = require("./animate");



function AnimateManager(elem){
    var self = this;
    this.elem = elem;
    this.steps = [];
    this.currentStep = 0;
    this.status = "stopped";
    this.startTime = null;

    this.animates = [];

    return this;
}

util.inherits(AnimateManager,EventEmitter);
AnimateManager.prototype.to = function(props, duration, easing){
    var self = this;
    var elem = this.elem;

    // TODO 关联manager引用到Animate上，以区分目标
    if(elem._anim_running){
        new Animate(props, duration , easing, {
            elem: elem,
            temp: true
        });
    }else{
        this._newAnim(props,duration,easing);
    }
    return this;

}


AnimateManager.prototype._newAnim = function(props, duration, easing){
    var self = this;
    var anim = new Animate(props, duration, easing);
    if(this.animates.indexOf(anim) === -1){
        this.animates.push(anim);
    }

    // events.once不符合预期的行为
    if(!anim._events){
        anim.on("end",function(e){
            self.emit("end",e);
        });
    }

    setTimeout(function(){
        self.animates.forEach(function(item){
            item._apply(self.elem);
        });
    });
    return this;
}

AnimateManager.prototype.pause = function(){
    this.elem.style.webkitAnimationPlayState = "paused";
    this.status = "paused";
    this.emit("paused");
    return this;
}

AnimateManager.prototype.resume = function(){
    this.elem.style.webkitAnimationPlayState = "running";
    this.status = "running";
    return this;
}

module.exports = function(elem){
    return new AnimateManager(elem);
}