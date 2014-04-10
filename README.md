#Animate

Animate

## API

anim(elem).to(props,[duration],[easing]);

where duration is number by millisecond, easing is the css easing function

default duration: 200ms
default easing: "linear"

instance.pause: pause current animation
instance.resume: resume current animation

## Sample

var myAnimation = anim(elem).to({
  'background-color': '#E79D35',
  'border-width': '1px',
  'border-style': 'solid',
  'border-color': '#000000',
  'color': '#fff',
  'height': '45px',
  'opacity': '0.6',
  'width': '100px'
}, 1000, "linear");

myAnimation.pause()
myAnimation.resume()

## Install

use `cortex` to install animation

`cortex install animation`