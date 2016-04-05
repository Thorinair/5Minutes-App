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

var animStartup = [0, 0, 0, 0, 0, 0];
var animStartupFlag = false;

window.requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
	    'use strict';
	    window.setTimeout(callback, 1000 / 60);
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
    var speedFadePerPlate = 0.1;
    
    animStartupFlag = true;
	
	if (animStartup[0].toFixed(1) < 0.5) {
		animStartup[0] += speedFadePerPlate;
	}
	else if (animStartup[1].toFixed(1) < 0.5) {
		animStartup[0] += speedFadePerPlate;
		animStartup[1] += speedFadePerPlate;
	}
	else if (animStartup[2].toFixed(1) < 0.5) {
		animStartup[1] += speedFadePerPlate;
		animStartup[2] += speedFadePerPlate;
	}
	else if (animStartup[3].toFixed(1) < 0.5) {
		animStartup[2] += speedFadePerPlate;
		animStartup[3] += speedFadePerPlate;
	}
	else if (animStartup[4].toFixed(1) < 0.5) {
		animStartup[3] += speedFadePerPlate;
		animStartup[4] += speedFadePerPlate;
	}
	else if (animStartup[5].toFixed(1) < 0.5) {
		animStartup[4] += speedFadePerPlate;
		animStartup[5] += speedFadePerPlate;
	}
	else if (animStartup[5].toFixed(1) < 1) {
		animStartup[5] += speedFadePerPlate;
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
