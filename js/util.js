/*global window, document, tizen, console, setTimeout, tau */

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