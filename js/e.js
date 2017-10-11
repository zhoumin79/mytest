function $E(element){
	var doc=document, arg;
	
	if(arguments.length>1){
		for( var i=1; i<arguments.length; i++) {
			arg=arguments[i];
			if(typeof arg=="object"){
				if(arg.nodeType&&(arg.nodeType==9)){
					doc=arg;
				}else{
					var st=arg;
				}
			}else if(typeof arg=="string"){
				var ns=arg;
			}
		}
	}
	
	this.doc=doc;
	
	if(this instanceof arguments.callee){
		
		if(typeof element=="string"){
		
			if(element.toLowerCase()=="iframe"){
				this.$frame=new Iframe(st);
				this.$node=this.$frame.dom();
			}else{
				if(ns){
					ns=ns=="svg"?"http://www.w3.org/2000/svg":ns;
					this.$node=doc.createElementNS(ns,element);
				}else{
					this.$node=doc.createElement(element);
				}
				
				if(st){
					$E.set(this,st);
				}
			}
		}
	}else{
		if(!element){
			var $node=element;
		}else if(element instanceof Array){
			var es=[];
			for( var i=0; i<element.length; i++){
				es.push($E(element[i]));
			}
			return es;
		}else if(typeof element=="object"&&element.nodeType){
			var $node=element;
		}else if(typeof element=="object"&&element.$node){
			return element;
		}else if(typeof element=="string"||typeof element=="number"){
			var $node=doc.getElementById(element);
		}else{
			var $node=element;
		}
		
		var _t=new $E();
		_t.$node=$node;
		return _t;
	}
}

$E.set=function(el,settings){
	if(settings){
		for(var method in settings)
			if(typeof settings[method]=="string"||typeof settings[method]=="number"){
				try{
					el.dom()[method]=settings[method];
				}catch(e){
					window.errors.push(e);
				}
			}else if(method.substring(0,2)=="on"){
				el.bind(method,settings[method]);
			}else{
				for(var subMethod in settings[method]){
					try{
						el.dom()[method][subMethod]=settings[method][subMethod];
					}catch(e){
						window.errors.push(e);
					}
				}
			}
	}	
}

$E.remove=function(node){
	$E(node).remove();
}

