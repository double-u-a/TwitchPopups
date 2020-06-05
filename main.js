// main

const opts = {channels: [twitchChannel],connection: {secure: true,reconnect: true}};

let actionHandlers = {};
let allHandlers = [];

// Create a client with our options defined at the top of the file
let client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {

    // Remove whitespace from chat message
    const command = msg.trim();

    let handlerName;
    if (command.indexOf(" ") > -1)
    {handlerName = command.substring(0, command.indexOf(" "));}
    else {handlerName = command;}

    console.log(handlerName);

    // Handle the rest of chat not using commands
    for (const handler of allHandlers) {if (handler.security(context, command)) {handler.handle(context, command);}}

    // Check all commands
    if (actionHandlers[handlerName] && actionHandlers[handlerName].security(context, command)) {actionHandlers[handlerName].handle(context, command);
    }
}

function onConnectedHandler(addr, port) {console.log(`* Connected to ${addr}:${port}`);}



// popup

const popup = {
    /* Displays popup on screen with the given text, font and colour. */
    showText: (text, bgColour, textColour, textFont) => {

        document.documentElement.style.setProperty('--bgColour', bgColour);
        document.documentElement.style.setProperty('--textColour', textColour);
        document.documentElement.style.setProperty('--textFont', textFont);

        document.getElementById('popupbox').display = '';
        document.getElementById('popuptext').innerHTML = text;
        document.getElementById("popupbox").animate([{opacity: 0},{opacity:1}],{ duration: 700, easing: 'ease-in-out', fill: 'forwards'});   

        const textWidth = parseFloat(getComputedStyle(document.getElementById('popuptext'), null).width.replace("px", ""))
        document.getElementById('popupbox').style.setProperty('width', textWidth + 30 + 'px');

    },

    /* Removes popup from screen */
    delete: () => {
        spotlightUser = ""; // TODO: Remove this
        document.getElementById("popupbox").animate([{opacity: 1},{opacity:0}],{ duration: 700, easing: 'ease-in-out', fill: 'forwards'});   
    },
    
    /* Formats text */
    formatMessage: (message, makeUpperCase) => {

        // uppercase text
        if (makeUpperCase) {
            message = message.toUpperCase();
        }

        return message;
    }
}



// Handlers

// Command: #alert <text>
// Description: will display whatever text comes after the !alert command
actionHandlers['#alert'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {
        const formattedText = popup.formatMessage(textContent, makeAlertUpperCase).substr(7);
        popup.showText(formattedText, alertBg, alertTextColour, textFont);
    }
};


// Command: ###
// Description: This delete command resets the whole pop up system
actionHandlers['###'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {
        popup.delete();
        // TODO : loop through objects calling its own state reset function
    }
};


// Command: #spot
// Description: spotlight [@username]: will display the chat of the specified user from that point on
var spotlightUser = "";

actionHandlers['#spot'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {
        spotlightUser = textContent.substr(12).toLowerCase();
        popup.showText(`${spotlightEmoji} Welcome ${spotlightUser} to the stage!`, spotlightBg, spotlightTextColour,textFont);
    }
};

// This handler is fired when the spotlighted user types something in chat
allHandlers.push({
    security: (context, textContent) => {
        return context.username === spotlightUser && (!textContent.startsWith('@') || textContent.startsWith('@' + twitchChannel))
    },
    handle: (context, textContent) => {
        const formattedText = popup.formatMessage(textContent);
        console.log(formattedText);
        popup.showText(`${spotlightEmoji} ${context['display-name']}: ${formattedText}`, spotlightBg, spotlightTextColour,textFont);
    }
});