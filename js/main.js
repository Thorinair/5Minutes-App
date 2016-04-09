/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global window, document, tizen, console, setTimeout, tau */

var canvas, context;
var platesList = [true, true, true, true, true, true];

var screenX = 180;
var screenY = 180;
var dragLastX = 0;
var dragLastY = 0;

var fps = 60;

var animStartup;
var animStartupFlag = false;

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
    
    if (value.toFixed(3) >= end) {
    	value = end;
    }
    else {
    	var steps = (duration / 1000) * fps; 
    	var x, y;
    	
    	if (value.toFixed(3) < start) {
    		value = start;
    	}
    	
    	switch (type) {
    	
    		// linear - Regular linear transition.
    		case "linear":
        		value += (end - start) / steps;
        		break;
        		
            // quad-down - Transition using quadratic equation. Slow-down.
    		case "quad-down":
        		y = (value.toFixed(3) - start) / (end - start) - 1;
        		x = -Math.pow(-sign(end - start) * y, 1/2) + 1 / steps; 
        		value = -sign(end - start) * Math.pow(x, 2) + 1 + start;
        		break;
        		
            // quad-up - Transition using quadratic equation. Speed-up.
    		case "quad-up":
        		y = (value.toFixed(4) - start) / (end - start);
        		x = Math.pow(sign(end - start) * y, 1/2) + 1 / steps;  
        		value = sign(end - start) * Math.pow(x, 2) + start;
        		break;

            // cube-down - Transition using cubic equation. Slow-down.
    		case "cube-down":
        		y = (value.toFixed(3) - start) / (end - start) - 1;
        		x = -Math.pow(-sign(end - start) * y, 1/3) + 1 / steps; 
        		value = sign(end - start) * Math.pow(x, 3) + 1 + start;
        		break;
        		
        	// cube-up - Transition using cubic equation. Speed-up.
    		case "cube-up":
        		y = (value.toFixed(6) - start) / (end - start);
        		x = Math.pow(sign(end - start) * y, 1/3) + 1 / steps;  
        		value = sign(end - start) * Math.pow(x, 3) + start;
        		break;        		
    	}
    }
    
    return value;
}

/*
 * Draws a single hexagon plate or add symbol.
 * @param ctx Context to draw in.
 * @param use Whether to draw a plate or add symbol.
 * @param x X position of a plate.
 * @param y Y position of a plate.
 * @param colorA Primary color, used for plates.
 * @param colorB Secondary color, used for add symbols.
 * @param opacity Opacity of a plate or add symbol.
 */
function drawPlate(ctx, use, x, y, colorA, colorB, opacity) {
    'use strict';
    
    // UI Parameters
    var plateRadius = 48;
    var addRadius = 24;
    var addWidth = 6;
    
	ctx.save();
	
	ctx.translate(x,y);
	ctx.globalAlpha = opacity;
	
	if (use) {
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
		ctx.fillStyle = colorA;
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
 * @param plates Array of plates and their status.
 * @param colorA Primary color.
 * @param colorB Secondary Color.
 */
function drawPlates(ctx, plates, colorA, colorB) {
    'use strict';
    
    // UI Parameters
    var radiusCenter = 90;
    
	var i, xOffset, yOffset;
	for (i = 0; i < 6; i += 1) {
		xOffset = -radiusCenter * Math.cos(rad(60 * -i));
		yOffset = radiusCenter * Math.sin(rad(60 * -i));
		
		drawPlate(ctx, plates[i], xOffset, yOffset, colorA, colorB, animStartup[i].toFixed(3));
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
 * Draws the whole UI.
 * @param ctx Context to draw in.
 */
function drawUI(ctx) {
    'use strict';

    // UI Parameters
    var colorBright = "#007de4";
    var colorDark = "#343434";

	ctx.save();
	
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.translate(screenX, screenY);
    
	drawPlates(ctx, platesList, colorBright, colorDark);
	drawCountdown(ctx, 0, 3, colorBright, colorDark);
	
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
 * Animation loop.
 * @param ctx Context to draw in.
 */
function animation(ctx) {
    'use strict';
    
	var run = animStartupFlag;
	
    if (run) {
    	drawUI(ctx);
    }
    
	window.requestAnimationFrame(function() {
		animation(ctx);
	});
}

/*
 * Fired when application loads.
 */
window.onload = function onLoad() {
    'use strict';

    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    
    animation(context);
    animateStartup(context);
};

(function(tau) {
    'use strict';
    document.addEventListener("pagebeforeshow", function() {
    	tau.event.enableGesture(document, new tau.event.gesture.Drag({
    	}));

    	document.addEventListener("dragstart", function(e) {
    		dragLastX = 0;
    		dragLastY = 0;
    	});

    	document.addEventListener("drag", function(e) {
    		var dragX = e.detail.deltaX;
    		var dragY = e.detail.deltaY;
    		screenX += dragX - dragLastX;
    		screenY += dragY - dragLastY;
    		drawUI(context);
    		dragLastX = dragX;
    		dragLastY = dragY;
    	});

    	document.addEventListener("dragend", function(e) {
    	});
    });
}(tau));
