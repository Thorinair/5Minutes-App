/*global window, document, tizen, console, setTimeout, tau, animations, screens, colors, addPlate, colors, types, contacts, loginBox, user, pass, code, util */

var draw = function(){
    'use strict';
    };

/*
 * Draws a single hexagon plate or add symbol.
 * @param ctx Context to draw in.
 * @param use Whether a plate or an add symbol should be drawn.
 * @param color Color of the plate to draw.
 * @param type Type of the plate to draw.
 * @param duration Duration of the event.
 * @param fire Time when the event is supposed to happen.
 * @param x X position of a plate.
 * @param y Y position of a plate.
 * @param radius Radius of a plate.
 * @param stroke Whether to draw stroke of the plate.
 * @param colorB Secondary color, used for add symbols.
 * @param opacity Opacity of a plate or add symbol.
 */
draw.plate = function(ctx, use, color, type, duration, fire, x, y, radius, stroke, colorB, opacity) {
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
		
		if (fire != null) {
			if (util.processFireTime(fire) > 0) {
				ctx.save();
				
				ctx.beginPath();
				ctx.arc(0, 0, radius, 0, util.rad(360 * (util.processFireTime(fire) / (duration * 60))));
				context.lineTo(0, 0);
				ctx.clip();
				
				ctx.beginPath();
				ctx.moveTo(radius - 3, 0);
				for (i = 1; i < 6; i += 1) {
					xOffset = (radius - 3) * Math.cos(util.rad(60 * i));
					yOffset = (radius - 3) * Math.sin(util.rad(60 * i));
				
					ctx.lineTo(xOffset, yOffset);
				}
				ctx.closePath();
				ctx.strokeStyle = "#000000";
				ctx.lineWidth = 2;
				ctx.stroke();
				
				ctx.restore();
			}
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
 * Draws text for a single plate.
 * @param ctx Context to draw in.
 * @param color Color of the text to draw.
 * @param fire Time when the event is supposed to happen.
 * @param x X position of the text.
 * @param y Y position of the text.
 * @param rot Rotation of the text.
 * @param count Number of people that should accept the invite.
 * @param accepted Number of people that have accepted the invite.
 * @param opacity Opacity of a plate or add symbol.
 */
draw.plateText = function(ctx, color, fire, x, y, rot, count, accepted, opacity) {
    'use strict';
    
    if (fire != null) {
		ctx.save();
		
		ctx.translate(x,y);
		ctx.globalAlpha = opacity;
		ctx.rotate(util.rad(rot));
		
		ctx.textAlign = "center";
		ctx.font = "bold 16px Arial";
		ctx.fillStyle = color;
		ctx.fillText(accepted + "/" + count, 0, 5);
		
		ctx.restore();
    }
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
			draw.plate(ctx, true, flower[i].color, flower[i].type, flower[i].duration, flower[i].fire, xOffset, yOffset, radiusPlate, false, colorB, opacity[i].toFixed(3) * animations.screens.multiplier[screens.flowers]);
		}
		else {
			draw.plate(ctx, false, null, null, 0, null, xOffset, yOffset, radiusPlate, false, colorB, opacity[i].toFixed(3) * animations.screens.multiplier[screens.flowers]);
		}
	}

	
    var radiusCenter = 37;
    
	xOffset = -radiusCenter * Math.cos(util.rad(0)) + offset;
	yOffset = radiusCenter * Math.sin(util.rad(0));
	if (flower[0] != null) {
		draw.plateText(ctx, flower[0].color, flower[0].fire, xOffset, yOffset, -90, flower[0].contacts.length, flower[0].accepted, opacity[0].toFixed(3) * animations.screens.multiplier[screens.flowers]);
	}
	xOffset = -radiusCenter * Math.cos(util.rad(-60)) + offset;
	yOffset = radiusCenter * Math.sin(util.rad(-60));
	if (flower[1] != null) {
		draw.plateText(ctx, flower[1].color, flower[1].fire, xOffset, yOffset, -30, flower[1].contacts.length, flower[1].accepted, opacity[1].toFixed(3) * animations.screens.multiplier[screens.flowers]);
	}
	xOffset = -radiusCenter * Math.cos(util.rad(-120)) + offset;
	yOffset = radiusCenter * Math.sin(util.rad(-120));
	if (flower[2] != null) {
		draw.plateText(ctx, flower[2].color, flower[2].fire, xOffset, yOffset, 30, flower[2].contacts.length, flower[2].accepted, opacity[2].toFixed(3) * animations.screens.multiplier[screens.flowers]);
	}
	xOffset = -radiusCenter * Math.cos(util.rad(-180)) + offset;
	yOffset = radiusCenter * Math.sin(util.rad(-180));
	if (flower[3] != null) {
		draw.plateText(ctx, flower[3].color, flower[3].fire, xOffset, yOffset, 90, flower[3].contacts.length, flower[3].accepted, opacity[3].toFixed(3) * animations.screens.multiplier[screens.flowers]);
	}
	xOffset = -radiusCenter * Math.cos(util.rad(-240)) + offset;
	yOffset = radiusCenter * Math.sin(util.rad(-240));
	if (flower[4] != null) {
		draw.plateText(ctx, flower[4].color, flower[4].fire, xOffset, yOffset, -30, flower[4].contacts.length, flower[4].accepted, opacity[4].toFixed(3) * animations.screens.multiplier[screens.flowers]);
	}
	xOffset = -radiusCenter * Math.cos(util.rad(-300)) + offset;
	yOffset = radiusCenter * Math.sin(util.rad(-300));
	if (flower[5] != null) {
		draw.plateText(ctx, flower[5].color, flower[5].fire, xOffset, yOffset, 30, flower[5].contacts.length, flower[5].accepted, opacity[5].toFixed(3) * animations.screens.multiplier[screens.flowers]);
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
 * Draws the contacts label on top when dragging.
 * @param ctx Context to draw in.
 */
draw.contactsLabel = function(ctx, offset) {
    'use strict';	  
	ctx.save();

	if (offset - 220 < 0) {
		ctx.globalAlpha = 0;
	}
	else if (offset - 220 > 100) {
		ctx.globalAlpha = 1;
	} 
	else {
		ctx.globalAlpha = (offset - 220) / 100;
	}
	ctx.textAlign = "center";
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Contacts", 0, -100);
	
	ctx.beginPath();
	ctx.moveTo(-15, -130);
	ctx.lineTo(15, -130);
	ctx.lineTo(0, -145);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();
	
	ctx.restore();
};

/*
 * Draws the login screen.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.login = function(ctx, opacity) {
    'use strict';  

	ctx.save();
	
    var radiusCenter = 60;
    var radiusPlate = radiusCenter * (8/15);
    var xOffset;
    var yOffset;
    var newOpacity;
	
	ctx.rotate(util.rad(-90));
	
	if (code.length < 8) {
		newOpacity = opacity;
	}
	else {
		newOpacity = opacity * 0.5;
	}
	
	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0)) - 104;	
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * -1)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * -1));
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0));	
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 1)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * 1));
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0)) + 104;	
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);
	
	if (code.length > 0) {
		newOpacity = opacity;
	}
	else {
		newOpacity = opacity * 0.5;
	}
	
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);
	
	ctx.restore();
	

	ctx.save();

	ctx.globalAlpha = opacity;
	ctx.beginPath();
	ctx.moveTo(-60, -24);
	ctx.lineTo(60, -24);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#ffffff";
	ctx.stroke();

	ctx.fillStyle = "#ffffff";
	ctx.textAlign = "left";
	ctx.font = "40px Arial";
	var hidden = "••••••••";
	ctx.fillText(hidden.substring(0, code.length), -60, -32);

	ctx.restore();
	

	ctx.save();
	
	if (code.length == 8) {
		ctx.globalAlpha = opacity;
	}
	else {
		ctx.globalAlpha = opacity * 0.5;
	}
	ctx.beginPath();
	ctx.moveTo(68, -64);
	ctx.lineTo(152, -64);
	ctx.lineTo(152, -20);
	ctx.lineTo(68, -20);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();

	ctx.restore();
	
	  
	ctx.save();

	ctx.globalAlpha = opacity;
	ctx.textAlign = "center";
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Login", 0, -130);

	ctx.font = "24px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Register at 5minapp.com", 0, -90);

	ctx.textAlign = "right";
	ctx.font = "40px Arial";
	ctx.fillText("Code:", -70, -32);

	ctx.textAlign = "center";
	ctx.font = "32px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Go!", 110, -31);	
	
	ctx.font = "48px Arial";	
	ctx.fillText("7", -104, 36);
	ctx.fillText("0", -104, 96);

	ctx.fillText("4", -52, 66);
	ctx.fillText("1", -52, 126);
	
	ctx.fillText("8", 0, 36);
	ctx.fillText("5", 0, 96);
	ctx.fillText("2", 0, 156);

	ctx.fillText("6", 52, 66);
	ctx.fillText("3", 52, 126);
	
	ctx.fillText("9", 104, 36);	
	ctx.fillText("<", 104, 96);
	
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
 * Draws screen for adding color to plate.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.addColor = function(ctx, opacity) {
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
	draw.plate(ctx, true, colors[0].val, null, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[0], null, opacity);
	draw.plate(ctx, true, colors[1].val, null, 0, null, xOffset, yOffset, radiusPlate, stroke[1], null, opacity);
	draw.plate(ctx, true, colors[2].val, null, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[2], null, opacity);
	draw.plate(ctx, true, colors[3].val, null, 0, null, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[3], null, opacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0)) + 20;
	draw.plate(ctx, true, colors[4].val, null, 0, null, xOffset + radiusCenter * 3, yOffset, radiusPlate, stroke[4], null, opacity);
	draw.plate(ctx, true, colors[5].val, null, 0, null, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[5], null, opacity);
	draw.plate(ctx, true, colors[6].val, null, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[6], null, opacity);
	draw.plate(ctx, true, colors[7].val, null, 0, null, xOffset, yOffset, radiusPlate, stroke[7], null, opacity);
	draw.plate(ctx, true, colors[8].val, null, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[8], null, opacity);
	
	xOffset = -radiusCenter * Math.cos(util.rad(60 * 1));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 1)) + 20;
	draw.plate(ctx, true, colors[9].val, null, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[9], null, opacity);
	draw.plate(ctx, true, colors[10].val, null, 0, null, xOffset, yOffset, radiusPlate, stroke[10], null, opacity);
	draw.plate(ctx, true, colors[11].val, null, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[11], null, opacity);
	draw.plate(ctx, true, colors[12].val, null, 0, null, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[12], null, opacity);
};

/*
 * Draws screen for adding type to plate.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.addType = function(ctx, opacity) {
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
	draw.plate(ctx, true, colors[addPlate.color].val, types[0].val, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[0], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[1].val, 0, null, xOffset, yOffset, radiusPlate, stroke[1], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[2].val, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[2], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[3].val, 0, null, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[3], null, opacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0)) + 20;
	draw.plate(ctx, true, colors[addPlate.color].val, types[4].val, 0, null, xOffset + radiusCenter * 3, yOffset, radiusPlate, stroke[4], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[5].val, 0, null, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[5], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[6].val, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[6], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[7].val, 0, null, xOffset, yOffset, radiusPlate, stroke[7], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[8].val, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[8], null, opacity);
	
	xOffset = -radiusCenter * Math.cos(util.rad(60 * 1));
	yOffset = radiusCenter * Math.sin(util.rad(60 * 1)) + 20;
	draw.plate(ctx, true, colors[addPlate.color].val, types[9].val, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, stroke[9], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[10].val, 0, null, xOffset, yOffset, radiusPlate, stroke[10], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[11].val, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, stroke[11], null, opacity);
	draw.plate(ctx, true, colors[addPlate.color].val, types[12].val, 0, null, xOffset + radiusCenter * 2, yOffset, radiusPlate, stroke[12], null, opacity);
};

/*
 * Draws screen for adding duration to plate.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.addDuration = function(ctx, opacity) {
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
 * Draws screen for adding contacts to plate.
 * @param ctx Context to draw in.
 * @param offset Offset of the list.
 * @param opacity Opacity to use when drawing.
 */
draw.addContacts = function(ctx, offset, opacity) {
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

/*
 * Draws the contacts screen.
 * @param ctx Context to draw in.
 * @param offset Offset of the list.
 * @param opacity Opacity to use when drawing.
 */
draw.contacts = function(ctx, offset, opacity) {
    'use strict';  
	ctx.save();

	ctx.globalAlpha = opacity;
	ctx.beginPath();
	ctx.moveTo(-40, 120);
	ctx.lineTo(40, 120);
	ctx.lineTo(40, 160);
	ctx.lineTo(-40, 160);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();

	ctx.globalAlpha = opacity;
	ctx.textAlign = "center";
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Contacts", 0, -120);
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Add", 0, 150);

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
	}
	
	ctx.restore();
};

/*
 * Draws the contact adding screen.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.contactsAdd = function(ctx, opacity) {
    'use strict';  

	ctx.save();
	
    var radiusCenter = 60;
    var radiusPlate = radiusCenter * (8/15);
    var xOffset;
    var yOffset;
    var newOpacity;
	
	ctx.rotate(util.rad(-90));
	
	if (contact.length < 8) {
		newOpacity = opacity;
	}
	else {
		newOpacity = opacity * 0.5;
	}
	
	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0)) - 104;	
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * -1)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * -1));
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0));	
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 1)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * 1));
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset - radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);

	xOffset = -radiusCenter * Math.cos(util.rad(60 * 0)) - 20;
	yOffset = radiusCenter * Math.sin(util.rad(60 * 0)) + 104;	
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset + radiusCenter * 1, yOffset, radiusPlate, false, null, newOpacity);
	
	if (contact.length > 0) {
		newOpacity = opacity;
	}
	else {
		newOpacity = opacity * 0.5;
	}
	
	draw.plate(ctx, true, "#ffffff", null, 0, null, xOffset, yOffset, radiusPlate, false, null, newOpacity);
	
	ctx.restore();
	

	ctx.save();

	ctx.globalAlpha = opacity;
	ctx.beginPath();
	ctx.moveTo(-60, -72);
	ctx.lineTo(116, -72);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#ffffff";
	ctx.stroke();

	ctx.fillStyle = "#ffffff";
	ctx.textAlign = "left";
	ctx.font = "40px Arial";
	ctx.fillText(contact, -60, -80);

	ctx.restore();
	

	ctx.save();
	
	if (contact.length == 8) {
		ctx.globalAlpha = opacity;
	}
	else {
		ctx.globalAlpha = opacity * 0.5;
	}
	ctx.beginPath();
	ctx.moveTo(-50, -61);
	ctx.lineTo(50, -61);
	ctx.lineTo(50, -17);
	ctx.lineTo(-50, -17);
	ctx.fillStyle = "#ffffff";
	ctx.closePath();
	ctx.fill();

	ctx.restore();
	
	  
	ctx.save();

	ctx.globalAlpha = opacity;
	ctx.textAlign = "center";
	
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText("Add Contact", 0, -120);

	ctx.textAlign = "right";
	ctx.font = "40px Arial";
	ctx.fillText("ID:", -70, -80);

	ctx.textAlign = "center";
	ctx.font = "32px Arial";
	ctx.fillStyle = "#000000";
	ctx.fillText("Invite", 0, -28);	
	
	ctx.font = "48px Arial";	
	ctx.fillText("7", -104, 36);
	ctx.fillText("0", -104, 96);

	ctx.fillText("4", -52, 66);
	ctx.fillText("1", -52, 126);
	
	ctx.fillText("8", 0, 36);
	ctx.fillText("5", 0, 96);
	ctx.fillText("2", 0, 156);

	ctx.fillText("6", 52, 66);
	ctx.fillText("3", 52, 126);
	
	ctx.fillText("9", 104, 36);	
	ctx.fillText("<", 104, 96);
	
	ctx.restore();
};

/*
 * Draws the notification screen.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.notifications = function(ctx, offset, opacity) {
    'use strict';
	ctx.save();
	
	if (notifications.length != 0) {
		var notification = notifications[notifications.length - 1];
		if (notification.type == "contact_request") {
			ctx.globalAlpha = opacity;
			
			ctx.beginPath();
			ctx.moveTo(-60, 60);
			ctx.lineTo(60, 60);
			ctx.lineTo(60, 100);
			ctx.lineTo(-60, 100);
			ctx.fillStyle = "#ffffff";
			ctx.closePath();
			ctx.fill();	
			
			ctx.beginPath();
			ctx.moveTo(-60, 110);
			ctx.lineTo(60, 110);
			ctx.lineTo(60, 150);
			ctx.lineTo(-60, 150);
			ctx.fillStyle = "#ffffff";
			ctx.closePath();
			ctx.fill();	
			
			ctx.textAlign = "center";
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText("Notifications", 0, -120);

			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(notification.firstname + " " + notification.lastname + " wants to", 0, -40);
			ctx.fillText("add you to contacts.", 0, 0);
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#000000";
			ctx.fillText("Accept", 0, 90);
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#000000";
			ctx.fillText("Decline", 0, 140);
		}
		else if (notification.type == "contact_reject") {
			ctx.globalAlpha = opacity;
			
			ctx.beginPath();
			ctx.moveTo(-60, 85);
			ctx.lineTo(60, 85);
			ctx.lineTo(60, 125);
			ctx.lineTo(-60, 125);
			ctx.fillStyle = "#ffffff";
			ctx.closePath();
			ctx.fill();	
			
			ctx.textAlign = "center";
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText("Notifications", 0, -120);

			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(notification.firstname + " " + notification.lastname + " rejected", 0, -40);
			ctx.fillText("your contact request.", 0, 0);
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#000000";
			ctx.fillText("Okay", 0, 115);
		}
		else if (notification.type == "contact_accept") {
			ctx.globalAlpha = opacity;
			
			ctx.beginPath();
			ctx.moveTo(-60, 85);
			ctx.lineTo(60, 85);
			ctx.lineTo(60, 125);
			ctx.lineTo(-60, 125);
			ctx.fillStyle = "#ffffff";
			ctx.closePath();
			ctx.fill();	
			
			ctx.textAlign = "center";
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText("Notifications", 0, -120);

			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(notification.firstname + " " + notification.lastname + " accepted", 0, -40);
			ctx.fillText("your contact request.", 0, 0);
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#000000";
			ctx.fillText("Okay", 0, 115);
		}
		else if (notification.type == "push_message") {
			
			draw.plate(ctx, true, "#" + notification.color, notification.plateType, null, null, 0, -5, 64, false, null, opacity);
						
			ctx.globalAlpha = opacity;

			ctx.beginPath();
			ctx.moveTo(-70, 100);
			ctx.lineTo(-5, 100);
			ctx.lineTo(-5, 155);
			ctx.lineTo(-70, 155);
			ctx.fillStyle = "#ff0000";
			ctx.closePath();
			ctx.fill();	

			ctx.beginPath();
			ctx.moveTo(70, 100);
			ctx.lineTo(5, 100);
			ctx.lineTo(5, 155);
			ctx.lineTo(70, 155);
			ctx.fillStyle = "#00ff00";
			ctx.closePath();
			ctx.fill();	
			
			ctx.textAlign = "center";
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText("Notifications", 0, -120);

			ctx.font = "24px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(notification.firstname + " " + notification.lastname + " notified you:", 0, -85);
			ctx.fillText(notification.message, 0, 88);

			ctx.beginPath();
			ctx.moveTo(-56, 116);
			ctx.lineTo(-49, 109);
			ctx.lineTo(-37, 121);
			ctx.lineTo(-25, 109);
			ctx.lineTo(-18, 116);
			ctx.lineTo(-30, 128);
			ctx.lineTo(-18, 140);
			ctx.lineTo(-25, 147);
			ctx.lineTo(-37, 135);
			ctx.lineTo(-49, 147);
			ctx.lineTo(-56, 140);
			ctx.lineTo(-44, 128);
			ctx.fillStyle = "#000000";
			ctx.closePath();
			ctx.fill();

			ctx.beginPath();
			ctx.moveTo(14, 131);
			ctx.lineTo(21, 125);
			ctx.lineTo(30, 133);
			ctx.lineTo(54, 109);
			ctx.lineTo(61, 116);
			ctx.lineTo(31, 147);
			ctx.fillStyle = "#000000";
			ctx.closePath();
			ctx.fill();
		}
		else if (notification.type == "event_decline") {			
			ctx.globalAlpha = opacity;
			
			ctx.beginPath();
			ctx.moveTo(-60, 85);
			ctx.lineTo(60, 85);
			ctx.lineTo(60, 125);
			ctx.lineTo(-60, 125);
			ctx.fillStyle = "#ffffff";
			ctx.closePath();
			ctx.fill();	
			
			ctx.textAlign = "center";
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText("Notifications", 0, -120);

			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(notification.firstname + " " + notification.lastname, 0, -60);
			ctx.fillText("declined your event:", 0, -20);
			ctx.fillText(notification.message, 0, 40);
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#000000";
			ctx.fillText("Okay", 0, 115);
		}
		else if (notification.type == "event_accept") {			
			ctx.globalAlpha = opacity;
			
			ctx.beginPath();
			ctx.moveTo(-60, 85);
			ctx.lineTo(60, 85);
			ctx.lineTo(60, 125);
			ctx.lineTo(-60, 125);
			ctx.fillStyle = "#ffffff";
			ctx.closePath();
			ctx.fill();	
			
			ctx.textAlign = "center";
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText("Notifications", 0, -120);

			ctx.font = "32px Arial";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(notification.firstname + " " + notification.lastname, 0, -60);
			ctx.fillText("accepted your event:", 0, -20);
			ctx.fillText(notification.message, 0, 40);
			
			ctx.font = "32px Arial";
			ctx.fillStyle = "#000000";
			ctx.fillText("Okay", 0, 115);
		}
	}
	
	ctx.restore();
};

/*
 * Draws a message on the screen.
 * @param ctx Context to draw in.
 * @param opacity Opacity to use when drawing.
 */
draw.message = function(ctx, opacity) {
    'use strict';  
	ctx.save();

	ctx.globalAlpha = opacity * 0.75;
	ctx.beginPath();
	ctx.moveTo(-180, -30);
	ctx.lineTo(180, -30);
	ctx.lineTo(180, 30);
	ctx.lineTo(-180, 30);
	ctx.fillStyle = "#000000";
	ctx.closePath();
	ctx.fill();
	
	ctx.restore();

	ctx.save();

	ctx.globalAlpha = opacity;
	ctx.textAlign = "center";
	ctx.font = "32px Arial";
	ctx.fillStyle = "#ffffff";
	ctx.fillText(animations.messageFade.text, 0, 10);
	
	ctx.restore();
};