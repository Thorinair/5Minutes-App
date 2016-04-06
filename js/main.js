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

/*global window, document, tizen, console, setTimeout */

var canvas, context;
var platesList = [true, true, true, false, false, true];

var fps = 1000 / 60;

var animStartup;
var animStartupFlag = false;

window.requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
	    'use strict';
	    window.setTimeout(callback, fps);
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
    	var frame = (duration / 1000) * fps; 
    	
    	if (value.toFixed(3) < start) {
    		value = start;
    	}
    	
    	// linear - Regular linear transition.
    	if (type === "linear") {
    		var step = (end - start) /  frame;
    		value += step;
    		
    		//console.log("Trans linear: " + value.toFixed(3));
    	}
    	
    	// quad - Transition using quadratic equation.
    	if (type === "quad") {
    		var lastFrame = sign(end - start) 
    			* Math.pow((value.toFixed(3) - start) / (end - start), 1/2);
    		var newFrame = lastFrame + frame;
    		
    		value += sign(end - start) 
				* Math.pow(newFrame * (newFrame / duration), 2) + start;
    		
    		console.log("Trans quad: " + value.toFixed(3));
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
		
		drawPlate(ctx, plates[i], xOffset, yOffset, colorA, colorB, animStartup[i].toFixed(1));
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
    context.translate(180, 180);
    
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
	
	if (animStartup[0].toFixed(1) < 0.5) {
		animStartup[0] = trans(animStartup[0], "quad", 0, 1, speedFadePlate);
	}
	else if (animStartup[1].toFixed(1) < 0.5) {
		animStartup[0] = trans(animStartup[0], "quad", 0, 1, speedFadePlate);
		animStartup[1] = trans(animStartup[1], "linear", 0, 1, speedFadePlate);
	}
	else if (animStartup[2].toFixed(1) < 0.5) {
		animStartup[1] = trans(animStartup[1], "linear", 0, 1, speedFadePlate);
		animStartup[2] = trans(animStartup[2], "linear", 0, 1, speedFadePlate);
	}
	else if (animStartup[3].toFixed(1) < 0.5) {
		animStartup[2] = trans(animStartup[2], "linear", 0, 1, speedFadePlate);
		animStartup[3] = trans(animStartup[3], "linear", 0, 1, speedFadePlate);
	}
	else if (animStartup[4].toFixed(1) < 0.5) {
		animStartup[3] = trans(animStartup[3], "linear", 0, 1, speedFadePlate);
		animStartup[4] = trans(animStartup[4], "linear", 0, 1, speedFadePlate);
	}
	else if (animStartup[5].toFixed(1) < 0.5) {
		animStartup[4] = trans(animStartup[4], "linear", 0, 1, speedFadePlate);
		animStartup[5] = trans(animStartup[5], "linear", 0, 1, speedFadePlate);
	}
	else if (animStartup[5].toFixed(1) < 1) {
		animStartup[5] = trans(animStartup[5], "linear", 0, 1, speedFadePlate);
	}
	
	var stop = true;
	
	var i;
	for (i = 0; i < 6; i += 1) {
		stop = stop && (animStartup[i].toFixed(1) >= 1);
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
