(function(){
		  
	var mine="red", battleMode=false;
	
	var board,doc,boardxy,current=false;
	
	var originalMen=[
		{ name: "c1", actor: "chariot", color: "red", xy: { x: 0, y: 0, color:"red" }},
		{ name: "c2", actor: "chariot", color: "red", xy: { x: 8, y: 0, color:"red" }},
		{ name: "h1", actor: "horse", color: "red", xy: { x: 1, y: 0, color:"red" }},
		{ name: "h2", actor: "horse", color: "red", xy: { x: 7, y: 0, color:"red" }},
		{ name: "m1", actor: "minister", color: "red", xy: { x: 2, y: 0, color:"red" }},
		{ name: "m2", actor: "minister", color: "red", xy: { x: 6, y: 0, color:"red" }},
		{ name: "k1", actor: "kavass", color: "red", xy: { x: 3, y: 0, color:"red" }},
		{ name: "k2", actor: "kavass", color: "red", xy: { x: 5, y: 0, color:"red" }},
		{ name: "king", actor: "king", color: "red", xy: { x: 4, y: 0, color:"red" }},
		{ name: "e1", actor: "emplacement", color: "red", xy: { x: 1, y: 2, color:"red" }},
		{ name: "e2", actor: "emplacement", color: "red", xy: { x: 7, y: 2, color:"red" }},
		{ name: "p1", actor: "pawn", color: "red", xy: { x: 0, y: 3, color:"red" }},
		{ name: "p2", actor: "pawn", color: "red", xy: { x: 2, y: 3, color:"red" }},
		{ name: "p3", actor: "pawn", color: "red", xy: { x: 4, y: 3, color:"red" }},
		{ name: "p4", actor: "pawn", color: "red", xy: { x: 6, y: 3, color:"red" }},
		{ name: "p5", actor: "pawn", color: "red", xy: { x: 8, y: 3, color:"red" }},
		
		{ name: "c1", actor: "chariot", color: "black", xy: { x: 0, y: 0, color:"black" }},
		{ name: "c2", actor: "chariot", color: "black", xy: { x: 8, y: 0, color:"black" }},
		{ name: "h1", actor: "horse", color: "black", xy: { x: 1, y: 0, color:"black" }},
		{ name: "h2", actor: "horse", color: "black", xy: { x: 7, y: 0, color:"black" }},
		{ name: "m1", actor: "minister", color: "black", xy: { x: 2, y: 0, color:"black" }},
		{ name: "m2", actor: "minister", color: "black", xy: { x: 6, y: 0, color:"black" }},
		{ name: "k1", actor: "kavass", color: "black", xy: { x: 3, y: 0, color:"black" }},
		{ name: "k2", actor: "kavass", color: "black", xy: { x: 5, y: 0, color:"black" }},
		{ name: "king", actor: "king", color: "black", xy: { x: 4, y: 0, color:"black" }},
		{ name: "e1", actor: "emplacement", color: "black", xy: { x: 1, y: 2, color:"black" }},
		{ name: "e2", actor: "emplacement", color: "black", xy: { x: 7, y: 2, color:"black" }},
		{ name: "p1", actor: "pawn", color: "black", xy: { x: 0, y: 3, color:"black" }},
		{ name: "p2", actor: "pawn", color: "black", xy: { x: 2, y: 3, color:"black" }},
		{ name: "p3", actor: "pawn", color: "black", xy: { x: 4, y: 3, color:"black" }},
		{ name: "p4", actor: "pawn", color: "black", xy: { x: 6, y: 3, color:"black" }},
		{ name: "p5", actor: "pawn", color: "black", xy: { x: 8, y: 3, color:"black" }}
	];
	
	var men=originalMen;
	
	var Ground=function(){
	
		var done=false;
		
		var suggest;
		
		var create=function(){
			if(done){
				for( var method in Ground ){
					if(Key.valid(method)){
						Ground[method]=false;
					}
				}
				
				if(suggest.parent()){
					suggest.remove();
				}
				return;
			}
			suggest=new E("div",{className:"suggest"});
			suggest.current="noplace";
			done=true;
		}
	
		var handleClick=function(e){
			if(Record.playing){
				return;
			}
		
			var pos=e.xy();
			pos.left-=boardxy.left;
			pos.top-=boardxy.top;
			
			var xy=getxy(pos);
			
			if(xy.x<0||xy.x>8||xy.y<0||xy.y>4){
				return;
			}

			var key=Key.get(xy);
			
			if(Ground[key]){//&&Ground[key].color==mine){
			
				if(current){
				
					if(current==Ground[key]){
						current.unactive();
						current=false;
						return;
					}
					
					if(current.color!=Ground[key].color){
						current.move(xy);
						current.unactive();
						current=false;
					}else{
						current.unactive();
						current=Ground[key];
						current.active();
					}

				}else{
				
					if(battleMode&&Ground[key].color!=mine){
						return;
					}
				
					Ground[key].active();
					current=Ground[key];
				}
			}else if(current){
				current.move(xy);
				current.unactive();
				current=false;
			}
			
			if(suggest.parent()){
				suggest.remove();
			}
		}
		
		var handleMove=function(e){
			if(!current||Record.playing){
				return;
			}
			
			var pos=e.xy();
			pos.left-=boardxy.left;
			pos.top-=boardxy.top;
			
			var xy=getxy(pos);
			var key=Key.get(xy);
			var cssxy=getCssxy(xy);
			
			if(suggest.current==key){
				return;
			}
			
			if((!Ground[key]||Ground[key].color!=current.color)&&current.rules(current.place,xy)){
				suggest.insertTo(board);
				suggest.dom().className="suggest";
				suggest.addClass(current.color+"-"+current.actor);
				if(Ground[key]){
					suggest.addClass("suggest-kill");
				}
				suggest.xy(cssxy);
				suggest.current=key;
			}else{
				if(suggest.parent()){
					suggest.remove();
					suggest.current=false;
				}
			}
		}
		
		var showFlag=function(){
			var p=new Place(arguments);
			
			var cssxy=getCssxy(p);
			
			suggest.insertTo(board);
			suggest.dom().className="suggest";
			suggest.xy(cssxy);
			suggest.current=Key.get(p);
		}
		
		var hideFlag=function(){
			if(suggest.parent()){
				suggest.remove();
				suggest.current=false;
			}
		}
		
		Event.listen("record-play",function(){
			if(suggest.parent()){
				suggest.remove();
			}
		});
		
		return {
			noplace: false,
			create: create,
			click: handleClick,
			suggest: handleMove,
			showFlag: showFlag,
			hideFlag: hideFlag
		}
	}();
	
	var init=function(){
	
		if(arguments.callee.done){
			return;
		}
	
		board=E("chess");
		boardxy=board.xy();
		doc=E(document);

		load();
		
		arguments.callee.done=true;
	}
	
	var load=function(isPlayingRecord){
		if(Record.playing&&!isPlayingRecord){
			return;
		}
		
		try{
			Record.clean();
			Ground.create();
			Grave.create();
			Actors.load();
			Events.bind();
		}catch(e){alert(e.message);}
	}
	
	var changeBattle=function(){
		mine=mine=="red"?"black":"red";
	}
	
	var Actors={
		red: [],
		black: [],
		load: function(){
		
			if(this.done){
				while(this.red.length){
					try{
						this.red.pop().remove();
					}catch(e){
					}
				}
				
				while(this.black.length){
					try{
						this.black.pop().remove();
					}catch(e){
					}
				}
			}
		
			for( var i=0, tb, tr; i<men.length; i++){
				tb=new Chessman(men[i]);
				
				tb.move(men[i].xy);
				
				this[men[i].xy.color].push(tb);
			}
			
			this.done=true;
		},
		
		done: false
	}
	
	var Grave={
		red: false,
		black: false,
		list: {
			red: [],
			black: []
			},
		placeholder: false,
		bury: function(man){	//chessman
			
			this.list[man.color].push(man);
			
			if(man.color==mine){
				this[man.color].appendChild(man.node);
			}else{
				if(this.list[man.color].length%2){
					this[man.color].insertBefore(this.placeholder,this[man.color].first());
					this[man.color].insertBefore(man.node,this.placeholder);
					this[man.color].height(parseInt(this.list[man.color].length/2)*50+50);
				}else{
					this[man.color].insertBefore(man.node,this.placeholder);
					this.placeholder.remove();
				}
			}
			
		},
		resurvive: function(man){
		
			var m=false;
			for( var i=this.list[man.color].length-1; i>=0; i--){
				if(this.list[man.color][i].name==man.name){
					m=this.list[man.color].splice(i,1)[0];
					break;
				}
			}
			
			if(!m){
				return false;
			}
			
			if(man.color!=mine){
				m.remove();
				if(this.list[man.color].length%2){
					if(this.list[man.color].length>1){
						this[man.color].insertBefore(this.placeholder,this[man.color].first().next());
					}else{
						this[man.color].appendChild(this.placeholder);
					}
				}else{
					this.placeholder.remove();
					this[man.color].height(parseInt(this.list[man.color].length/2)*50);
				}
			}
			
			return m;
		},
		create: function(){
		
			if(this.done){
				while(this.list.red.length){
					this.list.red.pop();
				}
				while(this.list.black.length){
					var t=this.list.black.pop();
				}

				if(this.placeholder.parent()){
					this.placeholder.remove();
				}

			}else{
			
				this.red=new E("div");
				this.black=new E("div");
				
				this.placeholder=new E("div");
				
				board.parent().appendChild(this.red);
				board.parent().appendChild(this.black);
				
				this.done=true;
			}
			if(mine=="red"){
				this.black.addClass("mygrave");
				this.red.addClass("hisgrave");
				this.black.removeClass("hisgrave");
				this.red.removeClass("mygrave");
			}else{
				this.red.addClass("mygrave");
				this.black.addClass("hisgrave");
				this.red.removeClass("hisgrave");
				this.black.removeClass("mygrave");
			}
		},
		
		done: false
	};
	
	var getCssxy=function(){
		if(!arguments.length){
			return false;
		}
		
		var p=new Place(arguments);
		
		if(p.color==mine){
			//{x:0,y:0,c:mine}	top: 450, left: 0
			
			return {left: p.x*50, top: 450-p.y*50};
		}else{
			return {top: p.y*50, left: 400-p.x*50};
		}
	}
	
	var getxy=function(xy){
		var x=parseInt(xy.left/50);
		var y=parseInt(xy.top/50);
		var c=mine;
		
		if(y<5){
			c=mine=="red"?"black":"red";
		}
		
		if(c==mine){
			y=9-y;
		}else{
			x=8-x;
		}
		
		return new Place(x,y,c);
	}
	
	var Place=function(){
		var x,y,c,arg;
		
		if(arguments.length==1&&arguments[0].length){
			arg=arguments[0];
		}else{
			arg=arguments;
		}
		
		if(arg.length==1){			// for format {x: v1, y: v2, color: v3 }
			x=arg[0].x;
			y=arg[0].y;
			c=arg[0].color;
		}else if(arg.length==2){		// for format {x: v1, y: v2} and color
			x=arg[0].x;
			y=arg[0].y;
			c=arg[1];
		}else{
			x=arg[0];
			y=arg[1];
			c=arg[2];
		}
		
		this.x=x;
		this.y=y;
		this.color=c;
	};
	
	var Key={
		special: "$isakey",
		get: function(){
			var p=new Place(arguments);
			return this.special+p.x+"-"+p.y+"-"+p.color;
		},
		valid: function(str){
			return str.indexOf(this.special)==0;
		}
	}

	var Chessman=function(data){
		this.name=data.name;
		this.actor=data.actor;
		this.color=data.color;
		
		this.node=new E("div",{className:this.color+"-"+this.actor});
		this.node.insertTo(board);
		this.pos=data.xy;
		this.key="noplace";
		this.place="noplace";
	}
	
	Chessman.prototype={
		move: function(){
			
			var _newxy=new Place(arguments);
			
			var _pos=getCssxy(_newxy);
			
			if(this.key!="noplace"){
				var _old=new Place(this.place);
				if(!this.rules(_old,_newxy)&&!Record.playing){
					return false;
				}
			}
			
			Ground[this.key]=false;
			
			var key=Key.get(_newxy);
			
			var _killed=false;
			if(Ground[key]&&Ground[key].color!=this.color){
				_killed={
					actor: Ground[key].actor,
					name: Ground[key].name,
					color: Ground[key].color
				};
				Ground[key].killed();
			}
			
			Event.fire("chessman-move",{
				p1:this.place,
				p2:_newxy,
				man: {
					actor: this.actor,
					name: this.name,
					color: this.color
				},
				killed: _killed
			});
			
			Ground[key]=this;
			
			this.key=key;
			
			this.xy(_pos);
			this.place=_newxy;
			
			return true;
		},
		
		xy: function(){
			if(!arguments.length){
				return this.pos;
			}else{
				this.node.xy.apply(this.node,arguments);
			}
		},
		
		killed: function(){
			this.node.remove();
			Ground[this.key]=false;
			this.key="noplace";
			this.place="noplace";
			Grave.bury(this);
		},
		
		active: function(){
			this.node.addClass("active");
		},
		
		unactive: function(){
			this.node.removeClass("active");
		},
		
		remove: function(){
			this.node.remove();
		},
		
		rules: function(p1,p2){
			
			var x1,x2,y1,y2,t;
			
			switch(this.actor){
				case "chariot":
					if(p1.color==p2.color?(p1.x==p2.x||p1.y==p2.y):p1.x+p2.x==8){
					
						if(p1.color==p2.color&&p1.y==p2.y){
							x1=p1.x>p2.x?p2.x:p1.x;
							x2=p1.x>p2.x?p1.x:p2.x;
							for( var i=x1+1; i<x2; i++){
								if(Ground[Key.get(i,p1.y,p1.color)]){
									return false;
								}
							}
							return true;
						}
						
						if(p1.color==p2.color){
							y1=p1.y>p2.y?p2.y:p1.y;
							y2=p1.y>p2.y?p1.y:p2.y;
							for( var i=y1+1; i<y2; i++){
								if(Ground[Key.get(p1.x,i,p1.color)]){
									return false;
								}
							}
							return true;
						}
						
						for( var i=p1.y+1; i<5; i++){
							if(Ground[Key.get(p1.x,i,p1.color)]){
								return false;
							}
						}
						
						for( var i=p2.y+1; i<5; i++){
							if(Ground[Key.get(p2.x,i,p2.color)]){
								return false;
							}
						}
						
						return true;
					
					}
					return false;
					
				case "horse":
					if(p1.color==p2.color){
						return ((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y)==5)&&!Ground[Key.get(parseInt((p1.x+p2.x+(p2.x<p1.x))/2),parseInt((p1.y+p2.y+(p2.y<p1.y))/2),p1.color)];
					}else{
						//alert(Key.get(p1)+" : "+Key.get(p2)+" : "+((p1.x+p2.x-8)*(p1.x+p2.x-8)+(p1.y+p2.y-9)*(p1.y+p2.y-9)==5));
						if((p1.x+p2.x-8)*(p1.x+p2.x-8)+(p1.y+p2.y-9)*(p1.y+p2.y-9)==5){
							if(p1.y==p2.y){
								if(Ground[Key.get((p1.x+8-p2.x)/2,p1.y,p1.color)]){
									return false;
								}
								return true;
							}else{
								if(Ground[Key.get(p1.y>p2.y?8-p1.x:p1.x,4,p1.y>p2.y?p2.color:p1.color)]){
									return false;
								}
								return true;
							}
						}
						return false;
					}
					return false;
					
				case "minister":
					return p1.color==p2.color&&(p1.x-p2.x)*(p1.x-p2.x)==4&&(p1.y-p2.y)*(p1.y-p2.y)==4&&!Ground[Key.get((p1.x+p2.x)/2,(p1.y+p2.y)/2,p1.color)];
					
				case "kavass":
					return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y)==2&&p1.x>2&&p1.x<6&&p2.x>2&&p2.x<6&&p1.y<3&&p2.y<3;
					
				case "king":
					return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y)==1&&p1.x>2&&p1.x<6&&p2.x>2&&p2.x<6&&p1.y<3&&p2.y<3;
				
				case "pawn":
					if(p1.color==p2.color){
						if(p1.color==this.color){
							return p1.x==p2.x&&p2.y-p1.y==1;
						}else{
							return p2.y<=p1.y&&(p1.x-p2.x)*(p1.x-p2.x)+p1.y-p2.y==1;
						}
					}else{
						return p1.color==this.color&&p1.y==4&&p2.y==4&&p1.x+p2.x==8;
					}
					
				case "emplacement":
					t=false;
					var stuffle=0;
					if(Ground[Key.get(p2)]){
						t=true;
					}
					if(p1.color==p2.color?(p1.x==p2.x||p1.y==p2.y):p1.x+p2.x==8){
						if(p1.color==p2.color&&p1.y==p2.y){
							x1=p1.x>p2.x?p2.x:p1.x;
							x2=p1.x>p2.x?p1.x:p2.x;
							for( var i=x1+1; i<x2; i++){
								if(Ground[Key.get(i,p1.y,p1.color)]){
									stuffle++;
								}
							}
							
							return t?stuffle==1:stuffle==0;
						}
						
						if(p1.color==p2.color){
							y1=p1.y>p2.y?p2.y:p1.y;
							y2=p1.y>p2.y?p1.y:p2.y;
							for( var i=y1+1; i<y2; i++){
								if(Ground[Key.get(p1.x,i,p1.color)]){
									stuffle++;
								}
							}
							return t?stuffle==1:stuffle==0;
						}
						
						for( var i=p1.y+1; i<5; i++){
							if(Ground[Key.get(p1.x,i,p1.color)]){
								stuffle++;
							}
						}
						
						for( var i=p2.y+1; i<5; i++){
							if(Ground[Key.get(p2.x,i,p2.color)]){
								stuffle++;
							}
						}
						
						return t?stuffle==1:stuffle==0;
					}
					return false;
			}
			
			return true;
		}
	}
	
	var Events=function(){
		var done=false;
		
		var preventDefault=function(e){
			e.preventDefault();
		}
		
		var bind=function(){
			if(done){
				return;
			}
			
			board.bind("click",Ground.click);
			board.bind("mousemove",Ground.suggest);
			doc.bind("mousedown",preventDefault);
			
			Event.listen("record-play",unbind);
			
			done=true;
		}
		
		var unbind=function(){
			if(!done){
				return;
			}
			
			board.unbind("click",Ground.click);
			board.unbind("mousemove",Ground.suggest);
			doc.unbind("mousedown",preventDefault);
			
			Event.stopListen("record-play",unbind);
			
			done=false;
		}
		
		return {
			bind: bind,
			unbind: unbind
		}
	}();
	
	
	var Record=function(){
	
		var data={
			ground: [],
			steps: []
		};
		
		var screenshot=function(){
			var t, thumbs=[];
			for( var method in Ground ){
				if(Key.valid(method)&&Ground[method]){
					t={
						name: Ground[method].name,
						actor: Ground[method].actor,
						color: Ground[method].color,
						xy: Ground[method].place
					};
					
					thumbs.push(serial(t));
				}
			}
			
			return thumbs;
		}
	
		var play=function(tape){
		
			if(record.playing){
				return;
			}
		
			men=tape.ground;
			
			record.playing=true;
			
			try{
				load(true);
				men=originalMen;
			}catch(e){
				alert(e.message);
			}
			
			var i=0, key1, key2, playing=true;
			
			var once=-1;
			
			var next=function(){
			
				if(once!=-1){
					once--;
				}
				
				if(!once){
					once=-1;
					play.oprating=false;
					return;
				}
			
				key1=setTimeout(function(){
					if(i<tape.steps.length){
						
						var _oldKey=Key.get(tape.steps[i].p1);
						Ground[_oldKey].active();
						
						Ground.showFlag(tape.steps[i].p2);

						key2=setTimeout(nextdeal,1000);
					}else{
						record.playing=false;
						record.paused=false;
						play.oprating=false;
						playing=false;
						data.ground=screenshot();
						Event.fire("playing-end");
						alert("Playing End.");
					}
				},500);
			}
			
			var nextdeal=function(){
				var _oldKey=Key.get(tape.steps[i].p1);
				Ground[_oldKey].unactive();
				Ground[_oldKey].move(tape.steps[i].p2);
				Ground.hideFlag();
				i++;
				next();
			}
			
			next();
			
			play.oprating=false;
			
			Event.listen("pause-play", function(){
			
				if(!record.playing||!playing){
					return;
				}
				
				playing=false;
			
				if(key1){
					clearTimeout(key1);
				}
				
				if(key2){
					clearTimeout(key2);
					var _oldKey=Key.get(tape.steps[i].p1);
					Ground[_oldKey].unactive();
					Ground.hideFlag();
				}
			
			});
			
			Event.listen("play-record", function(){
				if(!record.playing||playing||play.oprating){
					return;
				}
				
				playing=true;
				next();
			});
			
			Event.listen("next-step", function(){
				if(!record.playing||!record.paused||play.oprating){
					return;
				}
				play.oprating=true;
				once=2;
				next();
				
			});
			
			Event.listen("previous-step", function(){
				if(!record.playing||!record.paused||play.oprating){
					return;
				}
				play.oprating=true;
				
				setTimeout(function(){
				
					if(i<1){
						play.oprating=false;
						return;
					}
				
					i--;
					if(i<tape.steps.length){
						var _oldKey=Key.get(tape.steps[i].p2);
						Ground[_oldKey].active();
						
						Ground.showFlag(tape.steps[i].p1);

						setTimeout(function(){
							var _oldKey=Key.get(tape.steps[i].p2);
							Ground[_oldKey].unactive();
							Ground[_oldKey].move(tape.steps[i].p1);
							Ground.hideFlag();
							
							if(tape.steps[i].killed){
								var m=Grave.resurvive(tape.steps[i].killed);
								m.node.insertTo(board);
								m.move(tape.steps[i].p2);
							}

							play.oprating=false;
						},1000);
					}
				},500);
				
			});
		
		}
		
		var record=function(arg){
		
			if(record.playing){
				return;
			}
			
			//{ name: "chariot1", actor: "chariot", xy: { x: 0, y: 0, color:"red" }},
			if(arg.p1=="noplace"){
			
				var t={
					name: arg.man.name,
					actor: arg.man.actor,
					color: arg.man.color,
					xy: arg.p2
				}
				
				data.ground.push(serial(t));
			}else{
				data.steps.push(serial(arg));
			}
		}
		
		var serial=function(arg){
			
			if(typeof arg=="string"){
				return "\""+arg+"\"";
			}
			
			if(typeof arg=="number"||typeof arg=="boolean"){
				return arg;
			}
			
			if(arg instanceof Array){
				var t=[];
				for( var i=0; i<arg.length; i++){
					t.push(arguments.callee(arg[i]));
				}
				return "["+t.join(",")+"]";
			}
			
			var str="";
			if(typeof arg=="object"){
				var t=[];
				for( var method in arg ){
					if(typeof arg[method]=="function"){
						continue;
					}
					
					t.push("\""+method+"\":"+arguments.callee(arg[method]));
				}
				return "{"+t.join(",")+"}";
			}
		}
		
		var rollback=function(){
		
			if(record.playing||!data.steps.length){
				return;
			}
		
			var p=data.steps.pop();
			
			var s=json(p);
			
			record.playing=true;
			
			if(current){
				current.unactive();
				current=false;
			}
			
			var _oldKey=Key.get(s.p2);
			
			current=Ground[_oldKey];
			
			if(current.name!=s.man.name){
				alert("rollback actor error!");
				return false;
			}
			
			current.active();
			
			Ground.showFlag(s.p1);
			
			setTimeout(function(){
				try{
					
					current.move(s.p1);
					
					current.unactive();
					current=false;
					
					Ground.hideFlag();
					
					if(s.killed){
						var k=s.killed;
						var m=Grave.resurvive(s.killed);

						m.node.insertTo(board);
						m.move(s.p2);
					}
					
					record.playing=false;
				
				}catch(e){
					alert(e.message+" line:"+e.lineNumber);
				}
			},700);
		}
		
		var pause=function(){
			record.paused=true;
		}
		
		var goonplay=function(){
			record.paused=false;
		}
		
		var json=function(str){
			return (new Function("return "+str))();
		}
		
		record.play=play;
		
		record.rollback=rollback;
		
		record.playing=false;
		record.paused=false;
		
		record.clean=function(){
			data={
				ground: [],
				steps: []
			};
		}
		
		Event.listen("chessman-move",record);
		
		Event.listen("show-record",function(){
			alert("{ground:["+data.ground.join(",")+"],steps:["+data.steps.join(",")+"]}");
		});
		
		Event.listen("pause-play",function(button){
			button.value="Play";
			button.onclick=function(){
				Event.fire("play-record",button);
			}
			pause();
		});
		
		Event.listen("playing-end",function(){
			E("play-record").dom().value="Play";
			E("play-record").dom().onclick=function(){
				Event.fire("play-record",this);
			}
		});
		
		var readHandle=false;
		Event.listen("play-record",function(button){
		
			if(play.oprating){
				return;
			}
		
			if(Record.playing){
				if(Record.paused){
					button.value="Pause";
					button.onclick=function(){
						Event.fire("pause-play",this);
					};
					goonplay();
				}
				return;
			}
			
			if(readHandle){
				Ajax.cancel(readHandle);
			}
			
			try{
				readHandle=Ajax.request({
					url: "record3.json",
					returnType: "json",
					success: function(arg){
						button.value="Pause";
						button.onclick=function(){
							Event.fire("pause-play",this);
						};
						play(arg);
					}
				});
			}catch(e){
				alert(e.message+" line:"+e.lineNumber);
			}
		});
	
		return record;
	
	}();
	
	window.LOAD.push(init);
	
	Event.listen("rollback",function(){
		Record.rollback();
	});
	
	Event.listen("start-game",function(){
		load();
	});

})();