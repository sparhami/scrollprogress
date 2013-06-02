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
            case 'fontWeight':
            case 'color':
            case 'opacity':
            case 'backgroundColor':
            case 'padding':
            case 'borderStyle':
            case 'borderColor':
            case 'borderWidth':
            case 'borderRadius':
            case 'transitionDuration':
            	self.node.style[name] = self.getValue(name, value);
            	break;
            case 'textShadowWidth':
            case 'textShadowColor':
            	self.setTextShadow();
            	break;
            default:
                break;
        }
    };
    
    this.getValue = function(name, value) {
        switch (name) {
        	case 'padding':
        	case 'borderWidth':
        	case 'borderRadius':
        		return value + "px";
	        case 'fontSize':
	        	return value + "pt";
	        case 'opacity':
	        	return (value / 100);
	        case 'transitionDuration':
	        	return value + 'ms';
	        default:
	            return value;
	    }
    };
    
    this.setTextShadow = function() {
    	let textShadow = '';
    	let width = self.prefs.textShadowWidth;

    	if(width > 0) {
    	  	let posWidth = width + "px ";
        	let negWidth = -width + "px ";
        	let color = self.prefs.textShadowColor;
    		
        	textShadow += negWidth + negWidth + "0 " + color + ", ";
        	textShadow += posWidth + negWidth + "0 " + color + ", ";
        	textShadow += negWidth + posWidth + "0 " + color + ", ";
        	textShadow += posWidth + posWidth + "0 " + color;
    	}
    		
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
                     'opacity',
                     'padding',
                     'backgroundColor',
                     'borderColor',
                     'borderStyle',
                     'borderWidth',
                     'borderRadius',
                     'transitionDuration'];
        
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