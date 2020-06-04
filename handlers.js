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