/*global window, document, tizen, console, setTimeout, tau */

var canvas, context;
var currentFlower = 0;
var platesList = {
		"flower0": [
		           {"type": "coffee", "color": "#007de4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           {"type": "coffee", "color": "#007de4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           {"type": "coffee", "color": "#007de4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           null,
		           null,
		           {"type": "coffee", "color": "#007de4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]}
		           ],  
   		"flower1": [
		           {"type": "coffee", "color": "#e4007d", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           {"type": "coffee", "color": "#e4007d", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           null,
		           {"type": "coffee", "color": "#e4007d", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           {"type": "coffee", "color": "#e4007d", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           null
 		           ], 
 		"flower2": [
		           null,
		           {"type": "coffee", "color": "#7d00e4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           null,
		           {"type": "coffee", "color": "#7d00e4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           null,
		           {"type": "coffee", "color": "#7d00e4", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]}
		           ],
		"flower3": [
		           {"type": "coffee", "color": "#e47d00", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           null,
		           null,
		           {"type": "coffee", "color": "#e47d00", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           {"type": "coffee", "color": "#e47d00", "duration": 5, "message": "Coffee in 5 minutes.", "invite": [345435, 356345, 346345]},
		           null
		           ]
};

var flowerCenterX = 180;
var flowerCenterY = 180;
var flowerCenterXold = 0;
var flowerCenterYold = 0;
var dragLastX = 0;
var dragLastY = 0;

var flowerDotOpacity = [1.0, 0.25, 0.25, 0.25];
var flowerDotOpacityOld = [0.25, 0.25, 0.25, 0.25];
var flowerDotOpacityMulti = 0;
var flowerDotOpacityFadeOut;

var animStartup;
var animStartupFlag = false;
var animCenterResetFlag = false;
var animFlowerDotsTransition = false;
var animFlowerDotsFadeOut = false;
var animFlowerDotsFadeIn = false;

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
		
		drawPlate(ctx, flower[i], xOffset, yOffset, colorB, animStartup[i].toFixed(3));
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
		  	ctx.globalAlpha = flowerDotOpacity[i] * flowerDotOpacityMulti;
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
    ctx.translate(flowerCenterX, flowerCenterY);
    
    if (currentFlower == 0) {
    	drawFlower(ctx, platesList.flower3, colorDark, -360);
    	drawFlower(ctx, platesList.flower0, colorDark, 0);
    	drawFlower(ctx, platesList.flower1, colorDark, 360);
    }
    else if (currentFlower == 1) {
    	drawFlower(ctx, platesList.flower0, colorDark, -360);
    	drawFlower(ctx, platesList.flower1, colorDark, 0);
    	drawFlower(ctx, platesList.flower2, colorDark, 360);
    }
    else if (currentFlower == 2) {
    	drawFlower(ctx, platesList.flower1, colorDark, -360);
    	drawFlower(ctx, platesList.flower2, colorDark, 0);
    	drawFlower(ctx, platesList.flower3, colorDark, 360);
    }
    else if (currentFlower == 3) {
    	drawFlower(ctx, platesList.flower2, colorDark, -360);
    	drawFlower(ctx, platesList.flower3, colorDark, 0);
    	drawFlower(ctx, platesList.flower0, colorDark, 360);
    }
	drawCountdown(ctx, 0, 3, colorBright, colorDark);
	
	ctx.restore();

	ctx.save();
	
	ctx.translate(screenCenterX, screenCenterY);
	drawFlowerDots(ctx, colorFlowerDots);
	
	ctx.restore();
}

/*
 * Animates the fade-in when application starts.
 * @param ctx Context to draw in.
 */
function animateStartup(ctx) {
    'use strict';

    // Animation Parameters
    var speedFadePlate = 500;
    
    if (!animStartupFlag) {
    	animStartup = [0, 0, 0, 0, 0, 0];
    }
    animStartupFlag = true;
	
	if (animStartup[0].toFixed(3) < 1) {
		animStartup[0] = trans(animStartup[0], "quad-down", 0, 1, speedFadePlate);
	}
	var i;
	for (i = 0; i < 5; i += 1) {
		if (animStartup[i].toFixed(3) >= 0.5 && animStartup[i + 1].toFixed(3) < 1) {
			animStartup[i + 1] = trans(animStartup[i + 1], "quad-down", 0, 1, speedFadePlate);
		}
	}
	
	var stop = true;
	for (i = 0; i < 6; i += 1) {
		stop = stop && (animStartup[i].toFixed(3) >= 1);
	}
		
	if (!stop) {
		window.requestAnimationFrame(function() {
			animateStartup(ctx);
		});
	}
	else {
		animStartupFlag = false;
	}
}

/*
 * Animates the reset back to center of canvas.
 * @param ctx Context to draw in.
 * @param direction Direction to move to (-1, 0 or 1).
 */
function animateResetCenter(ctx) {
    'use strict';

    // Animation Parameters
    var speedCenter = 200;

	flowerCenterX = trans(flowerCenterX, "quad-down", flowerCenterXold, 180, speedCenter);
	flowerCenterY = trans(flowerCenterY, "quad-down", flowerCenterYold, 180, speedCenter);
	
	if (flowerCenterX.toFixed(3) == 180 && flowerCenterY.toFixed(3) == 180) {
		animCenterResetFlag = false;
	}
		
	if (animCenterResetFlag) {
		window.requestAnimationFrame(function() {
			animateResetCenter(ctx);
		});
	}
}

/*
 * Animates the flower dot fade when changing active flower.
 * @param ctx Context to draw in.
 * @param direction Direction to move to (-1, 0 or 1).
 * @param curr Current flower at the time of animation start.
 */
function animateTransitionFlowerDots(ctx, direction, curr) {
    'use strict';
    
	animFlowerDotsTransition = true;

    // Animation Parameters
    var speedFade = 200;
    
    var newFlowerOpacity = [0.25, 0.25, 0.25, 0.25];
    newFlowerOpacity[curr] = 1;

    var i;
    for (i = 0; i < 4; i += 1) {
    	flowerDotOpacity[i] = trans(flowerDotOpacity[i], "quad-down", flowerDotOpacityOld[i], newFlowerOpacity[i], speedFade);
    }
	
	if (flowerDotOpacity[curr].toFixed(3) == 1 || curr != currentFlower) {
		animFlowerDotsTransition = false;
	}
		
	if (animFlowerDotsTransition) {
		window.requestAnimationFrame(function() {
			animateTransitionFlowerDots(ctx, direction, curr);
		});
	}
}

/*
 * Animates the flower dot fade out.
 * @param ctx Context to draw in.
 * @param opacityOld The old opacity.
 */
function animateFadeOutFlowerDots(ctx, opacityOld) {
    'use strict';

    if (!isScreenTouched) {
		animFlowerDotsFadeOut = true;
		
		// Animation Parameters
		var speedFade = 200;
		
		flowerDotOpacityMulti = trans(flowerDotOpacityMulti, "quad-down", opacityOld, 0, speedFade);
		
		if (flowerDotOpacityMulti.toFixed(3) == 0) {
			animFlowerDotsFadeOut = false;
		}
			
		if (animFlowerDotsFadeOut) {
			window.requestAnimationFrame(function() {
				animateFadeOutFlowerDots(ctx, opacityOld);
			});
		}
    }
}

/*
 * Animates the flower dot fade in.
 * @param ctx Context to draw in.
 * @param opacityOld The old opacity.
 */
function animateFadeInFlowerDots(ctx, opacityOld) {
    'use strict';
    
	animFlowerDotsFadeIn = true;

    // Animation Parameters
    var speedFade = 200;
    
	flowerDotOpacityMulti = trans(flowerDotOpacityMulti, "quad-down", opacityOld, 1, speedFade);
	
	if (flowerDotOpacityMulti.toFixed(3) == 1) {
		animFlowerDotsFadeIn = false;
	}
		
	if (animFlowerDotsFadeIn) {
		window.requestAnimationFrame(function() {
			animateFadeInFlowerDots(ctx, opacityOld);
		});
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
    
	run = animStartupFlag 
	|| animCenterResetFlag 
	|| animFlowerDotsTransition
	|| animFlowerDotsFadeOut
	|| animFlowerDotsFadeIn;
    
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
    animateStartup(context);
};

(function(tau) {
    'use strict';
    document.addEventListener("pagebeforeshow", function() {
    	tau.event.enableGesture(document, new tau.event.gesture.Drag({
    	}));

    	document.addEventListener("touchstart", function() {
    		isScreenTouched = true;
    		
    	    animCenterResetFlag = false;
    		dragLastX = 0;
    		dragLastY = 0;
    	});

    	document.addEventListener("drag", function(e) {
    		window.clearTimeout(flowerDotOpacityFadeOut);
	    	animateFadeInFlowerDots(context, flowerDotOpacityMulti);
	    	
    		var dragX = e.detail.deltaX;
    		var dragY = e.detail.deltaY;
    		flowerCenterX += dragX - dragLastX;
    		flowerCenterY += dragY - dragLastY;
    		drawUI(context);
    		dragLastX = dragX;
    		dragLastY = dragY;
    	});

    	document.addEventListener("touchend", function() {
    		isScreenTouched = false;
    		
    		flowerCenterXold = flowerCenterX;
    		flowerCenterYold = flowerCenterY;
    	    animCenterResetFlag = true;
    	    if (flowerCenterX <= 0) {
    			currentFlower += 1;
    			if (currentFlower >= 4) {
    				currentFlower = 0;
    			}
    			flowerCenterXold += 360;
    			flowerCenterX += 360;
    	    	animateResetCenter(context);
        		animateTransitionFlowerDots(context, 0, currentFlower);
    	    }
    	    else if (flowerCenterX >= 360) {
    			currentFlower -= 1;
    			if (currentFlower <= -1) {
    				currentFlower = 3;
    			}
    			flowerCenterXold -= 360;
    			flowerCenterX -= 360;
    	    	animateResetCenter(context);
        		animateTransitionFlowerDots(context, 0, currentFlower);
    	    }
    	    else {
    	    	animateResetCenter(context);
        		animateTransitionFlowerDots(context, 0, currentFlower);
    	    }
    		
    	    flowerDotOpacityFadeOut = window.setTimeout(function() {
    			animateFadeOutFlowerDots(context, flowerDotOpacityMulti);
			}, 2000);
    	});
    });
}(tau));
