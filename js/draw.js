/*global window, document, tizen, console, setTimeout, tau, animations, screens, colors, addPlate, colors, types, contacts, util */

var draw = function(){
    'use strict';
    };

/*
 * Draws a single hexagon plate or add symbol.
 * @param ctx Context to draw in.
 * @param use Whether a plate or an add symbol should be drawn.
 * @param color Color of the plate to draw.
 * @param type Type of the plate to draw.
 * @param x X position of a plate.
 * @param y Y position of a plate.
 * @param radius Radius of a plate.
 * @param stroke Whether to draw stroke of the plate.
 * @param colorB Secondary color, used for add symbols.
 * @param opacity Opacity of a plate or add symbol.
 */
draw.plate = function(ctx, use, color, type, x, y, radius, stroke, colorB, opacity) {
    'use strict';
    
    // UI Parameters
    var addRadius = 24;
    var addWidth = 6;
    var iconSize = 56;
    
	ctx.save();
	
	ctx.translate(x,y);
	ctx.globalAlpha = opacity;
	
	if (use) {
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
		ctx.fillStyle = color;
		ctx.fill();
		if (stroke) {
			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 3;
			ctx.stroke();
		}
		if (type != null) {
			ctx.restore();
			ctx.save();
			
			ctx.translate(x,y);	
			ctx.globalAlpha = opacity;	
			var image = document.getElementById("icon_" + type);
			var modifier = (radius / 48);
			ctx.drawImage(image, -(iconSize/2) * modifier, -(iconSize/2) * modifier, iconSize * modifier, iconSize * modifier);
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
		
		if (flower[i] != null) {
			draw.plate(ctx, true, flower[i].color, flower[i].type, xOffset, yOffset, radiusPlate, false, colorB, opacity[i].toFixed(3) * animations.screens.multiplier[screens.flowers]);
		}
		else {
			draw.plate(ctx, false, null, null, xOffset, yOffset, radiusPlate, false, colorB, opacity[i].toFixed(3) * animations.screens.multiplier[screens.flowers]);
		}
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
 * Draws text when editing a plate.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.editText = function(ctx, opacity) {
    'use strict';  
	ctx.save();

	ctx.globalAlpha = opacity;
	
	ctx.beginPath();
	ctx.moveTo(-80, -53);
	ctx.lineTo(80, -53);
	ctx.lineTo(80, 5);
	ctx.lineTo(-80, 5);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();

	ctx.beginPath();
	ctx.moveTo(-80, 15);
	ctx.lineTo(80, 15);
	ctx.lineTo(80, 73);
	ctx.lineTo(-80, 73);
	ctx.fillStyle = "#ff0000";
	ctx.closePath();
	ctx.fill();

	ctx.globalAlpha = opacity;
	ctx.textAlign = "center";
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Edit Shortcut", 0, -120);
	
	ctx.font = "48px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Edit", 0, -7);
	
	ctx.font = "48px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Delete", 0, 61);
	
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
	ctx.fillText(addPlate.title + " Shortcut", 0, -120);

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
	draw.plate(ctx, true, colors[0].val, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[0], null, opacity);
	draw.plate(ctx, true, colors[1].val, null, xOffset, yOffset, radiusPlate, stroke[1], null, opacity);
	draw.plate(ctx, true, colors[2].val, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[2], null, opacity);
	draw.plate(ctx, true, colors[3].val, null, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[3], null, opacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0)) + 20;
	draw.plate(ctx, true, colors[4].val, null, xOffset + radiusCenter * 3, yOffset, radiusPlate, stroke[4], null, opacity);
	draw.plate(ctx, true, colors[5].val, null, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[5], null, opacity);
	draw.plate(ctx, true, colors[6].val, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[6], null, opacity);
	draw.plate(ctx, true, colors[7].val, null, xOffset, yOffset, radiusPlate, stroke[7], null, opacity);
	draw.plate(ctx, true, colors[8].val, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[8], null, opacity);
	
	xOffset = -radiusCenter * Math.cos(util.rad(60 * 1));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 1)) + 20;
	draw.plate(ctx, true, colors[9].val, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[9], null, opacity);
	draw.plate(ctx, true, colors[10].val, null, xOffset, yOffset, radiusPlate, stroke[10], null, opacity);
	draw.plate(ctx, true, colors[11].val, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[11], null, opacity);
	draw.plate(ctx, true, colors[12].val, null, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[12], null, opacity);
};

