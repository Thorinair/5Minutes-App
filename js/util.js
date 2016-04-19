/*global window, document, tizen, console, setTimeout, tau, addPlate, colors, flowers, contacts, types */

var util = function(){
    'use strict';
    };

util.fps = 60;

/*
 * Converts degrees to radians.
 * @param deg Degrees input.
 * @return Returns radians.
 */
util.rad = function(deg) {
    'use strict';
    return deg * Math.PI / 180;
};

/*
 * Calculates sign prefix of a number.
 * @param x Number to use.
 * @return Returns -1 or 1.
 */
util.sign = function(x) {
    'use strict';
    return x < 0 ? -1 : 1;
};

/*
 * Copies an object instead of using a reference.
 * @param source The original object.
 * @return Returns new copied object.
 */
util.copy = function(source) {
    'use strict';
	return JSON.parse(JSON.stringify(source));
};

/*
 * Based on current flower, returns the previous one.
 * @param flower The flower from which to return the previous one.
 * @return The previous flower.
 */
util.flowerPrev = function(flower) {
    'use strict';
	flower -= 1;
	if (flower <= -1) {
		flower = 3;
	}
	return flower;
};

/*
 * Based on current flower, returns the next one.
 * @param flower The flower from which to return the next one.
 * @return The next flower.
 */
util.flowerNext = function(flower) {
    'use strict';
	flower += 1;
	if (flower >= 4) {
		flower = 0;
	}
	return flower;
};

/*
 * Calculates which plate was tapped on the flower, based on coordinates.
 * @param x X coordinate of the tap.
 * @param y Y coordinate of the tap.
 * @return Plate ID. Returns -1 if outside of plate.
 */
util.plateFromCoords = function(x, y) {
    'use strict';
var plate;
    
	if (x >= 48 && x < 132 && y >= 141 && y < 219) { 		plate = 0; }
	else if (x >= 93 && x < 177 && y >= 63 && y < 141) { 	plate = 1; }
	else if (x >= 183 && x < 267 && y >= 63 && y < 141) { 	plate = 2; }
	else if (x >= 228 && x < 312 && y >= 141 && y < 219) { 	plate = 3; }
	else if (x >= 183 && x < 267 && y >= 219 && y < 297) { 	plate = 4; }
	else if (x >= 93 && x < 177 && y >= 219 && y < 297) { 	plate = 5; }
	else { 													plate = null; }
	
	return plate;
};

/*
 * Calculates which plate was tapped on the adding screen, based on coordinates.
 * @param x X coordinate of the tap.
 * @param y Y coordinate of the tap.
 * @return Plate ID. Returns -1 if outside of plate.
 */
util.addPlateFromCoords = function(x, y) {
    'use strict';
    var plate;
    
	if (x >= 60 && x < 120 && y >= 123 && y < 175) { 		plate = 0; }
	else if (x >= 120 && x < 180 && y >= 123 && y < 175) { 	plate = 1; }
	else if (x >= 180 && x < 240 && y >= 123 && y < 175) { 	plate = 2; }
	else if (x >= 240 && x < 300 && y >= 123 && y < 175) { 	plate = 3; }

	else if (x >= 270 && x < 330 && y >= 175 && y < 225) { 	plate = 4; }
	else if (x >= 210 && x < 270 && y >= 175 && y < 225) { 	plate = 5; }
	else if (x >= 150 && x < 210 && y >= 175 && y < 225) { 	plate = 6; }
	else if (x >= 90 && x < 150 && y >= 175 && y < 225) { 	plate = 7; }
	else if (x >= 30 && x < 90 && y >= 175 && y < 225) { 	plate = 8; }

	else if (x >= 60 && x < 120 && y >= 225 && y < 277) { 	plate = 9; }
	else if (x >= 120 && x < 180 && y >= 225 && y < 277) { 	plate = 10; }
	else if (x >= 180 && x < 240 && y >= 225 && y < 277) { 	plate = 11; }
	else if (x >= 240 && x < 300 && y >= 225 && y < 277) { 	plate = 12; }
	
	else { 													plate = null; }
	
	return plate;
};

