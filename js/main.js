/*global window, document, tizen, console, setTimeout, tau */

var canvas, context;

var currentFlower = 0;
var flowers = [
	[
       {"type": "coffee", "color": "#007de4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
       {"type": "coffee", "color": "#007de4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
       {"type": "coffee", "color": "#007de4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
       null,
       null,
       {"type": "coffee", "color": "#007de4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null}
	],  
	[
	   {"type": "coffee", "color": "#e4007d", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
	   {"type": "coffee", "color": "#e4007d", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
	   null,
	   {"type": "coffee", "color": "#e4007d", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
	   {"type": "coffee", "color": "#e4007d", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
	   null
	], 
    [
	   null,
	   {"type": "coffee", "color": "#7d00e4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
	   null,
	   {"type": "coffee", "color": "#7d00e4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
	   null,
	   {"type": "coffee", "color": "#7d00e4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null}
	],
	[
       {"type": "coffee", "color": "#e47d00", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
       null,
       null,
       {"type": "coffee", "color": "#e47d00", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
       {"type": "coffee", "color": "#e47d00", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345], "fire": null},
       null
	]
];

var animations = {
	"startup": {
		"active": false,
		"opacity": [0, 0, 0, 0, 0, 0]
	},
	"flowers": {
		"active": false,
		"centerX": 180,
		"centerY": 180,
		"centerXold": 0,
		"centerYold": 0
	},
	"dotTransition": {
		"active": false,
		"opacity": [1.0, 0.25, 0.25, 0.25]
	},
	"dotFade": {
		"activeIn": false,
		"activeOut": false,
		"multiplier": 0,
		"reference": null
	}
};

var dragLastX = 0;
var dragLastY = 0;

var flowerDotOpacityFadeOut;

var screenCenterX = 180;
var screenCenterY = 180;

var fps = 60;

var isScreenTouched = false;

window.requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
    	'use strict';
    	window.setTimeout(callback, 1000 / fps);
	};

/*
 * Converts degrees to radians.
 * @param deg Degrees input.
 * @return Returns radians.
 */
function rad(deg) {
    'use strict';
    return deg * Math.PI / 180;
}

/*
 * Calculates sign prefix of a number.
 * @param x Number to use.
 * @return Returns -1 or 1.
 */
function sign(x) {
    'use strict';
    return x < 0 ? -1 : 1;
}

/*
 * Based on current flower, returns the previous one.
 * @param flower The flower from which to return the previous one.
 * @return The previous flower.
 */
function flowerPrev(flower) {
    'use strict';
	flower -= 1;
	if (flower <= -1) {
		flower = 3;
	}
	return flower;
}

/*
 * Based on current flower, returns the next one.
 * @param flower The flower from which to return the next one.
 * @return The next flower.
 */
function flowerNext(flower) {
    'use strict';
	flower += 1;
	if (flower >= 4) {
		flower = 0;
	}
	return flower;
}

/*
 * Performs a frame step for transition of a variable.
 * @param value Variable to transition.
 * @param type Type of transition. Check function body for list.
 * @param start Starting value to fade from.
 * @param end Value to fade to.
 * @param duration Duration of the transition in ms.
 * @return Returns new value of the variable after one frame.
 */
function trans(value, type, start, end, duration) {
    'use strict';

    if (!(((end - start) >= 0 && value.toFixed(3) >= end) || ((end - start) <= 0 && value.toFixed(3) <= end))) {
    	var steps = (duration / 1000) * fps; 
    	var x, y;

        if (((end - start) >= 0 && value.toFixed(3) < start) || ((end - start) <= 0 && value.toFixed(3) > start)) {
    		value = start;
    	}
    	
    	switch (type) {
    	
    		// linear - Regular linear transition.
    		case "linear":
        		value += (end - start) / steps;
        		//console.log("trans linear value: " + value);
        		break;
        		
            // quad-down - Transition using quadratic equation. Slow-down.
    		case "quad-down":
        		y = 1 - (value.toFixed(3) - start) / (end - start);
        		x = 1 / steps - Math.pow(y, 1/2); 
        		value = (-Math.pow(x, 2) + 1) * (end - start) + start;
        		//console.log("trans quad-down y: " + y);
        		//console.log("trans quad-down x: " + x);
        		//console.log("trans quad-down value: " + value);
        		break;
        		
            // quad-up - Transition using quadratic equation. Speed-up.
    		case "quad-up":
        		y = (value.toFixed(4) - start) / (end - start);
        		x = 1 / steps + Math.pow(y, 1/2);  
        		value = Math.pow(x, 2) * (end - start) + start;
        		//console.log("trans quad-up y: " + y);
        		//console.log("trans quad-up x: " + x);
        		//console.log("trans quad-up value: " + value);
        		break;

            // cube-down - Transition using cubic equation. Slow-down.
    		case "cube-down":
        		y = 1 - (value.toFixed(3) - start) / (end - start);
        		x = 1 / steps - Math.pow(y, 1/3); 
        		value = (Math.pow(x, 3) + 1) * (end - start) + start;
        		//console.log("trans cube-down y: " + y);
        		//console.log("trans cube-down x: " + x);
        		//console.log("trans cube-down value: " + value);
        		break;
        		
        	// cube-up - Transition using cubic equation. Speed-up.
    		case "cube-up":
        		y = (value.toFixed(6) - start) / (end - start);
        		x = 1 / steps + Math.pow(y, 1/3);  
        		value = Math.pow(x, 3) * (end - start) + start;
        		//console.log("trans cube-up y: " + y);
        		//console.log("trans cube-up x: " + x);
        		//console.log("trans cube-up value: " + value);
        		break;        		
    	}
    }
	
	if (((end - start) >= 0 && value.toFixed(3) >= end) || ((end - start) <= 0 && value.toFixed(3) <= end)) {
    	value = end;
    }
    
    return value;
}

/*
 * Draws a single hexagon plate or add symbol.
 * @param ctx Context to draw in.
 * @param plate Plate to draw.
 * @param x X position of a plate.
 * @param y Y position of a plate.
 * @param colorA Primary color, used for plates.
 * @param colorB Secondary color, used for add symbols.
 * @param opacity Opacity of a plate or add symbol.
 */
function drawPlate(ctx, plate, x, y, colorB, opacity) {
    'use strict';
    
    // UI Parameters
    var plateRadius = 48;
    var addRadius = 24;
    var addWidth = 6;
    
	ctx.save();
	
	ctx.translate(x,y);
	ctx.globalAlpha = opacity;
	
	if (plate) {
		ctx.rotate(rad(-90));
		
		ctx.beginPath();
		ctx.moveTo(plateRadius, 0);
		var i, xOffset, yOffset;
		for (i = 1; i < 6; i += 1) {
			xOffset = plateRadius * Math.cos(rad(60 * i));
			yOffset = plateRadius * Math.sin(rad(60 * i));
		
			ctx.lineTo(xOffset, yOffset);
		}
		ctx.closePath();
		ctx.fillStyle = plate.color;
		ctx.fill();
	}
	else {		
		ctx.beginPath();
		ctx.moveTo(-addRadius, 0);
		ctx.lineTo(addRadius, 0);
		ctx.lineWidth = addWidth;
		ctx.lineCap = "round";
		ctx.strokeStyle = colorB;
		ctx.stroke();
		
		ctx.beginPath();
		ctx.moveTo(0, -addRadius);
		ctx.lineTo(0, addRadius);
		ctx.lineWidth = addWidth;
		ctx.lineCap = "round";
		ctx.strokeStyle = colorB;
		ctx.stroke();
	}
	
	ctx.restore();
}

/*
 * Draws all hexagon plates and add symbols.
 * @param ctx Context to draw in.
 * @param flower Array of plates and their status.
 * @param colorA Primary color.
 * @param colorB Secondary Color.
 * @param offset Offset of the flower.
 */
function drawFlower(ctx, flower, colorB, offset) {
    'use strict';
    
    // UI Parameters
    var radiusCenter = 90;
    
	var i, xOffset, yOffset;
	for (i = 0; i < 6; i += 1) {
		xOffset = -radiusCenter * Math.cos(rad(60 * -i)) + offset;
		yOffset = radiusCenter * Math.sin(rad(60 * -i));
		
		drawPlate(ctx, flower[i], xOffset, yOffset, colorB, animations.startup.opacity[i].toFixed(3));
	}
}

/*
 * Draws the countdown in middle.
 * @param ctx Context to draw in.
 * @param minutesTotal Total number of minutes of a countdown.
 * @param minutesLeft Minutes left of a countdown.
 * @param colorA Primary color.
 * @param colorB Secondary Color.
 */
function drawCountdown(ctx, minutesTotal, minutesLeft, colorA, colorB) {
    'use strict';
    
    if (minutesTotal > 0) {
	    	
	    // UI Parameters
	    var circleRadius = 36;
	    var circleWidth = 8;
	    var textOffset = 11;
	    var textStyle = "bold 32px Arial";
	    
		ctx.save();

		ctx.font = textStyle;
		ctx.textAlign = "center";
		ctx.fillStyle = colorA;
		if (minutesLeft >= 60) {
			ctx.fillText(Math.floor(minutesLeft / 60) + "h", 0, textOffset);
		}
		else {
			ctx.fillText(minutesLeft + "m", 0, textOffset);
		}

		ctx.rotate(rad(-90));
		
		ctx.beginPath();
	  	ctx.arc(0, 0, circleRadius, 0, rad(360));
		ctx.lineWidth = circleWidth;
		ctx.strokeStyle = colorB;
		ctx.stroke();
		
		ctx.beginPath();
		ctx.arc(0, 0, circleRadius, 0, rad(360 * (minutesLeft / minutesTotal)));
		ctx.lineWidth = circleWidth;
		ctx.strokeStyle = colorA;
		ctx.stroke();
		
		ctx.restore();
    }
}

/*
 * Draws the flower overlay.
 * @param ctx Context to draw in.
 * @param colorDot Color of flower dots.
 */
function drawFlowerDots(ctx, colorDot) {
    'use strict';
    
	    // UI Parameters
	    var dotRadius = 4;
	    var dotOffset = 160;
	    
		ctx.save();

		ctx.rotate(rad(-90));
		
		var i;
		for (i = 0; i < 4; i += 1) {
			ctx.save();
			ctx.beginPath();
		  	ctx.arc(dotOffset, 0, dotRadius, 0, rad(360));
		  	ctx.globalAlpha = animations.dotTransition.opacity[i] * animations.dotFade.multiplier;
			ctx.fillStyle = colorDot;
			ctx.fill();
			ctx.restore();
			ctx.rotate(rad(90));
		}
		
		ctx.restore();
}

/*
 * Draws the whole UI.
 * @param ctx Context to draw in.
 */
function drawUI(ctx) {
    'use strict';

    // UI Parameters
    var colorDark = "#343434";
    var colorBright = "#007de4";
    var colorFlowerDots = "#ffffff";

	ctx.save();
	
    ctx.clearRect(0, 0, context.canvas.width, context.canvas.height);
    ctx.translate(animations.flowers.centerX, animations.flowers.centerY);
    
	drawFlower(ctx, flowers[flowerPrev(currentFlower)], colorDark, -360);
	drawFlower(ctx, flowers[currentFlower], colorDark, 0);
	drawFlower(ctx, flowers[flowerNext(currentFlower)], colorDark, 360);
    	
	drawCountdown(ctx, 0, 3, colorBright, colorDark);
	
	ctx.restore();

	ctx.save();
	
	ctx.translate(screenCenterX, screenCenterY);
	drawFlowerDots(ctx, colorFlowerDots);
	
	ctx.restore();
}

/*
 * Animates the fade-in when application starts.
 */
function animate_startup() {
    'use strict';

    // Animation Parameters
    var speedFadePlate = 500;
    
    animations.startup.active = true;
	
	if (animations.startup.opacity[0].toFixed(3) < 1) {
		animations.startup.opacity[0] = trans(animations.startup.opacity[0], "quad-down", 0, 1, speedFadePlate);
	}
	var i;
	for (i = 0; i < 5; i += 1) {
		if (animations.startup.opacity[i].toFixed(3) >= 0.5 && animations.startup.opacity[i + 1].toFixed(3) < 1) {
			animations.startup.opacity[i + 1] = trans(animations.startup.opacity[i + 1], "quad-down", 0, 1, speedFadePlate);
		}
	}
	
	var stop = true;
	for (i = 0; i < 6; i += 1) {
		stop = stop && (animations.startup.opacity[i].toFixed(3) >= 1);
	}
		
	if (!stop) {
		window.requestAnimationFrame(function() {
			animate_startup();
		});
	}
	else {
		animations.startup.active = false;
	}
}

/*
 * Animates the reset back to center of canvas.
 * @param oldX The old, unchanged X coord.
 * @param oldY The old, unchanged Y coord.
 */
function animate_flowers(oldX, oldY) {
    'use strict';

    // Animation Parameters
    var speedCenter = 200;

    animations.flowers.centerX = trans(animations.flowers.centerX, "quad-down", oldX, 180, speedCenter);
    animations.flowers.centerY = trans(animations.flowers.centerY, "quad-down", oldY, 180, speedCenter);
	
	if (animations.flowers.centerX.toFixed(3) == 180 && animations.flowers.centerY.toFixed(3) == 180) {
		animations.flowers.active = false;
	}
		
	if (animations.flowers.active) {
		window.requestAnimationFrame(function() {
			animate_flowers(oldX, oldY);
		});
	}
}

/*
 * Animates the flower dot fade when changing active flower.
 * @param curr Current flower at the time of animation start.
 */
function animate_dotTransition(curr) {
    'use strict';
    
	animations.dotTransition.active = true;

    // Animation Parameters
    var speedFade = 200;
    
    var newOpacity = [0.25, 0.25, 0.25, 0.25];
    newOpacity[curr] = 1;

    var i;
    for (i = 0; i < 4; i += 1) {
    	animations.dotTransition.opacity[i] = trans(animations.dotTransition.opacity[i], "quad-down", 0.25, newOpacity[i], speedFade);
    }
	
	if (animations.dotTransition.opacity[curr].toFixed(3) == 1 || curr != currentFlower) {
		animations.dotTransition.active = false;
	}
		
	if (animations.dotTransition.active) {
		window.requestAnimationFrame(function() {
			animate_dotTransition(curr);
		});
	}
}

/*
 * Animates the flower dot fade in.
 * @param ctx Context to draw in.
 * @param multiOld The old opacity.
 */
function animate_dotFadeIn(ctx, multiOld) {
    'use strict';
    
	animations.dotFade.activeIn = true;

    // Animation Parameters
    var speedFade = 200;
    
    animations.dotFade.multiplier = trans(animations.dotFade.multiplier, "quad-down", multiOld, 1, speedFade);
	
	if (animations.dotFade.multiplier.toFixed(3) == 1) {
		animations.dotFade.activeIn = false;
	}
		
	if (animations.dotFade.activeIn) {
		window.requestAnimationFrame(function() {
			animate_dotFadeIn(ctx, multiOld);
		});
	}
}

/*
 * Animates the flower dot fade out.
 * @param ctx Context to draw in.
 * @param multiOld The old opacity.
 */
function animate_dotFadeOut(ctx, multiOld) {
    'use strict';

    if (!isScreenTouched) {
    	animations.dotFade.activeOut = true;
		
		// Animation Parameters
		var speedFade = 200;
		
		animations.dotFade.multiplier = trans(animations.dotFade.multiplier, "quad-down", multiOld, 0, speedFade);
		
		if (animations.dotFade.multiplier.toFixed(3) == 0) {
			animations.dotFade.activeOut = false;
		}
			
		if (animations.dotFade.activeOut) {
			window.requestAnimationFrame(function() {
				animate_dotFadeOut(ctx, multiOld);
			});
		}
    }
}

/*
 * Animation loop.
 * @param ctx Context to draw in.
 * @param run Whether the loop should be updating the UI.
 */
function animation(ctx, run) {
    'use strict';
	
    if (run) {
    	drawUI(ctx);
    }
    
	run = animations.startup.active
	|| animations.flowers.active 
	|| animations.dotTransition.active
	|| animations.dotFade.activeIn
	|| animations.dotFade.activeOut;
    
	window.requestAnimationFrame(function() {
		animation(ctx, run);
	});
}

/*
 * Fired when application loads.
 */
window.onload = function onLoad() {
    'use strict';

    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    
    animation(context, false);
    animate_startup();
};

(function(tau) {
    'use strict';
    document.addEventListener("pagebeforeshow", function() {
    	tau.event.enableGesture(document, new tau.event.gesture.Drag({
    	}));

    	document.addEventListener("touchstart", function() {
    		isScreenTouched = true;
    		
    		animations.flowers.active = false;
    		dragLastX = 0;
    		dragLastY = 0;
    	});

    	document.addEventListener("drag", function(e) {
    		window.clearTimeout(animations.dotFade.reference);
    		animate_dotFadeIn(context, animations.dotFade.multiplier);
	    	
    		var dragX = e.detail.deltaX;
    		var dragY = e.detail.deltaY;
    		animations.flowers.centerX += dragX - dragLastX;
    		animations.flowers.centerY += dragY - dragLastY;
    		drawUI(context);
    		dragLastX = dragX;
    		dragLastY = dragY;
    	});

    	document.addEventListener("touchend", function() {
    		isScreenTouched = false;
    		
    		animations.flowers.active = true;
    	    if (animations.flowers.centerX <= 0) {
    	    	currentFlower = flowerNext(currentFlower);
    	    	animations.flowers.centerXold += 360;
    			animations.flowers.centerX += 360;
    			animate_flowers(animations.flowers.centerX, animations.flowers.centerY);
        		animate_dotTransition(currentFlower);
    	    }
    	    else if (animations.flowers.centerX >= 360) {
    	    	currentFlower = flowerPrev(currentFlower);
    	    	animations.flowers.centerXold -= 360;
    			animations.flowers.centerX -= 360;
    			animate_flowers(animations.flowers.centerX, animations.flowers.centerY);
        		animate_dotTransition(currentFlower);
    	    }
    	    else {
    	    	animate_flowers(animations.flowers.centerX, animations.flowers.centerY);
        		animate_dotTransition(currentFlower);
    	    }
    		
    	    animations.dotFade.reference = window.setTimeout(function() {
    	    	animate_dotFadeOut(context, animations.dotFade.multiplier);
			}, 2000);
    	});
    });
}(tau));