/*
 * Draws text when adding type.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.typeText = function(ctx, opacity) {
    'use strict';  
	ctx.save();

	if (addPlate.type != null) {
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
	ctx.fillText(addPlate.title + " Shortcut", 0, -120);

	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Type: " + util.translateType(addPlate.type), 0, -75);
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Next", 0, 150);
	
	ctx.restore();
};

/*
 * Draws all hexagon plates on the type grid.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.typeGrid = function(ctx, opacity) {
    'use strict';

    var radiusCenter = 60;
    var radiusPlate = radiusCenter * (8/15);
    var xOffset;
    var yOffset;
    
    var stroke = [false, false, false, false, false, false, false, false, false, false, false, false, false];
    if (addPlate.type != null) {
    	stroke[addPlate.type] = true;
    }
    
	xOffset = -radiusCenter * Math.cos(util.rad(60 * -1));
	yOffset = radiusCenter * Math.sin(util.rad(60 * -1)) + 20;
	draw.plate(ctx, true, colors[addPlate.color].val, types[0].val, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[0], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[1].val, xOffset, yOffset, radiusPlate, stroke[1], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[2].val, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[2], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[3].val, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[3], null, opacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0)) + 20;
	draw.plate(ctx, true, colors[addPlate.color].val, types[4].val, xOffset + radiusCenter * 3, yOffset, radiusPlate, stroke[4], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[5].val, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[5], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[6].val, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[6], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[7].val, xOffset, yOffset, radiusPlate, stroke[7], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[8].val, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[8], null, opacity);
	
	xOffset = -radiusCenter * Math.cos(util.rad(60 * 1));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 1)) + 20;
	draw.plate(ctx, true, colors[addPlate.color].val, types[9].val, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[9], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[10].val, xOffset, yOffset, radiusPlate, stroke[10], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[11].val, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[11], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[12].val, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[12], null, opacity);
};

/*
 * Draws text when adding duration.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.durationText = function(ctx, opacity) {
    'use strict';  
	ctx.save();

	ctx.globalAlpha = opacity;
	
	ctx.beginPath();
	ctx.moveTo(-50, 120);
	ctx.lineTo(50, 120);
	ctx.lineTo(70, 140);
	ctx.lineTo(50, 160);
	ctx.lineTo(-50, 160);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(-15, 10);
	ctx.lineTo(15, 10);
	ctx.lineTo(0, 25);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(-15, -34);
	ctx.lineTo(15, -34);
	ctx.lineTo(0, -49);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();

	ctx.globalAlpha = opacity;
	ctx.textAlign = "center";
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(addPlate.title + " Shortcut", 0, -120);

	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Duration:", 0, -75);

	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(util.translateType(addPlate.type) + " in " + addPlate.duration + " minutes.", 0, 0);
	

	ctx.font = "24px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Hint: Drag screen or turn", 0, 70);
	ctx.fillText("bezel to adjust time.", 0, 98);
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Next", 0, 150);
	
	ctx.restore();
};

/*
 * Draws text when adding contacts.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.contactsText = function(ctx, opacity) {
    'use strict';  
	ctx.save();

	var contactExists = false;
	var i;
	for (i = 0; i < contacts.length; i += 1) {
		contactExists = contactExists || contacts[i].sel;
	}
	if (contactExists) {
		ctx.globalAlpha = opacity;
	}
	else {
		ctx.globalAlpha = opacity * 0.25;
	}
	ctx.beginPath();
	ctx.moveTo(-50, 120);
	ctx.lineTo(50, 120);
	ctx.lineTo(50, 160);
	ctx.lineTo(-50, 160);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();

	ctx.globalAlpha = opacity;
	ctx.textAlign = "center";
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(addPlate.title + " Shortcut", 0, -120);
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Save", 0, 150);
	
	ctx.restore();
};

/*
 * Draws list when adding contacts.
 * @param ctx Context to draw in.
 * @param offset Offset of the list.
 * @param opacity Opacity to use when drawing.
 */
draw.contactsList = function(ctx, offset, opacity) {
    'use strict';  
	ctx.save();

	ctx.globalAlpha = opacity;

	ctx.beginPath();
	ctx.moveTo(-190, -105);
	ctx.lineTo(190, -105);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#ffffff";
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(-190, 105);
	ctx.lineTo(190, 105);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#ffffff";
	ctx.stroke();
	
	ctx.restore();

	ctx.save();
	
	ctx.beginPath();
	ctx.moveTo(-180, -100);
	ctx.lineTo(180, -100);
	ctx.lineTo(180, 100);
	ctx.lineTo(-180, 100);
	ctx.clip();

	ctx.globalAlpha = opacity;
	ctx.textAlign = "left";
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	
	var i;
	for (i = 0; i < contacts.length; i += 1) {
		ctx.fillText(contacts[i].name, -140, -64 + i*48 + offset);
		
		ctx.beginPath();
	  	ctx.arc(120, -74 + i*48 + offset, 12, 0, util.rad(360));
		ctx.lineWidth = 4;
		ctx.strokeStyle = "#ffffff";
		ctx.stroke();
		if (contacts[i].sel) {
			ctx.fillStyle = "#ffffff";
			ctx.fill();
		}
	}
	
	ctx.restore();
};