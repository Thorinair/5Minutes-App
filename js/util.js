/*global window, document, tizen, console, setTimeout, tau, addPlate, colors, flowers, contacts, types, drawUI, user, code, pass, loggingIn, sending, animationSlow, slowAnimated, currentFlower, contact, web, animate_screens, animate_startup, animations, screens, showMessage, notifications */

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
    var plateid = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var i;
    for(i = 0; i < 8; i += 1) {
    	plateid += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
	var newPlate = {
			"type": types[addPlate.type].val, 
			"color": colors[addPlate.color].val, 
			"duration": addPlate.duration, 
			"message": util.translateType(addPlate.type) + " in " + addPlate.duration + " minutes.", 
			"contacts": [], 
			"fire": null,
			"plateid": plateid,
			"accepted": 0}; 
	
    for (i = 0; i < contacts.length; i += 1) {
    	if (contacts[i].sel) {
    		newPlate.contacts.push(contacts[i].id);
    	}
    }
    
	flowers[addPlate.flower][addPlate.plate] = util.copy(newPlate);
	
	localStorage.setItem("flowers", JSON.stringify(flowers));
};

/*
 * Loads account data from storage.
 */
util.loadAccount = function() {
	user = localStorage.getItem("user");
    pass = localStorage.getItem("pass");
};

/*
 * Saves account data to storage.
 */
util.saveAccount = function() {
	localStorage.setItem("user", user);
	localStorage.setItem("pass", pass);
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
 * Types into the login field.
 * @param ctx Context to draw the UI in.
 * @param char Character to type.
 */
util.typeCode = function(ctx, char) {
    'use strict';
    code += char;
	drawUI(ctx);
};

/*
 * Types into the contact field.
 * @param ctx Context to draw the UI in.
 * @param char Character to type.
 */
util.typeContact = function(ctx, char) {
    'use strict';
    contact += char;
	drawUI(ctx);
};

/*
 * Processes duration to return fire time.
 * @param duration Total duration.
 * @return Fire time in JSON.
 */
util.processDurationTime = function(duration) {
    'use strict';
	var fire = new Date((new Date()).getTime() + duration * 60000);
	return fire.toJSON();
};

/*
 * Processes fire time to return time left.
 * @param fire Time to fire in JSON.
 * @return Time left in seconds.
 */
util.processFireTime = function(fire) {
    'use strict';
    var left = ((new Date(fire)).getTime() - (new Date()).getTime()) / 1000;
	return left;
};

/*
 * Checks the flowers array if there are any pending fires.
 * @return Boolean if there are any fires.
 */
util.checkForFires = function() {
    'use strict';
	var check = false;
	var i, j;
	for (i = 0; i < flowers.length; i += 1) {
		for (j = 0; j < flowers[i].length; j += 1) {
			if (flowers[i][j] != null) {
				if (flowers[i][j].fire != null) {
					if (util.processFireTime(flowers[i][j].fire) <= 0) {
						flowers[i][j].fire = null;
						localStorage.setItem("flowers", JSON.stringify(flowers));
					}
					else {
						check = true;
					}
				}
			}
		}
	}
	return check;
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

/*
 * Fired when Push notification is received.
 * @param notification Object of the notification.
 */
function pushCallbackNotification(notification) {
    'use strict';
	//console.log("Alert: " + notification.alertMessage);
	//console.log("Data: " + notification.appData);
	notifications.push(JSON.parse(notification.appData));
	navigator.vibrate(1000);
	animate_screens(screens.notifications, util.copy(animations.screens.multiplier));
}

/*
 * Fired when Push returns an error.
 * @param response Response of the error.
 */
function pushCallbackError(response) {
    'use strict';
    //console.log('The following error occurred: ' +  response.name);
	showMessage("Push server error.");
	loggingIn = false;
}

/*
 * Fired when Push notification successfully registers.
 * @param regID ID of the registration.
 */
function pushCallbackSuccess(regID) {
    'use strict';
	//console.log("Registration succeeded with id: " + regID);
    tizen.push.connectService(pushCallbackNotification, pushCallbackError);
	util.webUpdatePush(regID);
}

/*
 * Logs the user out, usually when the session expires.
 * @param message Message to show.
 */
util.logout = function(message) {
    'use strict';
	showMessage(message);
	loggingIn = false;
	code = "";
	user = "";
	pass = "";
	util.saveAccount();
	animate_screens(screens.login, util.copy(animations.screens.multiplier));
};

/*
 * Closes the application on network error.
 * @param message Message to show.
 */
util.close = function(message) {
    'use strict';
	showMessage(message);
	loggingIn = false;
	window.setTimeout(function() {
		try {
			tizen.application.getCurrentApplication().exit();
		} 
		catch (ignore) {
		}
	}, 2000);
};

/*
 * Fetches the regID of Push.
 */
util.getPushID = function() {
    'use strict';
    var pushService = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/push_test");
    tizen.push.registerService(pushService, pushCallbackSuccess, pushCallbackError);
};

/*
 * Sends a POST request for onetime login.
 */
util.webOnetime = function() {	
    'use strict';
	
	showMessage("Logging in...");
	loggingIn = true;
    
	var param = "request=onetime&code=" + code;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				
				//console.log("webOnetime:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "onetime_okay") {
					user = response.user;
					pass = response.pass;
					util.saveAccount();
				    util.getPushID();
				}
				else if (response.response == "onetime_incorrect") {
					util.logout("Incorrect code.");
				}
				else if (response.response == "db_error") {
					util.logout("Database error.");
				}
				else {
					util.logout("Server error.");
				}
			    
			} 
			else {  
				util.logout("Connection error.");
			}  
		}  
	};
	
	xhr.send(param);
};

