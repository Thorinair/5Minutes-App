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

var canvas, context, clockRadius, isAmbientMode;
var platesList = [true, true, true, false, false, true]; 

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
 * @param colorA Primary color.
 * @param colorB Secondary Color.
 */
function drawPlate(ctx, use, x, y, colorA, colorB) {
    'use strict';
    
    // UI Parameters
    var plateRadius = 48;
    var addRadius = 24;
    var addWidth = 6;
    
	ctx.save();
	
	ctx.translate(x,y);
	
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
		
		drawPlate(ctx, plates[i], xOffset, yOffset, colorA, colorB);
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

	drawPlates(ctx, platesList, colorBright, colorDark);
	drawCountdown(ctx, 5, 3, colorBright, colorDark);
}

/*
 * Fired when application loads.
 */
window.onload = function onLoad() {
    'use strict';

    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    context.translate(180, 180);
    
    drawUI(context);
};
