if (typeof com == "undefined") {
    var com = {};
}

com.sppad = com.sppad || {};
com.sppad.scrollprogress = com.sppad.scrollprogress || {};

com.sppad.scrollprogress.Appearance = new function() {
	
	let self = this;
    self.prefs = com.sppad.scrollprogress.CurrentPrefs;
	  
    this.handleEvent = function(aEvent) {
        switch (aEvent.type) {
            case com.sppad.scrollprogress.Preferences.EVENT_PREFERENCE_CHANGED:
                self.prefChanged(aEvent.name, aEvent.value);
                break;
            default:
            	break;
        }
    };

    this.prefChanged = function(name, value) {
        switch (name) {
            case 'position':
            case 'verticalOffset':
            case 'horizontalOffset':
                this.setPosition();
                break;
            case 'fontSize':
            	self.node.style.fontSize = value + "%";
            	break;
            case 'fontWeight':
            	self.node.style.fontWeight = value;
            	break;
            case 'color':
            	self.node.style.color = value;
            	break;
            case 'opacity':
            	self.node.style.opacity = (value / 100);
            	break;
            case 'textShadowWidth':
            case 'textShadowColor':
            	self.setTextShadow();
            	break;
            default:
                break;
        }
    };
    
    this.setTextShadow = function() {
    	let posWidth = self.prefs.textShadowWidth + "px ";
    	let negWidth = -self.prefs.textShadowWidth + "px ";
    	let color = self.prefs.textShadowColor;

    	let textShadow = '';
    	textShadow += negWidth + negWidth + "0 " + color + ", ";
    	textShadow += posWidth + negWidth + "0 " + color + ", ";
    	textShadow += negWidth + posWidth + "0 " + color + ", ";
    	textShadow += posWidth + posWidth + "0 " + color;
    	
    	self.node.style.textShadow = textShadow;
    };
    
    this.setPosition = function() {
    	self.node.style.top = '';
    	self.node.style.right = '';
    	self.node.style.bottom = '';
    	self.node.style.left = '';
    	
    	let vertical = /bottom/.test(self.prefs.position) ? 'bottom' : 'top';
    	let horizontal = /left/.test(self.prefs.position) ? 'left' : 'right';
    		
    	self.node.style[vertical] = self.prefs.verticalOffset + "px";
    	self.node.style[horizontal] = self.prefs.horizontalOffset + "px";
    };
    
	
    this.loadPreferences = function() {
        let prefs = ['position',
                     'fontSize',
                     'fontWeight',
                     'textShadowWidth',
                     'color',
                     'opacity'];
        
        prefs.forEach(function(pref) {
            self.prefChanged(pref, com.sppad.scrollprogress.CurrentPrefs[pref]);
        });
    };
	
	
	this.setup = function() {
        com.sppad.scrollprogress.Preferences.addListener(this, com.sppad.scrollprogress.Preferences.EVENT_PREFERENCE_CHANGED);

		self.node = document.getElementById('com_sppad_scrollProgress');
        self.loadPreferences();
	};
}