$E.prototype={
	dom: function(e){
		return this.$node;
	},

	set: function(settings){
		$E.set(this,settings);
		return this;
	},

	insertTo: function(element){
		if(element){
			var n=$E(element).$node;
			n.appendChild(this.$node);
		}
		return this;
	},

	remove: function(){
		if(arguments.length){
			for( var i=0; i<arguments.length; i++){
				try{
					this.removeChild(arguments[i]);
				}catch(e){
					window.errors.push(e);
				}
			}
		}else{
			this.$node.parentNode.removeChild(this.$node);
		}
		
		return this;
	},

	show: function(display){
		if(this.$node.style){
			this.$node.style.display=display?display:"block";
		}
		return this;
	},

	appendBefore: function(parent,child){
		var c=$E(child).$node,p=$E(parent).$node;
		p.insertBefore(this.$node,c);
		return this;
	},

	replaceNode: function(node){
		var n=$E(node).$node;
		n.parentNode.replaceChild(this.$node,n);
		return this;
	},

	hide: function(){
		if(this.$node.style){
			this.$node.style.display="none";
		}
		return this;
	},

	appendChild: function(node){
		if(typeof node=="string"){
			this.dom().appendChild(this.doc.createTextNode(node));
		}else{
			this.$node.appendChild($E(node).$node);
		}
		return this;
	},

	removeChild: function(node){
		this.$node.removeChild($E(node).$node);
		return this;
	},

	insertBefore: function(node,child){
		this.$node.insertBefore($E(node).$node,$E(child).$node);
		return this;
	},

	replaceChild: function(node,child){
		this.$node.replaceChild($E(node).$node,$E(child).$node);
		return this;
	},
	
	html: function(){
		if(!arguments.length){
			return this.$node.innerHTML;
		}
		this.$node.innerHTML=arguments[0];
		
		return this;
	},
	
	text: function(){
		return this.$node.innerText||this.$node.textContent||"";
	},
	
	cloneNode: function(deepth){
		if(deepth){
			return $E(this.$node.cloneNode(true));
		}else{
			return $E(this.$node.cloneNode(false));
		}
	},
	
	clone: function(deepth){
		return this.cloneNode(deepth);
	},
	
	getElementsByTagName: function(s){
		return this.dom().getElementsByTagName(s);
	},
	
	gets: function(){
		var map=new Array();
		
		var times=0;
		
		var getAll=function(el, tn){
			
			var ar=new Array(), temp=E(el);
			
			if(el.nodeType==3){
				temp.tagName="text";
			}else{
				temp.tagName=el.tagName.toString().toLowerCase();
			}
			
			if(!tn||(tn.indexOf(","+temp.tagName+",")>-1)){
				map.push(temp);
			}
			
			if(el.childNodes&&el.childNodes.length){
				for( var i=0; i<el.childNodes.length; i++){
					getAll(el.childNodes[i], tn);
				}
			}
		}
		
		if(!arguments.length||arguments.length>1||(arguments.length==1&&arguments[0].toString().toLowerCase())){
			
			var str=false;
			
			if(arguments.length){
				str=",";
				for( var i=0; i<arguments.length; i++){
					str+=arguments[i].toString().toLowerCase()+",";
				}
			}
			
			getAll(this.dom(),str);
			return map;
		}
		
		var ns=el.getElementsByTagName(arguments[0]);
		
		for( var i=0; i<ns[i].length; i++){
			ns[i]=E(ns[i]);
		}
		
		return ns;
		
	},
	
	dom: function(){
		if(arguments.length&&typeof arguments[0]=="object"&&"nodeType" in arguments[0]){
			this.$node=arguments[0];
			return this;
		}
		return this.$node;
	},
	
	xy: function(){
		if(!arguments.length){
			var r={left:0, top: 0};
			if(this.$node.nodeType!=1||this.$node.tagName=="HTML"){
				return r;
			}
			var n=this.$node;
			if (n.offsetParent) {
					do {
						r.left += n.offsetLeft;
						r.top += n.offsetTop;
					} while (n = n.offsetParent);
					return r;
			}		
			return false;
		}
		
		if(arguments.length==1){
			this.$node.style.top=arguments[0].top+"px";
			this.$node.style.left=arguments[0].left+"px";
		}else{
			this.$node.style.top=arguments[1]+"px";
			this.$node.style.left=arguments[0]+"px";
		}
	},
	
	width: function(){
		if(arguments.length){
			this.$node.style.width=isNaN(arguments[0])?arguments[0]:arguments[0]+"px";
			return true;
		}
		
		return this.$node.scrollWidth;
	},
	
	height: function(){
		if(arguments.length){
			this.$node.style.height=isNaN(arguments[0])?arguments[0]:arguments[0]+"px";
			return true;
		}
		
		return this.$node.offsetHeight||this.$node.clientHeight;
	},
	
	rect: function(){
		var r=this.xy();
		r.width=this.width();
		r.height=this.height();
		return r;
	},
	
	next: function(tagName){
		var t=this.dom();
		if(!tagName){
			
			while((t=t.nextSibling)&&t.nodeType==3);
		}else{
			
			if(tagName.toUpperCase()=="TEXT"){
				return E(t.nextSibling);
			}
			
			while((t=t.nextSibling)&&(t.nodeType==3||t.tagName!=tagName.toUpperCase()));
		}
		
		if(t){
			return E(t);
		}
		
		return null;
	},
	
	previous: function(tagName){
		var t=this.dom();
		if(!tagName){
			
			while((t=t.previousSibling)&&t.nodeType==3);
		}else{
			
			if(tagName.toUpperCase()=="TEXT"){
				return E(t.previousSibling);
			}
			
			while((t=t.previousSibling)&&(t.nodeType==3||t.tagName!=tagName.toUpperCase()));
		}
		
		if(t){
			return E(t);
		}
		
		return null;
	},
	
	parent: function(){
		return this.dom().parentNode?E(this.dom().parentNode):false;
	},
	
	children: function(tagName){
		var cds=new Array();
		
		if(!this.first()){
			return cds;
		}
		
		var i=0, temp;
		cds.push(this.first());
		
		while(temp=cds[i++].next()){
			cds.push(temp);
		}
		
		if(tagName){
			for( var i=cds.length-1; i>-1; i--){
				if(cds[i].dom().tagName!=tagName.toUpperCase()){
					cds.splice(i,1);
				}
			}
		}
		
		return cds;
	},
	
	firstChild: function(tagName){
		var t=this.dom().firstChild;
		if(!tagName){
			
			while(t&&t.nodeType==3&&(t=t.nextSibling));
		}else{
			
			if(tagName.toUpperCase()=="TEXT"){
				return E(t);
			}
			
			while(t.nodeType==3&&(t=t.nextSibling)&&t.tagName!=tagName.toUpperCase());
		}
		
		if(t){
			return E(t);
		}
		
		return null;
	},
	
	lastChild: function(tagName){
		var t=this.dom().lastChild;
		if(!tagName){
			
			while(t&&t.nodeType==3&&(t=t.previousSibling));
		}else{
			
			if(tagName.toUpperCase()=="TEXT"){
				return E(t.previousSibling);
			}
			
			while(t.nodeType==3&&t.tagName!=tagName.toUpperCase()&&(t=t.previousSibling));
		}
		
		if(t){
			return E(t);
		}
		
		return null;
	},
	
	first: function(tagName){
		return this.firstChild(tagName);
	},
	
	last: function(tagName){
		return this.lastChild(tagName);
	},
	
	scrollIntoView: function(){
		//this.$node.scrollIntoView();
		
		var top=this.xy().top;
		top=top>100?top-100: 0;
		
		document.documentElement.scrollTop=top;
	},
	
	hasClass: function(cls){
		var reg=new RegExp( "\\b" + cls + "\\b", "i" );
		return reg.test(this.dom().className);
	},
	
	addClass: function(cls){
		
		if(!this.hasClass(cls)){
			if(this.$node.className){
				this.$node.className+=" "+cls;
			}else{
				this.$node.className=cls;
			}
		}
		
	},
	
	css: function(styleName){
		
		var node=this.$node;
		
		if(!node.style){
			return null;
		}
	    var value = node.style[styleName];
	    
	    var doc=node.ownerDocument;
	    var win=doc.defaultView||doc.parentWindow;
	    
		if (!value) {
	      if ( win&& win.getComputedStyle) {
	        var css = win.getComputedStyle(node, null);
	      } else if (node.currentStyle) {
	        var css = node.currentStyle;
	      }
		}else{
			return value;
		}
		
		return css[styleName] == "auto" ? null : css[styleName];
	},
	
	attr: function(){
		
		var prop=arguments[0];
		
		if(typeof prop!="string"){
			return false;
		}
		
		if(arguments.length==1){
			return this.$node.getAttribute(prop);
		}
		
		this.$node.setAttribute(prop,arguments[1]);
	},
	
	hasAttr: function(){
		if(this.$node.hasAttribute){
			return this.$node.hasAttribute(arguments[0]);
		}
		
		return this.attr(arguments[0]);
	},
	
	removeAttr: function(){
		return this.$node.removeAttribute(arguments[0],false);
	},
	
	removeClass: function(cls){
		
		if(this.hasClass(cls)){
			var reg=new RegExp( "\\b" + cls + "\\b", "gi" );
			this.dom().className=this.dom().className.toString().replace(reg,"");
		}
		return this;
		
	},
	
	bind: function(e,f){
		Event.add(this.$node,e,f);
		return this;
	},
	
	unbind: function(e,f){
		Event.remove(this.$node,e,f);
		return this;
	},
	
	constructor: $E
}

if(typeof window.E =="undefined"){ window.E=$E; }

var Iframe=function(settings,doc,isUpload){
	if(window.ActiveXObject) {

		var str="";
		
		this.doc=doc?doc:document;

		for( var method in settings ){
			if(typeof settings[method]=="string")
				str+=" "+method+"=\""+settings[method]+"\"";
		}

		this.$node=this.doc.createElement("<iframe"+str + " />");

		//this.$node=this.doc.createElement('<iframe id="' + settings.id + '" name="' + settings.name + '" />');
	}else{
		this.$node=this.doc.createElement("iframe");
	}

	this.response="";
	
	if(isUpload){
		this.$node.style.position="absolute";
		this.$node.style.left="-3456px";
		this.$node.style.top="-2345px";
	}
	
	if(settings)
		this.set(settings);
}

Iframe.prototype=new $E();
Iframe.prototype.constructor=Iframe;