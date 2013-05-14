if (typeof com == "undefined") {
    var com = {};
}

com.sppad = com.sppad || {};
com.sppad.scrollprogress = com.sppad.scrollprogress || {};

com.sppad.scrollprogress.Main = new function() {
    
    const SCROLL_UPDATE_PERIOD = 100;
    
    var self = this;
    
    // Used to prevent resizing too often
    self.lastUpdateTime;
    
    // Used to schedule when the scroll progress should be updated
    self.scrollEventId;
    
    // The last zoom, used to detect if a resize event is due to zoom changing
    self.zoom = 1;
    
    this.showIndicator = function(value, source) {
    	 let indicator = document.getElementById('com_sppad_scrollProgress_label');
         indicator.setAttribute('value', value);
         
         let indicatorWrapper = document.getElementById('com_sppad_scrollProgress');
         indicatorWrapper.removeAttribute('com_sppad_scrollprogress_hide');
         indicatorWrapper.setAttribute('source', source);
         
         /*
          * Use the bottom of navigator-toolbox rather than the y position of browser
          * to handle the Toolbar Autohide add-on.
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
             indicatorWrapper.setAttribute('com_sppad_scrollprogress_hide', 'fadeout');    
         }, 1);	
    };
    
    this.showScrollIndicator = function() {
        let scrollY = content.scrollY;
        let scrollMaxY = content.scrollMaxY;
        
        // Nothing to do here
        if(scrollMaxY == 0)
            return;
        
        self.lastUpdateTime = Date.now();
        
        let percentage = Math.min(((scrollY / scrollMaxY) * 100).toFixed(), 100);
        self.showIndicator(percentage + "%", "com_sppad_scrollprogress_scroll");
    };
    
    this.showZoomIndicator = function() {
    	let docViewer = gBrowser.selectedBrowser.markupDocumentViewer;
    	
    	/* 
    	 * Resize event can be either from zoom or the window resizing. Make 
    	 * sure the event is due to the zoom changing.
    	 */
    	if(self.zoom == docViewer.fullZoom)
    		return;
    	
    	self.zoom = docViewer.fullZoom;
    	
        let percentage = self.zoom.toFixed(1);
        self.showIndicator("x" + percentage, "com_sppad_scrollprogress_zoom");
    };
    
    this.scroll = function(aEvent) {
        window.clearTimeout(self.scrollEventId);

        // Update at most once every 100 ms
        let timeSinceResize = Date.now() - self.lastUpdateTime;
        if (timeSinceResize > SCROLL_UPDATE_PERIOD)
            self.showScrollIndicator();
        else
            self.scrollEventId = window.setTimeout( function() { self.showScrollIndicator(); }, SCROLL_UPDATE_PERIOD - timeSinceResize);
    };
    
    this.resize = function(aEvent) {
    	self.showZoomIndicator();
    };
    
    this.handleEvent = function(aEvent) {

        switch (aEvent.type) {
            case 'scroll':
                this.scroll(aEvent);
                break;
            case 'resize':
                this.resize(aEvent);
                break;
        }
    };
    
    // nsIWebProgressListener
    this.QueryInterface = XPCOMUtils.generateQI(['nsIWebProgressListener', 'nsISupportsWeakReference']),
                        
    this.onLocationChange = function(aProgress, aRequest, aURI) {
    	/* 
    	 * Update the last scroll percentage when changing URLs, since it is 
    	 * a per-site preference. Do not want to trigger if the user simply
    	 * resizes the window after changing between two sites with different
    	 * zoom levels.
    	 */
    	let docViewer = gBrowser.selectedBrowser.markupDocumentViewer;
    	self.zoom = docViewer.fullZoom;
    };

    // Nothing to do for these
    this.onStateChange = function() {};
    this.onProgressChange = function() {};
    this.onStatusChange = function() {};
    this.onSecurityChange = function(aWebProgress, aRequest, aState) {};
    
    this.setup = function() {
        gBrowser.addProgressListener(this);
    	
        window.addEventListener('scroll', this, false);
        window.addEventListener('resize', this, false);
    };
};

window.addEventListener("load", function() {
    com.sppad.scrollprogress.Main.setup();
}, false);