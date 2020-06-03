const popup = {
    /* Displays popup on screen with the given text, font and colour. */
    showText: (text, bgColour, textColour, textFont) => {

        document.documentElement.style.setProperty('--bgColour', bgColour);
        document.documentElement.style.setProperty('--textColour', textColour);
        document.documentElement.style.setProperty('--textFont', textFont);

        document.getElementById('popupbox').display = '';
        document.getElementById('popuptext').innerHTML = text;
        document.getElementById("popupbox").animate([{opacity: 0},{opacity:1}],{ duration: 500, easing: 'ease-in-out', fill: 'forwards'});   

        const textWidth = parseFloat(getComputedStyle(document.getElementById('popuptext'), null).width.replace("px", ""))
        document.getElementById('popupbox').style.setProperty('width', textWidth + 30 + 'px');

    },

    /* Removes popup from screen and resets state of all commands */
    delete: () => {
        spotlightUser = ""; // TODO: Remove this
        document.getElementById("popupbox").animate([{opacity: 1},{opacity:0}],{ duration: 500, easing: 'ease-in-out', fill: 'forwards'});   
    },
    
    /* Formats text */
    formatMessage: (message, makeUpperCase) => {

        //parse the message for html and remove any tags
        if (makeUpperCase) {
            message = message.toUpperCase();
        }

        return message;
    }
}