/*
 * Sends a POST request to update the regID of Push.
 * @param regID ID of the registration.
 */
util.webUpdatePush = function(regID) {
    'use strict';

	showMessage("Logging in...");
	loggingIn = true;
	
	var param = "request=update_push&user=" + user + "&pass=" + pass + "&push=" + regID;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				
				//console.log("webUpdatePush:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "update_push_okay") {
					util.webContactGetList();
				}
				else if (response.response == "update_push_expired") {
					util.logout("Login expired.");
				}
				else if (response.response == "db_error") {
					util.close("Database error.");
				}
				else {
					util.close("Server error.");
				}
			    
			} 
			else {  
				util.close("Connection error.");
			}  
		}  
	};
	
	xhr.send(param);
};

/*
 * Sends a POST request to get the contact list.
 */
util.webContactGetList = function() {
    'use strict';

	showMessage("Logging in...");
	loggingIn = true;
	
	var param = "request=contact_get_list&user=" + user + "&pass=" + pass;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				
				//console.log("webContactGetList:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "contact_get_list_okay") {
					
					var newContacts = [];
					
					var i;
					for (i = 0; i < response.contacts.length; i += 1) {
						var newContact = {
								"id": response.contacts[i].id,
								"name": response.contacts[i].firstname + " " + response.contacts[i].lastname,
								"sel": false
						};
						newContacts.push(newContact);
					}
					
					contacts = newContacts;
					
					showMessage("Success!");
					loggingIn = false;
					animate_screens(screens.flowers, util.copy(animations.screens.multiplier));
		    		window.setTimeout(function() {
		    			tizen.push.getUnreadNotifications();
		    			animate_startup();
					}, 500);
				}
				else if (response.response == "contact_get_list_expired") {
					util.logout("Login expired.");
				}
				else {
					showMessage("Error fetching contacts.");
					loggingIn = false;
					animations.screens.reference = animate_screens(screens.flowers, util.copy(animations.screens.multiplier));
		    		window.setTimeout(function() {
		    			tizen.push.getUnreadNotifications();
		    			animate_startup();
					}, 500);
				}
			    
			} 
			else {  
				showMessage("Error fetching contacts.");
				loggingIn = false;
				animate_screens(screens.flowers, util.copy(animations.screens.multiplier));
	    		window.setTimeout(function() {
	    			tizen.push.getUnreadNotifications();
	    			animate_startup();
				}, 500);
			}  
		}  
	};
	
	xhr.send(param);
};

