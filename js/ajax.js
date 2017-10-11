/*	CN paper online Ajax Class
 *
 *
 *
 *
 *
 *
**/

window.errors=window.errors?window.errors:new Array();

Function.prototype.delegate=function(obj, args, appendArgs){
	var method = this;
	return function() {
		var callargs = args || arguments;
		if(appendArgs === true){
			callArgs = Array.prototype.slice.call(arguments, 0);
			callargs = callArgs.concat(args);
		}else if(typeof appendArgs == 'number'){
			callargs = Array.prototype.slice.call(arguments, 0);
			var applyArgs = [appendArgs, 0].concat(args);
			Array.prototype.splice.apply(callargs, applyArgs);
		}
		return method.apply(obj || window, callargs);
	};
};

Function.prototype.inherit=function(func){
	
	var parent;
	if(typeof func=="function"){
		parent=func.prototype;
	}else if(typeof func=="object"){
		parent=func;
	}
	
	for( var method in parent ){
		if(typeof parent[method]=="function"&&typeof this.prototype[method]=="undefined"){
			this.prototype[method]=parent[method];
		}
	}
}

function Ajax(_url,_method,_need_handle){
	
	this.$request=null;

	this.onload=null;

	this.onfail=null;
	
	this.$type=false;
	this.$defaultType="text";

	this.$useUnique=false;
	
	if(window.XMLHttpRequest){

		this.$request=new XMLHttpRequest();

	}else if(typeof ActiveXObject != "undefined"){

		this.$request=new ActiveXObject("Microsoft.XMLHTTP");

	}else{

		return false;

	}
	
	this.$isSending=false;
	
	this.response=false;

	this.$url=(typeof _url=="undefined")?"":_url;

	this.$method=(typeof _method=="undefined")?"POST":_method;

	this.$params=null;
	
	this.$timeout=40000;

	this.ontimeout=function(){};

	this.$timeoutid=null;

	this.$needhandle=(typeof _need_handle=="undefined")?true:_need_handle;
	
	this.$todo=new Array();

}

