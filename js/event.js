/**
 *
 *	Events storage and manager
 *
 *	written by purple.calm@gmail.com
 *
 *	@notice this is an opensource file
 *
 *
 **/
 
window.errors=window.errors?window.errors:new Array();

if(typeof Event=="undefined"){
	var Event={};
}

Event.store=new Object();
Event.listeners=new Object();

/**
 *
 * @Methods
 *
 * add:
 *
 *
 *
 *
 *
 **/


Event.add=function(el,eventName,func){
	
	switch(eventName){
		case "tip":
		case "help":
			if(typeof Tip!="object"){
				throw new Error("Tip haven't be loaded","event.js");
			}else{
				Tip.add(el,func,eventName);
				return false;
			}
		case "mouseenter":
		case "mouseleave":
			if(window.navigator.userAgent.toLowerCase().indexOf("msie")==-1){
				Event.tool.bind[eventName](el,func);
				return;
			}
			break;
	}
	
	if(func&&typeof func=="function"){
		Event.attach(el,eventName,func);
	}else if(func&&typeof func=="string"){
		if(!Event.store[func]){
			Event.store[func]=function(){
				Event.fire(func);
			}
		}
		Event.attach(el,eventName,Event.store[func]);
	}
}

Event.remove=function(el,eventName,func){
	
	switch(eventName){
		case "tip":
		case "help":
			if(typeof Tip!="object"){
				throw new Error("Tip haven't be loaded","event.js",178);
			}else{
				Tip.remove(el,eventName);
				return false;
			}
		case "mouseenter":
		case "mouseleave":
			if(window.navigator.userAgent.toLowerCase().indexOf("msie")==-1){
				Event.tool.unbind[eventName](el,func);
				return;
			}
			break;
	}
	
	if(func&&typeof func=="function"){
		Event.detach(el,eventName,func);
	}else if(func&&typeof func=="string"){
		Event.detach(el,eventName,Event.store[func]);
	}
}

Event.fire=function(eventName){
	var arg=new Array();
	if(arguments.length>1){
		for( var i=1; i<arguments.length; i++){
			arg.push(arguments[i]);
		}
	}
	
	var copy=new Array();
	
	for( var i=0; Event.listeners[eventName]&&i<Event.listeners[eventName].length; i++){
		copy.push(Event.listeners[eventName][i]);
	}
	
	for( var i=0; i<copy.length; i++){
		try{
			copy[i].apply(null,arg);
		}catch(e){
			window.errors.push(e);
		}
	}
}

Event.listen=function(eventName,func){
	if(!Event.listeners[eventName]){
		Event.listeners[eventName]=new Array();
	}
	
	if(func&&typeof func=="function"){
		Event.listeners[eventName].push(func);
	}else if(func&&typeof func=="string"&&eventName!=func){
		if(!Event.store[func]){
			Event.store[func]=function(){
				Event.fire(func);
			}
		}
		Event.listeners[eventName].push(Event.store[func]);
	}
}

Event.stopListen=function(eventName,func){
	if(!Event.listeners[eventName]){
		Event.listeners[eventName]=new Array();
		return;
	}
	
	if(func&&typeof func=="function"){
		var fc=func;
	}else if(func&&typeof func=="string"&&Event.store[func]){
		var fc=Event.store[func];
	}else{
		if(Event.listeners[eventName]){
			while(Event.listeners[eventName].length){
				Event.listeners[eventName].pop();
			}
		}
		return;
	}
	
	for( var i=0; i<Event.listeners[eventName].length; i++ ){
		if(Event.listeners[eventName][i]==fc){
			Event.listeners[eventName].splice(i,1);
			return;
		}
	}
}

Event.parser=function(el,eve){
	return function(event){
			var em=new Event.model(event,el);
			
			var copy=new Array();
			
			for( var i=0; i<el.handlers[eve].length; i++){
				copy.push(el.handlers[eve][i]);
			}
			
			for( var i=0; i<copy.length; i++ ){
				try{
					copy[i].call(el,em);
				}catch(e){
					window.errors.push(e);
				}
			}
		};
}

Event.attachOriginalEvent=function(el,eventName,func,handle){
	var method=true;

	if(typeof handle!="undefined"){
		method=(handle!=false);
	}

	if(document.addEventListener){
		var eve=eventName.indexOf("on")==0?eventName.substring(2):eventName;
		el.addEventListener(eve,func,method);

	}else if(document.attachEvent){
		var eve=eventName.indexOf("on")==0?eventName:"on"+eventName;
		el.attachEvent(eve,func);
	}else{
		return false;
	}
}

Event.detachOriginalEvent=function(el,eventName,func,handle){
	var method=true;

	if(typeof handle!="undefined"){
		method=(handle!=false);
	}

	if(document.addEventListener){
		var eve=eventName.indexOf("on")==0?eventName.substring(2):eventName;
		el.removeEventListener(eve,func,method);

	}else if(document.attachEvent){
		var eve=eventName.indexOf("on")==0?eventName:"on"+eventName;
		el.detachEvent(eve,func);

	}else{
		return false;
	}
}

Event.attach=function(el,eventName,func){
	var eve=eventName.toLowerCase().indexOf("on")==0?eventName.toLowerCase().substring(2):eventName.toLowerCase();
	
	if(!el){
		return;
	}
	
	if(!el.handlers){
		el.handlers=new Object();
	}
	
	if(!el.triggers){
		el.triggers=new Object();
	}
	
	if(!el.handlers[eve]){
		el.handlers[eve]=new Array();
	}
	
	if(!el.triggers[eve]){
		el.triggers[eve]=Event.parser(el,eve);
	}
	
	if(!el.handlers[eve].length){
		
		Event.attachOriginalEvent(el,eve,el.triggers[eve]);
	}
	
	el.handlers[eve].push(func);
}