/*
 * Sends a POST request to get the contact list, this is fired when opening the list.
 * @param type Type of the contact screen to load.
 */
util.webContactGetListUpdate = function(type) {
    'use strict';

	showMessage("Loading contacts...");
	
	var param = "request=contact_get_list&user=" + user + "&pass=" + pass;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				
				//console.log("webContactGetListUpdate:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "contact_get_list_okay") {
					
					var newContacts = [];
					
					var i;
					for (i = 0; i < response.contacts.length; i += 1) {
						var newContact = {
								"id": response.contacts[i].id,
								"name": response.contacts[i].firstname + " " + response.contacts[i].lastname,
								"sel": false
						};
						newContacts.push(newContact);
					}
					
					contacts = newContacts;
					
    				listOffset = 0;
    				if (type == "main") {
                		animate_screens(screens.contacts, util.copy(animations.screens.multiplier));
    				}
    				else if (type == "plate") {
    					animate_screens(screens.addContacts, util.copy(animations.screens.multiplier));
    				}
				}
				else if (response.response == "contact_get_list_expired") {
					util.logout("Login expired.");
				}
				else {
					showMessage("Error updating contacts.");
					
    				listOffset = 0;
    				if (type == "main") {
                		animate_screens(screens.contacts, util.copy(animations.screens.multiplier));
    				}
    				else if (type == "plate") {
    					animate_screens(screens.addContacts, util.copy(animations.screens.multiplier));
    				}
				}
			    
			} 
			else {  
				showMessage("Error updating contacts.");
				
				listOffset = 0;
				if (type == "main") {
            		animate_screens(screens.contacts, util.copy(animations.screens.multiplier));
				}
				else if (type == "plate") {
					animate_screens(screens.addContacts, util.copy(animations.screens.multiplier));
				}
			}  
		}  
	};
	
	xhr.send(param);
};

/*
 * Sends a POST request when adding a contact.
 */
util.webContactRequest = function() {
    'use strict';	
    
	var param = "request=contact_request&user=" + user + "&pass=" + pass + "&contact=" + parseInt(contact);
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				
				//console.log("webContactRequest:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "contact_request_okay") {
					showMessage("Contact request sent.");
				}
				else if (response.response == "contact_request_self") {
					showMessage("Cannot invite yourself.");
				}
				else if (response.response == "contact_request_miss") {
					showMessage("User doesn't exist.");
				}
				else if (response.response == "contact_request_already") {
					showMessage("Contact already added.");
				}
				else if (response.response == "contact_request_expired") {
					util.logout("Login expired.");
				}
				else {
					showMessage("Error sending contact request.");
				}
			    
			} 
			else {  
				showMessage("Error sending contact request.");
			}  
		}  
	};
	
	xhr.send(param);
};

/*
 * Sends a POST request when rejecting a contact.
 * @param reject Contact that should be notified about rejection.
 */
util.webContactReject = function(reject) {
    'use strict';	
    
	var param = "request=contact_reject&user=" + user + "&pass=" + pass + "&contact=" + reject;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				
				//console.log("webContactReject:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "contact_reject_okay") {
				}
				else if (response.response == "contact_reject_expired") {
					util.logout("Login expired.");
				}
				else {
					showMessage("Error rejecting.");
				}
			    
			} 
			else {  
				showMessage("Error rejecting.");
			}  
		}  
	};
	
	xhr.send(param);
};