Ajax.prototype={
	setDefaultType: function(type){
		if(type){
			this.$defaultType=type;
			this.$type=type;
		}
	},
	
	setMethod: function(method){
		this.$method=method;
	},
	
	setUrl: function(url){
		this.$url=url;
	},
	
	/**
	 *
	 * parse method
	 * send the quest and set the success & fail handle
	 *
	 * @param	string	_deal
	 *		|	stands for the string of success handle method
	 *
	 * @param	string	_fail_handle
	 *		|	stands for the string of fail handle method
	 *
	 */
	parse: function(_deal,_fail_handle){
	
		if(typeof _deal=="function")	this.onload=_deal;
	
		if(typeof _fail_handle=="function") this.onfail=_fail_handle;
	
		this.send();
	
	},


	/**
	 * if you want an unique param added
	 */
	useUnique: function(_use){
	
		if(typeof _use == "undefined" || _use){
	
			this.$useUnique=true;
	
		}else{
	
			this.$useUnique=false;
	
		}
	
	},


	/**
	 *
	 * getParams method
	 * get all params
	 *
	 */
	getParams: function(){

		var method;
	
		var first=true;
	
		var result=new Array();
	
		for (method in this){
	
			if (this.checkParam(method)){
				
				if(this[method] instanceof Array){
					for( var i=0; i<this[method].length; i++){
						result.push(method+"="+encodeURIComponent(this[method][i]));
					}
				}else{
					result.push(method+"="+encodeURIComponent(this[method]));
				}
			}
		}
	
		this.$params=result.join("&");
	
		if(this.$useUnique){
			this.$params=this.$params.length?this.$params+"&":"";
			this.$params+="UNKEY="+new Date().getTime();
		}
	},

	/**
	 * clear method
	 * clean all params
	 */
	clear: function(){
	
		var method;
	
		for (method in this){
	
			if (this.checkParam(method)){
				delete this[method];
			}
		}
	
		this.$params=null;
		this.$type=this.$defaultType;
	},

	checkParam: function(method){
	
		if(!(method in this)){
			return false;
		}
		
		return typeof this[method]!="function" && method.charAt(0)!="$" && method!="onfail" && method!="onload" && method!="timeout" && method!="success";
	},

	/**
	 * send params
	 */
	send: function(){
	
		this.getParams();
	
		if(this.$method=="GET"){
	
			this.$request.open(this.$method,this.$url+"?"+this.$params,this.$needhandle);
	
		}else{
	
			this.$request.open(this.$method,this.$url,this.$needhandle);
	
		}
		
		this.$timeoutid=window.setTimeout(this.timeout.delegate(this),this.$timeout);
		
		if(this.$needhandle){
			this.$request.onreadystatechange=this.handle.delegate(this);
		}
		
		this.$request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
		if(this.$method=="GET"){
	
			this.$request.send(null);
			
			this.handle();
	
		}else{
	
			this.$request.send(this.$params);
	
		}
	
		this.$isSending=true;
	
	},
	
	/**
	 * get response
	 * use method
	 * 
	 * example
	 * 
	 *	after parse
	 *
	 * 1.xml responseXML
	 *		ajaxObject.$("xml");
	 *
	 * 2.text responseText
	 *		ajaxObject.$("text");
	 *
	 * 3.body responseBody
	 *		ajaxObject.$("body");
	 *
	 * 4.stream responseStream
	 *		ajaxObject.$("stream");
	 *
	 * 5.header	response Header
	 *		1. ajaxObject.$("header");
	 *		2. ajaxObject.$("header","Content-Type");
	 *		3. ajaxObject.$("Content-Type");
	 *
	 * 6.allHeader response all header
	 *		ajaxObject.$("allHeader");
	 *
	 * 7.error
	 *
	 * 8.errorCode
	 *
	 * 9.default responseText
	 *		ajaxObject.$();
	 *
	 */
	$: function(method){
		
		if(this.$isSending){
			return false;
		}
		
		var m=method;
		
		if(!arguments.length||!method){
			m="text";
		}
	
		switch(m){
			case "text":
				try{
					return this.$request.responseText;
					return decodeURI(this.$request.responseText);
				}catch(e){
					return this.$request.responseText;
				}
			case "json":
				try{
					var _t=this.$request.responseText;
					//_t=decodeURI(this.$request.responseText);
				}catch(e){
					//return {error:true,message:e.message,response: decodeURI(this.$request.responseText)};
				}
				
				var func=new Function("return "+_t);
				return func();
	
			case "xml":
				return this.$request.responseXML;
	
			case "body":
				return this.$request.responseBody;
	
			case "stream":
				return this.$request.responseStream;
	
			case "allHeader":
				return this.$request.getAllResponseHeader();
	
			case "error":
				return this.$error;
	
			case "errorCode":
				return this.$errorCode;
	
			case "header":
				if(arguments.length==2){
					return this.$request.getResponseHeader(arguments[1]);
				}
				return this.$request.getResponseHeader();
	
			default:
				return this.$request.getResponseHeader(method);
		}
	
	},

	/**
	 *
	 * set success and fail handle
	 *
	 */
	handle: function(){
			
		try{
			var r=this.$request;
	
			if(r.readyState==4||r.readyState=="complete"){
	
				this.$isSending=false;
				
				window.clearTimeout(this.$timeoutid);
	
				if(r.status==200||r.status==304||r.status==0){
					
					this.callSuccess();
	
				}else{
					
					this.$errorCode=r.status;
					this.$error=r.statusText;
					
					this.callFail({message:this.$error,code: this.$errorCode});
					
				}
	
			}
	
		}catch(e){
			window.errors.push({error:e,quest:r});
		}
	
	},

	callSuccess: function(){
		try{
			if(typeof this.onload=="function"){
				this.onload(this.$(this.$type));
				this.response=this.$();
			}
		}catch(e){
			throw e;
		}
		
		this.callTodo();
	},

	callFail: function(){
		try{
			if(typeof this.onfail=="function"){
				this.onfail();
			}
		}catch(e){
			throw e;
		}
		
		this.callTodo();
	},

	timeout: function(){
	
		if(!this.$isSending){
			return false;
		}
		
		try{
			this.$errorCode=-1;
			this.$error="Time Out";
			this.cancel();
			this.ontimeout();
			
			this.callFail({message:this.$error,code: this.$errorCode});
			
		}catch(e){
			window.errors.push(e);
		}
		
		this.callTodo();
	},

	/**
	 *
	 * Cancel this request
	 *
	 */
	cancel: function(){
		try{
			if(this.$isSending){
				this.$request.abort();
				this.$isSending=false;
			}
		}catch(e){
			window.errors.push(e);
		}
	},

	push: function(todo,arg){
		
		this.$todo.push({action:todo,param:arg});
	},

	callTodo: function(){
		var act;
		while(this.$todo.length){
			act=this.$todo.pop();
			
			try{
				act.action(act.param);
			}catch(e){
				window.errors.push(e);
			}
		}
	}
}

Ajax.cd=function(){
	
	var counter=1;
	
	var cd=function(_url, _method){
		this.$frame=new Iframe({id:"requestFrame"+counter, name:"requestFrame"+counter}, document, true);
		
		this.$frame.hide();
		
		var $m=_method.toLowerCase()=="get"?"get":"post";
		
		this.$form=new E("form", {method:$m, target:"requestFrame"+counter, action: _url, style:{position:"absolute", left:"-10000px", top:"-10000px", display: "none"}});
		
		this.$cols=new Array();
		
		this.$frame.insertTo(document.body);
		this.$form.insertTo(document.body);
		
		this.$frame.bind("load",this.callSuccess.delegate(this));
		
		counter++;
	}
	
	cd.prototype={
		setParam: function(params){
			for( var i in params){
				this.$cols.push(new E("input",{type:"hidden",value:params[i].toString(),name:i}));
				this.$form.appendChild(this.$cols[this.$cols.length-1]);
			}
		},
		
		destroy: function(){
			
			setTimeout(function(){
				this.$frame.remove();
			}.delegate(this), 1);
			this.$form.remove();
			
			try{
				delete this;
			}catch(e){}
		},
		
		parse: function(s,f){
			this.ok=s;
			this.fail=f;
			this.$form.dom().submit();
		},
		
		callSuccess: function(){
			try{
				var json=this.$frame.dom().contentWindow.json;
			}catch(e){
				
				try{
					
					var text=this.$frame.dom().contentWindow.document.body.innerHTML.trim();
					var json=Base.json(text);
					
				}catch(e){
					this.fail({message:"Request CallBack Failed\ntext:"+text});
					this.destroy();
					return;
				}
			}
			
			this.ok(json);
			this.destroy();
		}
	}

	return cd;
}();