Event.detach=function(el,eventName,func){
	var eve=eventName.toLowerCase().indexOf("on")==0?eventName.toLowerCase().substring(2):eventName.toLowerCase();
	
	if(!el.handlers||!el.handlers[eve]||!el.triggers||!el.triggers[eve]){
		return false;
	}
	
	for( var i=0; i<el.handlers[eve].length; i++ ){
		if(el.handlers[eve][i]==func){
			el.handlers[eve].splice(i,1);
			break;
		}
	}
	
	if(!el.handlers[eve].length){
		Event.detachOriginalEvent(el,eve,el.triggers[eve]);
	}
}

Event.tool=function(){
	
	var stack=new Object();
	stack["mousein"]=new Array();
	
	var addMouseIn=function(func){
		for( var i=0; i<stack["mousein"].length; i++){
			if(stack["mousein"][i].original==func){
				stack["mousein"][i].using++;
				return stack["mousein"][i].handler;
			}
		}
		
		var i={
			original: func,
			using: 1,
			handler: eventIn(func)
		};
		
		stack["mousein"].push(i);
		return i.handler;
	}
	
	var removeMouseIn=function(func){
		for( var i=0; i<stack["mousein"].length; i++){
			if(stack["mousein"][i].original==func){
				stack["mousein"][i].using--;
				var handler=stack["mousein"][i].handler;;
				
				if(!stack["mousein"][i].using){
					stack["mousein"].splice(i,1);
				}
				
				return handler;
			}
		}
		
		return false;
	}
	
	var eventIn=function(func){
		return function(e){
			var relTarget = e.originalEvent.relatedTarget;
			if(e.currentTarget == relTarget || isAChildOf(relTarget, e.currentTarget)){
				return;
			}

			func.call(e.currentTarget, e);
		}
	};
	
	var isAChildOf=function(c,p){
		if(c===p){
			return false;
		}
		
		while((c=c.parentNode)&&c!==p);
		return c==p;
	}
	
	var mousein=function(el,eve,func){
		var fn;
		
		if(func&&typeof func=="function"){
			fn=func;
		}else if(func&&typeof func=="string"){
			if(!Event.store[func]){
				Event.store[func]=function(){
					Event.fire(func);
				}
			}
			fn=Event.store[func];
		}else{
			return;
		}
		
		Event.attach(el,eve,addMouseIn(fn));
	}
	
	var removeMousein=function(el,eve,func){
		var fn;
		
		if(func&&typeof func=="function"){
			fn=func;
		}else if(func&&typeof func=="string"){
			fn=Event.store[func];
		}else{
			return;
		}
		
		Event.detach(el,eve,removeMouseIn(fn));
	}
	
	return {
		bind: {
			mouseenter: function(el,func){
				mousein(el,"mouseover",func);
			},
			
			mouseleave: function(el,func){
				mousein(el,"mouseout",func);
			}
		},
		
		unbind: {
			mouseenter: function(el,func){
				removeMousein(el,"mouseover",func);
			},
			
			mouseleave: function(el,func){
				removeMousein(el,"mouseout",func);
			}
		}
	}
}();

Event.model=function(original,el){
	this.originalEvent=original;
	
	this.target=original.target||original.srcElement;
	
	this.currentTarget=el;
	
	var getWin=function(n){
		try{
			
			if(!n){
				return false;
			}
			
			if(n.nodeType==9){
				return n.parentWindow||n.defaultView;
			}else if(n.frames){
				return n;
			}else {
				return n.ownerDocument.parentWindow||n.ownerDocument.defaultView;
			}
		}catch(e){
			
		}
		
	}
	
	this.view=original.view?original.view:getWin(this.currentTarget);
	
	this.doc=this.view.document;
	
	if(this.doc){
		if(original.pageX==null && original.clientX != null){
			this.pageX = original.clientX + (this.doc.documentElement && this.doc.documentElement.scrollLeft || this.doc.body && this.doc.body.scrollLeft || 0) - (this.doc.documentElement.clientLeft || 0);
			this.pageY = original.clientY + (this.doc.documentElement && this.doc.documentElement.scrollTop || this.doc.body && this.doc.body.scrollTop || 0) - (this.doc.documentElement.clientTop || 0);
		}else{
			this.pageX = original.pageX;
			this.pageY = original.pageY;
		}
	}
	
	this.clientX = original.clientX;
	this.clientY = original.clientY;
	
	this.which=original.which||original.button;
	
	this.keyCode=original.keyCode;
	this.ctrlKey=original.ctrlKey;
}

Event.model.prototype={
	preventDefault: function(){
		if(this.originalEvent.preventDefault){
			this.originalEvent.preventDefault();
		}else{
			this.originalEvent.returnValue=false;
		}
	},
	
	stopPropagation: function(){
		if(this.originalEvent.stopPropagation){
			this.originalEvent.stopPropagation();
		}else{
			this.originalEvent.cancelBubble=true;
		}
	},
	
	xy: function(){
		return {left: this.pageX, top: this.pageY};
	}
}


if(typeof window.LOAD=="undefined"){
	window.LOAD=new Array();
}

var _INIT_ONLOAD_EVENT_=function(){

	for(var func,i=0;i<LOAD.length;i++){
		try{
			func=LOAD[i];
			if(typeof func=="string"){
				eval(func);
			}else if(typeof func=="function"){
				func.call();
			}
		}catch(e){
			window.errors.push(e);
		}
	}
	
	Event.fire("window-onload");

}

Event.attach(window,"load",_INIT_ONLOAD_EVENT_,true);