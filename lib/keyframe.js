// keyframe generater

var UNIT_TIME = "ms";
var UNIT_SIZE = "px";

// ref - Access and modify CSS animations @keyFrames with Javascript:
// https://snipt.net/raw/dcf97928840c8e89deddc2321420ccaa/?nice
function parseProperty(key){
    return key.replace(/([A-Z])/g,"-$1").toLowerCase()
}

module.exports = {
    apply: function(elem,animates){
        elem.style.webkitAnimation = animates.map(function(anim){
            return [
                anim.name,
                anim.duration + UNIT_TIME,
                anim.easing,
                "forwards"
            ].join(" ")
        }).join(",");
    },
    generate: function(name, props, elem){
        return [
            "@-webkit-keyframes " + name + "{",
            (function(){
                var start = "0%{";
                if(elem){
                    for(var k in props){
                        start += parseProperty(k) + ":" + window.getComputedStyle(elem)[k] + ";";
                    }
                }
                start += "}";
                return start;
            })(),
            (function(){
                var end = "100%{";
                for(var k in props){
                    end += parseProperty(k) + ":" + props[k] + ";";
                }
                end += "}";
                return end;
            })(),
            "}"
        ].join("")
    }
}