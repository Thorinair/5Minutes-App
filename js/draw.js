/*global window, document, tizen, console, setTimeout, tau, animations, screens, colors, addPlate, colorID, util */

var draw = function(){
    'use strict';
    };

/*
 * Draws a single hexagon plate or add symbol.
 * @param ctx Context to draw in.
 * @param plate Plate to draw.
 * @param x X position of a plate.
 * @param y Y position of a plate.
 * @param radius Radius of a plate.
 * @param stroke Whether to draw stroke of the plate.
 * @param colorB Secondary color, used for add symbols.
 * @param opacity Opacity of a plate or add symbol.
 */
draw.plate = function(ctx, plate, x, y, radius, stroke, colorB, opacity) {
    'use strict';
    
    // UI Parameters
    var addRadius = 24;
    var addWidth = 6;
    
	ctx.save();
	
	ctx.translate(x,y);
	ctx.globalAlpha = opacity;
	
	if (plate) {
		ctx.rotate(util.rad(-90));
		
		ctx.beginPath();
		ctx.moveTo(radius, 0);
		var i, xOffset, yOffset;
		for (i = 1; i < 6; i += 1) {
			xOffset = radius * Math.cos(util.rad(60 * i));
			yOffset = radius * Math.sin(util.rad(60 * i));
		
			ctx.lineTo(xOffset, yOffset);
		}
		ctx.closePath();
		ctx.fillStyle = plate.color;
		ctx.fill();
		if (stroke) {
			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 3;
			ctx.stroke();
		}
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
};

/*
 * Draws all hexagon plates and add symbols.
 * @param ctx Context to draw in.
 * @param flower Array of plates and their status.
 * @param colorA Primary color.
 * @param colorB Secondary Color.
 * @param offset Offset of the flower.
 * @param opacity List of opacities.
 */
draw.flower = function(ctx, flower, colorB, offset, opacity) {
    'use strict';
    
    // UI Parameters
    var radiusCenter = 90;
    var radiusPlate = radiusCenter * (8/15);
    
	var i, xOffset, yOffset;
	for (i = 0; i < 6; i += 1) {
		xOffset = -radiusCenter * Math.cos(util.rad(60 * -i)) + offset;
		yOffset = radiusCenter * Math.sin(util.rad(60 * -i));
		
		draw.plate(ctx, flower[i], xOffset, yOffset, radiusPlate, false, colorB, opacity[i].toFixed(3) * animations.screens.multiplier[screens.flowers]);
	}
};

/*
 * Draws the countdown in middle.
 * @param ctx Context to draw in.
 * @param minutesTotal Total number of minutes of a countdown.
 * @param minutesLeft Minutes left of a countdown.
 * @param colorA Primary color.
 * @param colorB Secondary Color.
 */
draw.countdown = function(ctx, minutesTotal, minutesLeft, colorA, colorB) {
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

		ctx.rotate(util.rad(-90));
		
		ctx.beginPath();
	  	ctx.arc(0, 0, circleRadius, 0, util.rad(360));
		ctx.lineWidth = circleWidth;
		ctx.strokeStyle = colorB;
		ctx.stroke();
		
		ctx.beginPath();
		ctx.arc(0, 0, circleRadius, 0, util.rad(360 * (minutesLeft / minutesTotal)));
		ctx.lineWidth = circleWidth;
		ctx.strokeStyle = colorA;
		ctx.stroke();
		
		ctx.restore();
    }
};

/*
 * Draws the flower overlay.
 * @param ctx Context to draw in.
 */
draw.dots = function(ctx) {
    'use strict';
    
    // UI Parameters
    var dotRadius = 4;
    var dotOffset = 160;
    
	ctx.save();

	ctx.rotate(util.rad(-90));
	
	var i;
	for (i = 0; i < 4; i += 1) {
		ctx.save();
		ctx.beginPath();
	  	ctx.arc(dotOffset, 0, dotRadius, 0, util.rad(360));
	  	ctx.globalAlpha = animations.dotTransition.opacity[i] * animations.dotFade.multiplier * animations.screens.multiplier[screens.flowers];
		ctx.fillStyle = "#ffffff";
		ctx.fill();
		ctx.restore();
		ctx.rotate(util.rad(90));
	}
	
	ctx.restore();
};

/*
 * Draws text when adding color.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.colorText = function(ctx, opacity) {
    'use strict';  
	ctx.save();

	if (addPlate.color != null) {
		ctx.globalAlpha = opacity;
	}
	else {
		ctx.globalAlpha = opacity * 0.25;
	}
	ctx.beginPath();
	ctx.moveTo(-50, 120);
	ctx.lineTo(50, 120);
	ctx.lineTo(70, 140);
	ctx.lineTo(50, 160);
	ctx.lineTo(-50, 160);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();
	
	ctx.restore();
	
	ctx.save();

	ctx.globalAlpha = opacity;
	ctx.textAlign = "center";
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Add Shortcut", 0, -120);

	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Color: " + util.translateColor(addPlate.color), 0, -75);
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Next", 0, 150);
	
	ctx.restore();
};

/*
 * Draws all hexagon plates on the color grid.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.colorGrid = function(ctx, opacity) {
    'use strict';

    var radiusCenter = 60;
    var radiusPlate = radiusCenter * (8/15);
    var xOffset;
    var yOffset;
    
    var stroke = [false, false, false, false, false, false, false, false, false, false, false, false, false];
    if (addPlate.color != null) {
    	stroke[addPlate.color] = true;
    }
    
	xOffset = -radiusCenter * Math.cos(util.rad(60 * -1));
	yOffset = radiusCenter * Math.sin(util.rad(60 * -1)) + 20;
	draw.plate(ctx, colorID[0], xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[0], null, opacity);
	draw.plate(ctx, colorID[1], xOffset, yOffset, radiusPlate, stroke[1], null, opacity);
	draw.plate(ctx, colorID[2], xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[2], null, opacity);
	draw.plate(ctx, colorID[3], xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[3], null, opacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0)) + 20;
	draw.plate(ctx, colorID[4], xOffset + radiusCenter * 3, yOffset, radiusPlate, stroke[4], null, opacity);
	draw.plate(ctx, colorID[5], xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[5], null, opacity);
	draw.plate(ctx, colorID[6], xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[6], null, opacity);
	draw.plate(ctx, colorID[7], xOffset, yOffset, radiusPlate, stroke[7], null, opacity);
	draw.plate(ctx, colorID[8], xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[8], null, opacity);
	
	xOffset = -radiusCenter * Math.cos(util.rad(60 * 1));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 1)) + 20;
	draw.plate(ctx, colorID[9], xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[9], null, opacity);
	draw.plate(ctx, colorID[10], xOffset, yOffset, radiusPlate, stroke[10], null, opacity);
	draw.plate(ctx, colorID[11], xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[11], null, opacity);
	draw.plate(ctx, colorID[12], xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[12], null, opacity);
};