if (typeof com == "undefined") {
    var com = {};
}

com.sppad = com.sppad || {};
com.sppad.scrollprogress = com.sppad.scrollprogress || {};

com.sppad.scrollprogress.Main = new function() {
    
    const SCROLL_UPDATE_PERIOD = 100;
    
    var self = this;
    
    // Used to prevent resizing too often
    self._lastUpdateTime;
    
    // Tracks timeout scroll
    self._scrollEventId;
    
    this.showIndicator = function() {
        
        self._lastUpdateTime = Date.now();
        
        let scrollY = content.scrollY;
        let scrollMaxY = content.scrollMaxY;
        let percentage = ((scrollY / scrollMaxY) * 100).toFixed();
        
        // Nothing to do here
        if(scrollMaxY == 0)
            return;
        
        let indicator = document.getElementById('com_sppad_scrollProgress_label');
        indicator.setAttribute('value', percentage + "%");
        
        let indicatorWrapper = document.getElementById('com_sppad_scrollProgress');
        indicatorWrapper.style.transitionDuration = "";
        indicatorWrapper.style.transitionDelay = "";
        indicatorWrapper.removeAttribute('hide');
        
        /**
         * Use the bottom of navigator-toolbox rather than the y position of browser
         * to handle Fullscreen Toolbar Hover addon.
         */
        let navbar = document.getElementById('navigator-toolbox');
        let yOffset = navbar.boxObject.y + navbar.boxObject.height;
        indicatorWrapper.style.top = yOffset + "px";
        
        /*
         * Want to make sure that the css rule for attribute removal (setting
         * opacity to visible state) triggers. If calls are back to back, it does
         * not work correctly. It appears to be okay when placed apart (a timing
         * thing?), but want to make sure it works correctly
         */
        setTimeout(function() {
            indicatorWrapper.style.transitionDuration = "0.3s";
            indicatorWrapper.style.transitionDelay = "0.4s";
            indicatorWrapper.setAttribute('hide', 'fadeout');    
        }, 1);
    };
    
    
    this.scroll = function(aEvent) {
        
        window.clearTimeout(self._scrollEventId);

        // Update at most once every 100 ms
        let timeSinceResize = Date.now() - self._lastUpdateTime;
        if (timeSinceResize > SCROLL_UPDATE_PERIOD)
            self.showIndicator();
        else
            self._scrollEventId = window.setTimeout( function() { self.showIndicator(); }, SCROLL_UPDATE_PERIOD - timeSinceResize);
    };
    
    this.handleEvent = function(aEvent) {

        switch (aEvent.type) {
            case 'scroll':
                this.scroll(aEvent);
                break;
        }
        
    };
    
    this.setup = function() {
        window.addEventListener('scroll', this, false);
    };
};

window.addEventListener("load", function() {
    com.sppad.scrollprogress.Main.setup();
}, false);