/*global window, document, tizen, console, setTimeout, tau, util, draw */

var canvas, context;

var web = "https://5minutes.celestek.xyz/test.html";

var currentFlower = 0;
var flowers = [
		[
	       {"type": "coffee", "color": "#0080ff", "duration": 5, "message": "Coffee in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
	       {"type": "meeting", "color": "#ff0000", "duration": 5, "message": "Meeting in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
	       {"type": "office", "color": "#ffff00", "duration": 5, "message": "Office in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
	       null,
	       null,
	       {"type": "dinner", "color": "#0080ff", "duration": 5, "message": "Dinner in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null}
		],  
	    [
		   null,
		   {"type": "gaming", "color": "#8000ff", "duration": 5, "message": "Gaming in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
		   null,
		   {"type": "movies", "color": "#8000ff", "duration": 5, "message": "Movies in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
		   null,
		   {"type": "concert", "color": "#8000ff", "duration": 5, "message": "Concert in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null}
		],
		[
		   {"type": "coffee", "color": "#0000ff", "duration": 5, "message": "Coffee in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
		   {"type": "coffee", "color": "#0000ff", "duration": 5, "message": "Coffee in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
		   null,
		   {"type": "coffee", "color": "#8000ff", "duration": 5, "message": "Coffee in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
		   {"type": "coffee", "color": "#ff00ff", "duration": 5, "message": "Coffee in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
		   null
		], 
		[
	       {"type": "coffee", "color": "#0080ff", "duration": 5, "message": "Coffee in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
	       null,
	       null,
	       {"type": "coffee", "color": "#0080ff", "duration": 5, "message": "Coffee in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
	       {"type": "coffee", "color": "#0080ff", "duration": 5, "message": "Coffee in 5 minutes.", "contacts": [345435, 356345, 346345], "fire": null},
	       null
		]
	];

var addPlate = {
		"flower": 0, 
		"plate": 0, 
		"color": null, 
		"type": null, 
		"duration": 5, 
		"message": null, 
		"fire": null,
		"title": "New"
	};

var animations = {
		"screens": {
			"duration": 200,
			"active": false,
			"multiplier": [0, 0, 0, 0, 0, 0, 0, 0, 0]
		},
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
		},
		"messageFade": {
			"duration": 200,
			"onScreen": 2000,
			"activeIn": false,
			"activeOut": false,
			"multiplier": 0,
			"reference": null,
			"text": ""
		}
	};

var screens = {
		"login": 0,
		"flowers": 1,
		"addColor": 2,
		"addType": 3,
		"addDuration": 4,
		"addContacts": 5,
		"edit": 6,
		"contacts": 7,
		"contactsAdd": 8
	};

var colors = [
	   {"val": "#ff0000", "name": "Red"},
	   {"val": "#ff8000", "name": "Orange"},
	   {"val": "#ffff00", "name": "Yellow"},
	   {"val": "#80ff00", "name": "Lime"},
	   {"val": "#00ff00", "name": "Green"},
	   {"val": "#00ff80", "name": "Turquoise"},
	   {"val": "#00ffff", "name": "Cyan"},
	   {"val": "#0080ff", "name": "Sky Blue"},
	   {"val": "#0000ff", "name": "Blue"},
	   {"val": "#8000ff", "name": "Purple"},
	   {"val": "#ff00ff", "name": "Magenta"},
	   {"val": "#ff0080", "name": "Pink"},
	   {"val": "#ffffff", "name": "White"}
   ];

var types = [
  	   {"val": "meeting", 	"name": "Meeting"},
	   {"val": "office", 	"name": "Office"},
	   {"val": "conference","name": "Conference"},
	   {"val": "break", 	"name": "Break"},
	   {"val": "workout", 	"name": "Workout"},
	   {"val": "call", 		"name": "Call"},
	   {"val": "pizza", 	"name": "Pizza"},
	   {"val": "dinner", 	"name": "Dinner"},
	   {"val": "coffee", 	"name": "Coffee"},
	   {"val": "gaming", 	"name": "Gaming"},
	   {"val": "movies", 	"name": "Movies"},
	   {"val": "concert", 	"name": "Concert"},
	   {"val": "party", 	"name": "Party"}
   ];

var contacts = [
       {"name": "Denis Vajak", 	"id": 87436543, "sel": false},
       {"name": "Josip Balen", 	"id": 47522432, "sel": false},
       {"name": "Thorinair", "id": 85820345, "sel": false},
       {"name": "Twilight Sparkle", "id": 24287541, "sel": false},
       {"name": "Rainbow Dash", "id": 32042352, "sel": false},
       {"name": "Pinkie Pie", "id": 34565346, "sel": false},
       {"name": "Fluttershy", "id": 54312244, "sel": false},
       {"name": "Rarity", "id": 24657888, "sel": false},
       {"name": "Applejack", "id": 56765, "sel": false}
   ];

var dragLastX = 0;
var dragLastY = 0;
var isScreenTouched = false;
var wasDragged = false;
var tapHold;
var wasHeld = false;
var lastDuration = 0;
var listOffset = 0;
var listOffsetLast = 0;

var user = "";
var pass = "";
var code = "";

var contact = "";
var slowAnimated = false;

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
 * Animates the fade when switching active screen.
 * @param screen Screen to transition to.
 * @param oldMultiplier Multipliers of previous screens.
 */
function animate_screens(screen, oldMultiplier) {
    'use strict';
    animations.screens.active = true;
    
    var newMultiplier = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    newMultiplier[screen] = 1;

    var i;
    for (i = 0; i < animations.screens.multiplier.length; i += 1) {
    	animations.screens.multiplier[i] = util.trans(animations.screens.multiplier[i], "quad-down", oldMultiplier[i], newMultiplier[i], animations.screens.duration);
    }
    
	if (animations.screens.multiplier[screen].toFixed(3) == 1) {
		animations.screens.active = false;
	}
		
	if (animations.screens.active) {
		window.requestAnimationFrame(function() {
			animate_screens(screen, oldMultiplier);
		});
	}
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
 * @param oldOpacity Opacity of dots before the transition.
 */
function animate_dotTransition(curr, oldOpacity) {
    'use strict';
	animations.dotTransition.active = true;
    
    var newOpacity = [0.25, 0.25, 0.25, 0.25];
    newOpacity[curr] = 1;

    var i;
    for (i = 0; i < 4; i += 1) {
    	animations.dotTransition.opacity[i] = util.trans(animations.dotTransition.opacity[i], "quad-down", oldOpacity[i], newOpacity[i], animations.dotTransition.duration);
    }
	
	if (animations.dotTransition.opacity[curr].toFixed(3) == 1 || curr != currentFlower) {
		animations.dotTransition.active = false;
	}
		
	if (animations.dotTransition.active) {
		window.requestAnimationFrame(function() {
			animate_dotTransition(curr, oldOpacity);
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
 * Animates the message fade in.
 * @param multiOld The old opacity.
 */
function animate_messageFadeIn(multiOld) {
    'use strict';
	animations.messageFade.activeIn = true;
    
    animations.messageFade.multiplier = util.trans(animations.messageFade.multiplier, "quad-down", multiOld, 1, animations.messageFade.duration);
	
	if (animations.messageFade.multiplier.toFixed(3) == 1) {
		animations.messageFade.activeIn = false;
	}
		
	if (animations.messageFade.activeIn) {
		window.requestAnimationFrame(function() {
			animate_messageFadeIn(multiOld);
		});
	}
}

/*
 * Animates the message fade out.
 * @param multiOld The old opacity.
 */
function animate_messageFadeOut(multiOld) {
    'use strict';
	animations.messageFade.activeOut = true;
	
	animations.messageFade.multiplier = util.trans(animations.messageFade.multiplier, "quad-down", multiOld, 0, animations.messageFade.duration);
	
	if (animations.messageFade.multiplier.toFixed(3) == 0) {
		animations.messageFade.activeOut = false;
	}
		
	if (animations.messageFade.activeOut) {
		window.requestAnimationFrame(function() {
			animate_messageFadeOut(multiOld);
		});
	}
}

/*
 * Shows a message on the screen.
 * @param text Text to show.
 */
function showMessage(text) {
	window.clearTimeout(animations.messageFade.reference);
	animations.messageFade.text = text;	
	
	animate_messageFadeIn(animations.messageFade.multiplier);	
	
	animations.messageFade.reference = window.setTimeout(function() {
    	animate_messageFadeOut(animations.messageFade.multiplier);
	}, animations.messageFade.onScreen + animations.messageFade.duration);
}

/*
 * Draws the whole UI.
 * @param ctx Context to draw in.
 */
function drawUI(ctx) {
    'use strict';

    // UI Parameters
    var colorDark = "#343434";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Screen: login
	if (animations.screens.multiplier[screens.login].toFixed(3) > 0) {	
		ctx.save();

	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    draw.login(ctx, animations.screens.multiplier[screens.login]);
		
		ctx.restore();
	}
    
    // Screen: flowers
	if (animations.screens.multiplier[screens.flowers].toFixed(3) > 0) {	
		ctx.save();
		
	    ctx.translate(animations.flowers.centerX, animations.flowers.centerY);
	    draw.flower(ctx, flowers[util.flowerPrev(currentFlower)], colorDark, -360, animations.startup.opacity);
		draw.flower(ctx, flowers[currentFlower], colorDark, 0, animations.startup.opacity);
		draw.flower(ctx, flowers[util.flowerNext(currentFlower)], colorDark, 360, animations.startup.opacity);

		ctx.restore();
	
		ctx.save();
		
		ctx.translate(canvas.width / 2, canvas.height / 2);
		draw.dots(ctx);
		draw.contactsLabel(ctx, animations.flowers.centerY);
		
		ctx.restore();
	}

    // Screen: addColor
	if (animations.screens.multiplier[screens.addColor].toFixed(3) > 0) {	
		ctx.save();

	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    draw.addColor(ctx, animations.screens.multiplier[screens.addColor]);
		
		ctx.restore();
	}

    // Screen: addType
	if (animations.screens.multiplier[screens.addType].toFixed(3) > 0) {	
		ctx.save();

	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    draw.addType(ctx, animations.screens.multiplier[screens.addType]);
		
		ctx.restore();
	}

    // Screen: addDuration
	if (animations.screens.multiplier[screens.addDuration].toFixed(3) > 0) {	
		ctx.save();

	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    draw.addDuration(ctx, animations.screens.multiplier[screens.addDuration]);
		
		ctx.restore();
	}

    // Screen: addContacts
	if (animations.screens.multiplier[screens.addContacts].toFixed(3) > 0) {	
		ctx.save();

	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    draw.addContacts(ctx, listOffset, animations.screens.multiplier[screens.addContacts]);
		
		ctx.restore();
	}

    // Screen: edit
	if (animations.screens.multiplier[screens.edit].toFixed(3) > 0) {	
		ctx.save();

	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    draw.editText(ctx, animations.screens.multiplier[screens.edit]);
		
		ctx.restore();
	}

    // Screen: contacts
	if (animations.screens.multiplier[screens.contacts].toFixed(3) > 0) {	
		ctx.save();

	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    draw.contacts(ctx, listOffset, animations.screens.multiplier[screens.contacts]);
		
		ctx.restore();
	}

    // Screen: contactsAdd
	if (animations.screens.multiplier[screens.contactsAdd].toFixed(3) > 0) {	
		ctx.save();

	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    draw.contactsAdd(ctx, animations.screens.multiplier[screens.contactsAdd]);
		
		ctx.restore();
	}
    
    // Message
	if (animations.messageFade.multiplier.toFixed(3) > 0) {	
		ctx.save();

	    ctx.translate(canvas.width / 2, canvas.height / 2);
	    draw.message(ctx, animations.messageFade.multiplier);
		
		ctx.restore();
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
    
	run = animations.screens.active
	|| animations.startup.active
	|| animations.flowers.active 
	|| animations.dotTransition.active
	|| animations.dotFade.activeIn
	|| animations.dotFade.activeOut
	|| animations.messageFade.activeIn
	|| animations.messageFade.activeOut;
    
	window.requestAnimationFrame(function() {
		animation(ctx, run);
	});
}

/*
 * Slow animation loop, used to update countdown timers.
 * @param ctx Context to draw in.
 */
function animationSlow(ctx) {
    'use strict';
    
    drawUI(ctx);

    slowAnimated = util.checkForFires();
	if (slowAnimated) {
		window.setTimeout(function() {
			animationSlow(ctx);
		}, 1000);
	}
}

function errorCallback(response) 
{
    'use strict';
   console.log('The following error occurred: ' +  response.name);
}

function registerSuccessCallback(regID) 
{
    'use strict';
   console.log("Registration succeeded with id: " + regID);
   util.webUpdatePush(regID);
}

/*
 * Fired when application loads.
 */
window.onload = function onLoad() {
    'use strict';

    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    
    var data = JSON.parse(localStorage.getItem("flowers"));
    if (data != null) {
    	flowers = data;
    }   
    
    user = localStorage.getItem("user");
    pass = localStorage.getItem("pass");
    
    if (user != null && pass != null) {
        var service = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/push_test");
        tizen.push.registerService(service, registerSuccessCallback, errorCallback);
    }
    else {
    	animations.screens.multiplier = [1, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    
    animation(context, false);
    drawUI(context);
    
    slowAnimated = util.checkForFires();
    if (slowAnimated) {
    	animationSlow(context);
    }    
};

/*
 * Fired when the user hold-presses on a plate.
 * @param x X coordinate of the press.
 * @param y Y coordinate of the press.
 */
function processTapHold(x, y) {
    'use strict';
	wasHeld = true;
	var plate = util.plateFromCoords(x, y);	
	if (flowers[currentFlower][plate] != null) {
		util.loadPlate(currentFlower, plate);
		animate_screens(screens.edit, util.copy(animations.screens.multiplier));
	}
}

(function(tau) {
    'use strict';
    document.addEventListener("pagebeforeshow", function() {
    	tau.event.enableGesture(document, new tau.event.gesture.Drag({
    	}));

    	document.addEventListener("touchstart", function(e) {
    		
    	    // Screen: flowers
    		if (animations.screens.multiplier[screens.flowers].toFixed(3) == 1) {	
	    		isScreenTouched = true;
	    		
	    		if (!animations.flowers.active) {
		    		tapHold = window.setTimeout(function() {
		    			processTapHold(e.changedTouches.item(0).screenX, e.changedTouches.item(0).screenY);
					}, 1000);
	    		}
	    		
	    		animations.flowers.active = false;
	    		dragLastX = 0;
	    		dragLastY = 0;
    		}
    		
    	    // Screen: addDuration
    		if (animations.screens.multiplier[screens.addDuration].toFixed(3) == 1) {	
	    		lastDuration = addPlate.duration;
    		}
    		
    	    // Screen: addContacts
    		if (animations.screens.multiplier[screens.addContacts].toFixed(3) == 1) {	
    			listOffsetLast = listOffset;
    		}
    		
    	    // Screen: contacts
    		if (animations.screens.multiplier[screens.contacts].toFixed(3) == 1) {	
    			listOffsetLast = listOffset;
    		}
    	});

    	document.addEventListener("drag", function(e) {
    		
    		var dragX;
    		var dragY;
    		
    	    // Screen: flowers
    		if (animations.screens.multiplier[screens.flowers].toFixed(3) == 1) {	
	    		wasDragged = true;
	    		window.clearTimeout(tapHold);
	    		window.clearTimeout(animations.dotFade.reference);
	    		
	    		if (!wasHeld) {
		    		animate_dotFadeIn(animations.dotFade.multiplier);
			    	
		    		dragX = e.detail.deltaX;
		    		dragY = e.detail.deltaY;
		    		animations.flowers.centerX += dragX - dragLastX;
		    		animations.flowers.centerY += dragY - dragLastY;
		    		drawUI(context);
		    		dragLastX = dragX;
		    		dragLastY = dragY;
	    		}
    		}

    	    // Screen: addDuration
    		if (animations.screens.multiplier[screens.addDuration].toFixed(3) == 1) {	
	    		wasDragged = true;
	    		dragY = e.detail.deltaY;
	    		addPlate.duration = lastDuration + Math.floor(-dragY / 40) * 5;
	    		if (addPlate.duration < 5) {
	    			addPlate.duration = 5;
	    		}
	    		else if (addPlate.duration > 60) {
	    			addPlate.duration = 60;
	    		}
	    		drawUI(context);
    		}

    	    // Screen: addContacts
    		if (animations.screens.multiplier[screens.addContacts].toFixed(3) == 1) {	
	    		wasDragged = true;
	    		dragY = e.detail.deltaY;
	    		listOffset = listOffsetLast + dragY;
	    		if (listOffset > 0) {
	    			listOffset = 0;
	    		}
	    		else if (listOffset < -contacts.length * 48 + 200) {
	    			listOffset = -contacts.length * 48 + 200;
	    		}
	    		drawUI(context);
    		}

    	    // Screen: contacts
    		if (animations.screens.multiplier[screens.contacts].toFixed(3) == 1) {	
	    		wasDragged = true;
	    		dragY = e.detail.deltaY;
	    		listOffset = listOffsetLast + dragY;
	    		if (listOffset > 0) {
	    			listOffset = 0;
	    		}
	    		else if (listOffset < -contacts.length * 48 + 200) {
	    			listOffset = -contacts.length * 48 + 200;
	    		}
	    		drawUI(context);
    		}
    	});

    	document.addEventListener("touchend", function(e) {
    		var touchX = e.changedTouches.item(0).screenX;
    		var touchY = e.changedTouches.item(0).screenY;

    	    // Screen: login
    		if (animations.screens.multiplier[screens.login].toFixed(3) == 1) {	
	    			
    			if (touchX >= 248 && touchX < 332 && touchY >= 116 && touchY < 160 && code.length == 8) {
    				util.webOnetime();
					animate_screens(screens.flowers, util.copy(animations.screens.multiplier));
		    		window.setTimeout(function() {
		    			animate_startup();
					}, 200);
    			}
    			
    			if (code.length < 8) {
    				if (touchX >= 50 && touchX < 102 && touchY >= 170 && touchY < 230) {
    					util.typeCode(context, "7");
	    			}
    				else if (touchX >= 50 && touchX < 102 && touchY >= 230 && touchY < 290) {
    					util.typeCode(context, "0");
	    			}
    				
    				else if (touchX >= 102 && touchX < 154 && touchY >= 200 && touchY < 260) {
    					util.typeCode(context, "4");
	    			}
    				else if (touchX >= 102 && touchX < 154 && touchY >= 260 && touchY < 320) {
    					util.typeCode(context, "1");
	    			}
    				
    				else if (touchX >= 154 && touchX < 206 && touchY >= 170 && touchY < 230) {
    					util.typeCode(context, "8");
	    			}
    				else if (touchX >= 154 && touchX < 206 && touchY >= 230 && touchY < 290) {
    					util.typeCode(context, "5");
	    			}
    				else if (touchX >= 154 && touchX < 206 && touchY >= 290 && touchY < 350) {
    					util.typeCode(context, "2");
	    			}
    				
    				else if (touchX >= 206 && touchX < 258 && touchY >= 200 && touchY < 260) {
    					util.typeCode(context, "6");
	    			}
    				else if (touchX >= 206 && touchX < 258 && touchY >= 260 && touchY < 320) {
    					util.typeCode(context, "3");
	    			}
    				
    				else if (touchX >= 258 && touchX < 310 && touchY >= 170 && touchY < 230) {
    					util.typeCode(context, "9");
	    			}
    			}
    			
    			if (code.length) {
    				if (touchX >= 258 && touchX < 310 && touchY >= 230 && touchY < 290) {
    					code = code.slice(0, -1);
    					drawUI(context);
	    			}
    			}
    		}
    		
    	    // Screen: flowers
    		if (animations.screens.multiplier[screens.flowers].toFixed(3) == 1) {	
	    		isScreenTouched = false;
	    		window.clearTimeout(tapHold);
	    		
	    		if (!wasHeld) {
	    			if (animations.flowers.centerX.toFixed(3) != 180 && animations.flowers.centerY.toFixed(3) != 180) {
	    				animations.flowers.active = true;
	    				
	    				if (animations.flowers.centerY >= 360) {
	        				listOffset = 0;
		            		animate_screens(screens.contacts, util.copy(animations.screens.multiplier));
	    				}	   
	    				
	    	    	    if (animations.flowers.centerX <= 0) {
	    	    	    	currentFlower = util.flowerNext(currentFlower);
	    	    	    	animations.flowers.centerXold += 360;
	    	    			animations.flowers.centerX += 360;
	    	    			animate_flowers(animations.flowers.centerX, animations.flowers.centerY);
	    	        		animate_dotTransition(currentFlower, util.copy(animations.dotTransition.opacity));
	    	    	    }
	    	    	    else if (animations.flowers.centerX >= 360) {
	    	    	    	currentFlower = util.flowerPrev(currentFlower);
	    	    	    	animations.flowers.centerXold -= 360;
	    	    			animations.flowers.centerX -= 360;
	    	    			animate_flowers(animations.flowers.centerX, animations.flowers.centerY);
	    	        		animate_dotTransition(currentFlower, util.copy(animations.dotTransition.opacity));
	    	    	    }
	    	    	    else {
	    	    	    	animate_flowers(animations.flowers.centerX, animations.flowers.centerY);
	    	        		animate_dotTransition(currentFlower, util.copy(animations.dotTransition.opacity));
	    	    	    }
	    	    		
	    	    	    animations.dotFade.reference = window.setTimeout(function() {
	    	    	    	animate_dotFadeOut(animations.dotFade.multiplier);
	    				}, 2000);
	    			}
	    			else {
	    				var plate = util.plateFromCoords(touchX, touchY);
	    				if (plate != null) {
		    				if (flowers[currentFlower][plate]) {
			    				//TODO: Add message sending code here!
			    				console.log("Tap! flower: " + currentFlower + ", plate: " + plate);
			    				console.log(JSON.stringify(flowers[currentFlower][plate]));
			    				
			    				if (flowers[currentFlower][plate].fire == null) {
			    					flowers[currentFlower][plate].fire = util.processDurationTime(flowers[currentFlower][plate].duration);
									localStorage.setItem("flowers", JSON.stringify(flowers));
			    				    if (!slowAnimated) {
			    				    	slowAnimated = true;
			    				    	animationSlow(context);
			    				    }			    					
			    				}
		    				}
		    				else {
			    				util.resetAdd(currentFlower, plate);
			            		animate_screens(screens.addColor, util.copy(animations.screens.multiplier));
		    				}
	    				}
	    			}
	    		}
	    		
	    		wasDragged = false;
	    		wasHeld = false;
    		}

    	    // Screen: addColor
    		if (animations.screens.multiplier[screens.addColor].toFixed(3) == 1) {	
    			if (touchX >= 130 && touchX < 230 && touchY >= 300 && touchY < 340) {
    				if (addPlate.color != null) {
    					animate_screens(screens.addType, util.copy(animations.screens.multiplier));
    				}
    			}
    			else {
    				addPlate.color = util.addPlateFromCoords(touchX, touchY);
        			drawUI(context);
    			}
    		}

    	    // Screen: addType
    		if (animations.screens.multiplier[screens.addType].toFixed(3) == 1) {	
    			if (touchX >= 130 && touchX < 230 && touchY >= 300 && touchY < 340) {
    				if (addPlate.type != null) {
    					animate_screens(screens.addDuration, util.copy(animations.screens.multiplier));
    				}
    			}
    			else {
    				addPlate.type = util.addPlateFromCoords(touchX, touchY);
        			drawUI(context);
    			}
    		}

    	    // Screen: addDuration
    		if (animations.screens.multiplier[screens.addDuration].toFixed(3) == 1) {	
    			if (touchX >= 130 && touchX < 230 && touchY >= 300 && touchY < 340 && !wasDragged) {
    				listOffset = 0;
					animate_screens(screens.addContacts, util.copy(animations.screens.multiplier));
    			}
	    		wasDragged = false;
    		}

    	    // Screen: addContacts
    		if (animations.screens.multiplier[screens.addContacts].toFixed(3) == 1) {	
    			
    			if (!wasDragged) {
	    			var i;
	    			if (touchX >= 130 && touchX < 230 && touchY >= 300 && touchY < 340) {
	    				var contactExists = false;
	    				for (i = 0; i < contacts.length; i += 1) {
	    					contactExists = contactExists || contacts[i].sel;
	    				}
	    				if (contactExists) {
		    				util.addPlate();
							animate_screens(screens.flowers, util.copy(animations.screens.multiplier));
	    				}
	    			}
	    			
	    			for (i = 0; i < contacts.length; i +=1) {
	        			if (touchX >= 280 && touchX < 320 && touchY >= 86 + i*48 + listOffset && touchY < 126 + i*48 + listOffset) {
	        				contacts[i].sel = !contacts[i].sel;
	            			drawUI(context);
	        			}
	    			}
    			}
	    		wasDragged = false;	    		
    		}

    	    // Screen: edit
    		if (animations.screens.multiplier[screens.edit].toFixed(3) == 1) {	
    			if (!wasHeld) {
	    			if (touchX >= 100 && touchX < 260 && touchY >= 127 && touchY < 185) {
	            		animate_screens(screens.addColor, util.copy(animations.screens.multiplier));
	    			} 		
	
	    			else if (touchX >= 100 && touchX < 260 && touchY >= 195 && touchY < 253) {
	    				flowers[addPlate.flower][addPlate.plate] = null;
	            		animate_screens(screens.flowers, util.copy(animations.screens.multiplier));
	    			} 	
    			}
    			wasHeld = false;
    		}

    	    // Screen: contacts
    		if (animations.screens.multiplier[screens.contacts].toFixed(3) == 1) {	
    			if (!wasDragged && touchX >= 140 && touchX < 220 && touchY >= 300 && touchY < 340) {
    				contact = "";
					animate_screens(screens.contactsAdd, util.copy(animations.screens.multiplier));
    			}
	    		wasDragged = false;	    		
    		}
    		
    	    // Screen: contactsAdd
    		if (animations.screens.multiplier[screens.contactsAdd].toFixed(3) == 1) {	
    			
    			if (touchX >= 130 && touchX < 230 && touchY >= 119 && touchY < 163 && contact.length == 8) {
    				//TODO: Add invite code here!
    				showMessage("Invited!");
					animate_screens(screens.contacts, util.copy(animations.screens.multiplier));
    			}
    			
    			if (contact.length < 8) {
    				if (touchX >= 50 && touchX < 102 && touchY >= 170 && touchY < 230) {
    					util.typeContact(context, "7");
	    			}
    				else if (touchX >= 50 && touchX < 102 && touchY >= 230 && touchY < 290) {
    					util.typeContact(context, "0");
	    			}
    				
    				else if (touchX >= 102 && touchX < 154 && touchY >= 200 && touchY < 260) {
    					util.typeContact(context, "4");
	    			}
    				else if (touchX >= 102 && touchX < 154 && touchY >= 260 && touchY < 320) {
    					util.typeContact(context, "1");
	    			}
    				
    				else if (touchX >= 154 && touchX < 206 && touchY >= 170 && touchY < 230) {
    					util.typeContact(context, "8");
	    			}
    				else if (touchX >= 154 && touchX < 206 && touchY >= 230 && touchY < 290) {
    					util.typeContact(context, "5");
	    			}
    				else if (touchX >= 154 && touchX < 206 && touchY >= 290 && touchY < 350) {
    					util.typeContact(context, "2");
	    			}
    				
    				else if (touchX >= 206 && touchX < 258 && touchY >= 200 && touchY < 260) {
    					util.typeContact(context, "6");
	    			}
    				else if (touchX >= 206 && touchX < 258 && touchY >= 260 && touchY < 320) {
    					util.typeContact(context, "3");
	    			}
    				
    				else if (touchX >= 258 && touchX < 310 && touchY >= 170 && touchY < 230) {
    					util.typeContact(context, "9");
	    			}
    			}
    			
    			if (contact.length > 0) {
    				if (touchX >= 258 && touchX < 310 && touchY >= 230 && touchY < 290) {
    					contact = contact.slice(0, -1);
    					drawUI(context);
	    			}
    			}
			}
    		
    	});
    });
    
    document.addEventListener( 'tizenhwkey', function(e) {
		if (e.keyName == "back") {
			
    	    // Screen: login
    		if (animations.screens.multiplier[screens.login].toFixed(3) == 1) {	
    			try {
    				tizen.application.getCurrentApplication().exit();
				} 
    			catch (ignore) {
				}
    		}
			
    	    // Screen: flowers
    		if (animations.screens.multiplier[screens.flowers].toFixed(3) == 1) {	
    			try {
    				tizen.application.getCurrentApplication().exit();
				} 
    			catch (ignore) {
				}
    		}
    		
    		// Screen: addColor
    		if (animations.screens.multiplier[screens.addColor].toFixed(3) == 1) {	
        		animate_screens(screens.flowers, util.copy(animations.screens.multiplier));
    		}
    		
    		// Screen: addType
    		if (animations.screens.multiplier[screens.addType].toFixed(3) == 1) {	
        		animate_screens(screens.addColor, util.copy(animations.screens.multiplier));
    		}
    		
    		// Screen: addDuration
    		if (animations.screens.multiplier[screens.addDuration].toFixed(3) == 1) {	
        		animate_screens(screens.addType, util.copy(animations.screens.multiplier));
    		}    
    		
    		// Screen: addContacts
    		if (animations.screens.multiplier[screens.addContacts].toFixed(3) == 1) {	
        		animate_screens(screens.addDuration, util.copy(animations.screens.multiplier));
    		}  		
    		
    		// Screen: edit
    		if (animations.screens.multiplier[screens.edit].toFixed(3) == 1) {	
        		animate_screens(screens.flowers, util.copy(animations.screens.multiplier));
    		}  			
    		
    		// Screen: contacts
    		if (animations.screens.multiplier[screens.contacts].toFixed(3) == 1) {	
        		animate_screens(screens.flowers, util.copy(animations.screens.multiplier));
    		} 			
    		
    		// Screen: contactsAdd
    		if (animations.screens.multiplier[screens.contactsAdd].toFixed(3) == 1) {	
        		animate_screens(screens.contacts, util.copy(animations.screens.multiplier));
    		} 	
		}			
	});
    
    document.addEventListener( 'rotarydetent', function(e) {
    	/* Get the direction value from the event */
	    var direction = e.detail.direction;

	    // Screen: addDuration
		if (animations.screens.multiplier[screens.addDuration].toFixed(3) == 1) {	
		    if (direction == "CW") {
		    	addPlate.duration += 5;
	    		if (addPlate.duration > 60) {
	    			addPlate.duration = 60;
	    		}
		    }
		    else if (direction == "CCW") {
		    	addPlate.duration -= 5;
	    		if (addPlate.duration < 5) {
	    			addPlate.duration = 5;
	    		}
		    }
			drawUI(context);
		}
	});
}(tau));