/*
 * Sends a POST request when accepting a contact.
 * @param accept Contact that should be notified about accepting.
 */
util.webContactAccept = function(accept) {
    'use strict';	
    
	var param = "request=contact_accept&user=" + user + "&pass=" + pass + "&contact=" + accept;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				
				//console.log("webContactAccept:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "contact_accept_okay") {
					showMessage("Request accepted.");
				}
				else if (response.response == "contact_accept_expired") {
					util.logout("Login expired.");
				}
				else {
					showMessage("Error accepting.");
				}
			    
			} 
			else {  
				showMessage("Error accepting.");
			}  
		}  
	};
	
	xhr.send(param);
};

/*
 * Sends a POST request when sending a message.
 * @param message Message object to send.
 * @param plate ID of the plate.
 */
util.webPushMessage = function(message, plate) {
    'use strict';	
    sending = true;
	showMessage("Sending...");
    
	var param = "request=push_message&user=" + user + "&pass=" + pass +
		"&type=" + message.type + 
		"&color=" + message.color.substring(1) +
		"&duration=" + message.duration +
		"&message=" + encodeURIComponent(message.message) +
		"&plateid=" + message.plateid + 
		"&contacts=" + message.contacts.join();
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				//console.log("webPushMessage:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "push_message_okay") {
					showMessage("Message sent!");
					flowers[currentFlower][plate].accepted = 0;
					flowers[currentFlower][plate].fire = util.processDurationTime(flowers[currentFlower][plate].duration);
					localStorage.setItem("flowers", JSON.stringify(flowers));
				    if (!slowAnimated) {
				    	slowAnimated = true;
				    	animationSlow(context);
				    }
				    sending = false;
				}
				else if (response.response == "push_message_expired") {
					util.logout("Login expired.");
				    sending = false;
				}
				else {
					showMessage("Error sending.");
				    sending = false;
				}
			    
			} 
			else {  
				showMessage("Error sending.");
			    sending = false;
			}  
		}  
	};
	
	xhr.send(param);
};

/*
 * Sends a POST request when declining an event.
 * @param decline Contact that should be notified about declining.
 * @param message Original message that was sent.
 * @param plateid ID of the original sending plate.
 */
util.webEventDecline = function(decline, message, plateid) {
    'use strict';	
    
	var param = "request=event_decline&user=" + user + "&pass=" + pass + 
		"&contact=" + decline + 
		"&message=" + encodeURIComponent(message) + 
		"&plateid=" + plateid;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				
				//console.log("webEventDecline:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "event_decline_okay") {
				}
				else if (response.response == "event_decline_expired") {
					util.logout("Login expired.");
				}
				else {
					showMessage("Error declining.");
				}
			    
			} 
			else {  
				showMessage("Error declining.");
			}  
		}  
	};
	
	xhr.send(param);
};

/*
 * Sends a POST request when accepting an event.
 * @param accept Contact that should be notified about accepting.
 * @param message Original message that was sent.
 * @param plateid ID of the original sending plate.
 */
util.webEventAccept = function(accept, message, plateid) {
    'use strict';	
    
	var param = "request=event_accept&user=" + user + "&pass=" + pass +
		"&contact=" + accept + 
		"&message=" + encodeURIComponent(message) + 
		"&plateid=" + plateid;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", web, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.setRequestHeader("Header-Custom-TizenCORS", "OK");
	xhr.timeout = 5000;
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {  
			if (xhr.status === 200 || xhr.status === 0) {  
				
				//console.log("webEventAccept:" + xhr.responseText);
				var response = JSON.parse(xhr.responseText);
				if (response.response == "event_accept_okay") {
				}
				else if (response.response == "event_accept_expired") {
					util.logout("Login expired.");
				}
				else {
					showMessage("Error accepting.");
				}
			    
			} 
			else {  
				showMessage("Error accepting.");
			}  
		}  
	};
	
	xhr.send(param);
};