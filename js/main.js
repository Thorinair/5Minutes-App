/*global window, document, tizen, console, setTimeout, tau, util */

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
		"duration": 500,
		"active": false,
		"opacity": [0, 0, 0, 0, 0, 0]
	},
	"flowers": {
		"duration": 200,
		"active": false,
		"centerX": 180,
		"centerY": 180,
		"centerXold": 0,
		"centerYold": 0
	},
	"dotTransition": {
		"duration": 200,
		"active": false,
		"opacity": [1.0, 0.25, 0.25, 0.25]
	},
	"dotFade": {
		"duration": 200,
		"activeIn": false,
		"activeOut": false,
		"multiplier": 0,
		"reference": null
	}
};

var dragLastX = 0;
var dragLastY = 0;
var isScreenTouched = false;

window.requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
    	'use strict';
    	window.setTimeout(callback, 1000 / util.fps);
	};

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
		ctx.rotate(util.rad(-90));
		
		ctx.beginPath();
		ctx.moveTo(plateRadius, 0);
		var i, xOffset, yOffset;
		for (i = 1; i < 6; i += 1) {
			xOffset = plateRadius * Math.cos(util.rad(60 * i));
			yOffset = plateRadius * Math.sin(util.rad(60 * i));
		
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
		xOffset = -radiusCenter * Math.cos(util.rad(60 * -i)) + offset;
		yOffset = radiusCenter * Math.sin(util.rad(60 * -i));
		
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
}

/*
 * Draws the flower overlay.
 * @param ctx Context to draw in.
 */
function drawFlowerDots(ctx) {
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
		  	ctx.globalAlpha = animations.dotTransition.opacity[i] * animations.dotFade.multiplier;
			ctx.fillStyle = "#ffffff";
			ctx.fill();
			ctx.restore();
			ctx.rotate(util.rad(90));
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

	ctx.save();
	
    ctx.clearRect(0, 0, context.canvas.width, context.canvas.height);
    ctx.translate(animations.flowers.centerX, animations.flowers.centerY);
    
	drawFlower(ctx, flowers[util.flowerPrev(currentFlower)], colorDark, -360);
	drawFlower(ctx, flowers[currentFlower], colorDark, 0);
	drawFlower(ctx, flowers[util.flowerNext(currentFlower)], colorDark, 360);
    	
	drawCountdown(ctx, 0, 3, colorBright, colorDark);
	
	ctx.restore();

	ctx.save();
	
	ctx.translate(canvas.width / 2, canvas.height / 2);
	drawFlowerDots(ctx);
	
	ctx.restore();
}

/*
 * Animates the fade-in when application starts.
 */
function animate_startup() {
    'use strict';    
    animations.startup.active = true;
	
	if (animations.startup.opacity[0].toFixed(3) < 1) {
		animations.startup.opacity[0] = util.trans(animations.startup.opacity[0], "quad-down", 0, 1, animations.startup.duration);
	}
	var i;
	for (i = 0; i < 5; i += 1) {
		if (animations.startup.opacity[i].toFixed(3) >= 0.5 && animations.startup.opacity[i + 1].toFixed(3) < 1) {
			animations.startup.opacity[i + 1] = util.trans(animations.startup.opacity[i + 1], "quad-down", 0, 1, animations.startup.duration);
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

    animations.flowers.centerX = util.trans(animations.flowers.centerX, "quad-down", oldX, 180, animations.flowers.duration);
    animations.flowers.centerY = util.trans(animations.flowers.centerY, "quad-down", oldY, 180, animations.flowers.duration);
	
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
    
    var newOpacity = [0.25, 0.25, 0.25, 0.25];
    newOpacity[curr] = 1;

    var i;
    for (i = 0; i < 4; i += 1) {
    	animations.dotTransition.opacity[i] = util.trans(animations.dotTransition.opacity[i], "quad-down", 0.25, newOpacity[i], animations.dotTransition.duration);
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
 * @param multiOld The old opacity.
 */
function animate_dotFadeIn(multiOld) {
    'use strict';
	animations.dotFade.activeIn = true;
    
    animations.dotFade.multiplier = util.trans(animations.dotFade.multiplier, "quad-down", multiOld, 1, animations.dotFade.duration);
	
	if (animations.dotFade.multiplier.toFixed(3) == 1) {
		animations.dotFade.activeIn = false;
	}
		
	if (animations.dotFade.activeIn) {
		window.requestAnimationFrame(function() {
			animate_dotFadeIn(multiOld);
		});
	}
}

/*
 * Animates the flower dot fade out.
 * @param multiOld The old opacity.
 */
function animate_dotFadeOut(multiOld) {
    'use strict';
    if (!isScreenTouched) {
    	animations.dotFade.activeOut = true;
		
		animations.dotFade.multiplier = util.trans(animations.dotFade.multiplier, "quad-down", multiOld, 0, animations.dotFade.duration);
		
		if (animations.dotFade.multiplier.toFixed(3) == 0) {
			animations.dotFade.activeOut = false;
		}
			
		if (animations.dotFade.activeOut) {
			window.requestAnimationFrame(function() {
				animate_dotFadeOut(multiOld);
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
    		animate_dotFadeIn(animations.dotFade.multiplier);
	    	
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
    	    	currentFlower = util.flowerNext(currentFlower);
    	    	animations.flowers.centerXold += 360;
    			animations.flowers.centerX += 360;
    			animate_flowers(animations.flowers.centerX, animations.flowers.centerY);
        		animate_dotTransition(currentFlower);
    	    }
    	    else if (animations.flowers.centerX >= 360) {
    	    	currentFlower = util.flowerPrev(currentFlower);
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
    	    	animate_dotFadeOut(animations.dotFade.multiplier);
			}, 2000);
    	});
    });
}(tau));