/*
 * Resets the addPlate back to original state.
 * @param flower Current flower.
 * @param plate Plate ID to add.
 */
util.resetAdd = function(flower, plate) {
    'use strict';
    addPlate.flower = flower;
    addPlate.plate = plate; 
    addPlate.color = null; 
    addPlate.type = null;
    addPlate.duration = 5; 
    addPlate.message = null;
    addPlate.fire = null;
    addPlate.title = "New";
    
    var i;
    for (i = 0; i < contacts.length; i += 1) {
    	contacts[i].sel = false;
    }
};

/*
 * Loads a plate from the list.
 * @param flower Current flower.
 * @param plate Plate ID to load.
 */
util.loadPlate = function(flower, plate) {
    'use strict';
    addPlate.flower = flower;
    addPlate.plate = plate;
    addPlate.color = util.translateColorBack(flowers[flower][plate].color);
    addPlate.type = util.translateTypeBack(flowers[flower][plate].type);
    addPlate.duration = flowers[flower][plate].duration;
    addPlate.message = flowers[flower][plate].message; 
    addPlate.fire = flowers[flower][plate].fire;
    addPlate.title = "Edit";
    
    var i, j;
    for (i = 0; i < contacts.length; i += 1) {
    	contacts[i].sel = false;
    	for (j = 0; j < flowers[flower][plate].contacts.length; j += 1) {
    		if (contacts[i].id == flowers[flower][plate].contacts[j]) {
    			contacts[i].sel = true;
    		}
    	}
    }
};

/*
 * Adds a new plate to list.
 */
util.addPlate = function() {
    'use strict';
	var newPlate = {
			"type": types[addPlate.type].val, 
			"color": colors[addPlate.color].val, 
			"duration": addPlate.duration, 
			"message": util.translateType(addPlate.type) + " in " + addPlate.duration + " minutes.", 
			"contacts": [], 
			"fire": null}; 
	
    var i;
    for (i = 0; i < contacts.length; i += 1) {
    	if (contacts[i].sel) {
    		newPlate.contacts.push(contacts[i].id);
    	}
    }
    
	flowers[addPlate.flower][addPlate.plate] = util.copy(newPlate);
	
	localStorage.setItem("flowers", JSON.stringify(flowers));
};

/*
 * Translates an input number to color name.
 * @param id ID of the color.
 */
util.translateColor = function(id) {
    'use strict';
	var color;
	
	if (id != null) {
		color = colors[id].name;
	}
	else {
		color = "None";
	}
	
	return color;
};

/*
 * Translates an input color to number.
 * @param color The color in hex.
 */
util.translateColorBack = function(color) {
    'use strict';
	var id;
	
	var i;
	for (i = 0; i < colors.length; i += 1) {
		if (colors[i].val == color) {
			id = i;
			break;
		}
	}
	
	return id;
};

/*
 * Translates an input number to type name.
 * @param id ID of the type.
 */
util.translateType = function(id) {
    'use strict';
	var type;
	
	if (id != null) {
		type = types[id].name;
	}
	else {
		type = "None";
	}
	
	return type;
};

/*
 * Translates an input type to number.
 * @param type The type name.
 */
util.translateTypeBack = function(type) {
    'use strict';
	var id;
	
	var i;
	for (i = 0; i < types.length; i += 1) {
		if (types[i].val == type) {
			id = i;
			break;
		}
	}
	
	return id;
};

/*
 * Performs a frame step for transition of a variable.
 * @param value Variable to transition.
 * @param type Type of transition. Check function body for list.
 * @param start Starting value to fade from.
 * @param end Value to fade to.
 * @param duration Duration of the transition in ms.
 * @return Returns new value of the variable after one frame.
 */
util.trans = function(value, type, start, end, duration) {
    'use strict';
	//console.log("trans type: " + type + ", start: " + start + ", end: " + end + ", current: " + value);

    if (!(((end - start) >= 0 && value.toFixed(3) >= end) || ((end - start) <= 0 && value.toFixed(3) <= end))) {
    	var steps = (duration / 1000) * util.fps; 
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
};