Ajax.request=function(){
	
	var defaultReturnValue="json";
	var rstack=new Array();
	var request=function(arg){
		
		if(!arg.url){
			return {error:"haven't set url"};
		}
		
		if(!arg.success){
			arg.success=GPF.doNothing;
		}
		
		if(!arg.fail){
			arg.fail=GPF.doNothing;
		}
		
		if(!arg.ontimeout){
			arg.ontimeout=GPF.doNothing;
		}
		
		if(!arg.method){
			arg.method="POST";
		}
		
		if(!arg.returnType){
			arg.returnType=defaultReturnValue;
		}
		
		var quest;
		for( var i=0; i<rstack.length; i++){
			if(!rstack[i].lock&&!rstack[i].q.$isLoading){
				rstack[i].lock=true;
				quest=rstack[i].q;
				break;
			}
		}
		
		if(!quest){
			quest=new Ajax();
			rstack.push({lock:true,q:quest});
		}
		
		quest.clear();
		
		quest.setUrl(arg.url);
		quest.setMethod(arg.method);
		quest.setDefaultType(arg.returnType);
		
		if(arg.data&&typeof arg.data=="object"){
			for( var m in arg.data ){
				if((typeof arg.data[m]=="string"||typeof arg.data[m]=="number"||arg.data[m] instanceof Array)&&(typeof quest[m]!="function")){
					quest[m]=arg.data[m];
				}
			}
		}
		
		quest.ontimeout=arg.ontimeout;
		quest.parse(function(){
			callMethod(arg.success,arguments,quest);
			this.lock=false;
		}.delegate(rstack[i]),function(){
			callMethod(arg.fail,arguments,quest);
			this.lock=false;
		}.delegate(rstack[i]));
	}
	
	var cancel=function(id){
		rstack[id].q.cancel();
		rstack[id].locked=false;
	}
	
	var callMethod=function(func,arg,req){
		if(typeof func=="function"){
			func.apply(req,arg);
		}else if(typeof func=="string"){
			Event.fire(func,arg);
		}
	}
	
	var oldDomain=document.domain.toString();
	var isCrossDomain=function(url){
		if(!(/^http(s){0,1}:\/\/.*/.test(url))){
			return false;
		}
		return !(url.match(/^http(s){0,1}:\/\/([\w-]|\.)*/)[0].indexOf(oldDomain)>-1);
	}
	
	var cdRequest=function(arg){
	
		if(!arg.url){
			return {error:"haven't set url"};
		}
		
		if(!arg.success){
			arg.success=GPF.doNothing;
		}
		
		if(!arg.fail){
			arg.fail=GPF.doNothing;
		}
		
		if(!arg.ontimeout){
			arg.ontimeout=GPF.doNothing;
		}
		
		if(!arg.method){
			arg.method="POST";
		}
		
		var quest=new Ajax.cd(arg.url,arg.method);
		
		var param=new Object();
		param.cd="crossdomain";
		
		if(arg.data&&typeof arg.data=="object"){
			for( var m in arg.data ){
				if((typeof arg.data[m]=="string"||typeof arg.data[m]=="number"||arg.data[m] instanceof Array)&&(typeof quest[m]!="function")){
					param[m]=arg.data[m];
				}
			}
		}
		
		quest.setParam(param);
		
		quest.parse(function(){
			callMethod(arg.success,arguments,quest);
		},function(){
			callMethod(arg.fail,arguments,quest);
		});
	}
	
	var r=function(arg){
		if(isCrossDomain(arg.url)){
			cdRequest(arg);
		}else{
			request(arg);
		}
	}
	
	return r;
}();

var GPF=function(){
	var debugMode=true;
	
	var _msg=window.msg=window.alert;
	
	var doNothing=function(){};
	
	if(!debugMode){
		window.alert=doNothing;
	}
	
	var _NS={};
	
	window.Namespace=function(str){
		
		var path=str.split(".");
		
		var t=_NS;
		
		for( var i=0; i<path.length; i++){
			if(path[i].length){
				if(!t[path[i]]){
					t[path[i]]=new Object();
				}
				t=t[path[i]];
			}
		}
		
		return t;
	}
	
	return {
		version: "2.0",
		
		openDebug: function(){
			if(debugMode){
				return;
			}
			
			window.alert=_msg;
			debugMode=true;
		},
		
		closeDebug: function(){
			if(!debugMode){
				return;
			}
			
			window.alert=doNothing;
			debugMode=false;
		},
		
		isDebugMode: function(){
			return debugMode;
		},
		
		doNothing: doNothing
	}
}();