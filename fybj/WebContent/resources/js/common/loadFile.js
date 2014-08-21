(function(){
	/*第一种方式
		common.loaderJs.on("loaded", PgisMap.loadGMapCallBack);
		common.loaderJs.load({
			script:['jslib/MapExpress/MapExpress.js']
		});
		common.loaderJs.un("loaded", PgisMap.loadEzMapCallBack)
	*/
	ModuleLoader = function(config) {  		
		Ext.apply(this, config);  
		this.addEvents({  
			"loaded" : true  
		});  
	};  
	Ext.extend(ModuleLoader, Ext.util.Observable, { 
		dom: new Array(),
		loadedCount: 0,	
		load: function(path) {  
			var th = this;
			if(path.script){
				if(!path.script.pop) path.script = [path.script];  			   
			for (var i=0; i<path.script.length; i++) {				 
				 this.dom[i] = document.createElement("script");  
				 this.dom[i].src = path.script[i];  
				 document.getElementsByTagName("head")[0].appendChild(this.dom[i]);                     
			 }  
			 
			 for(var i=0; i<this.dom.length; i++){
				if(Ext.isIE){
					this.dom[i].onreadystatechange = this.fireLoaded.createDelegate(this);
				}else{  
					this.dom[i].onload = this.fireLoaded.createDelegate(this);
				}	
			 }

		   }			        
		},
		fireLoaded: function(){
			for (var i=0; i<this.dom.length; i++) {
				if (this.dom[i].readyState && this.dom[i].readyState == "loading")   
					return;  
				else
					this.loadedCount++;				    		
			}  
			
			if(this.loadedCount >= this.dom.length)
			{   
				this.fireEvent('loaded', this);
				this.dom = new Array(); 
			}                              	
		}         	
	}); 
	
	/*第二种方式
		common.ScriptMgr.load({
		  scripts: ['jslib/MapExpress/MapExpress.js'],
		  callback: PgisMap.loadGMapCallBack				  
		}); 
	*/
	ScriptLoader = function() {
		this.timeout = 30;
		this.scripts = [];
		this.disableCaching = false;
		this.loadMask = null;
	};
	
	ScriptLoader.prototype = {
		showMask: function() {
		  return;
		  if (!this.loadMask) {
			this.loadMask = new Ext.LoadMask(Ext.getBody());
			this.loadMask.show();
		  }
		},
		hideMask: function() {
		  return;
		  if (this.loadMask) {
			this.loadMask.hide();
			this.loadMask = null;
		  }
		},
		processSuccess: function(response) {
		  this.scripts[response.argument.url] = true;
		  window.execScript ? window.execScript(response.responseText) : window.eval(response.responseText);
		  if (response.argument.options.scripts.length == 0) {
			this.hideMask();
		  }
		  if (typeof response.argument.callback == 'function') {
			response.argument.callback.call(response.argument.scope);
		  }
		},
		processFailure: function(response) {
		  this.hideMask();
		  Ext.MessageBox.show({title: 'Application Error', msg: 'Script library could not be loaded.', closable: false, icon: Ext.MessageBox.ERROR, minWidth: 200});
		  setTimeout(function() { Ext.MessageBox.hide(); }, 3000);
		},
		load: function(url, callback) {
			var cfg, callerScope;
			if (typeof url == 'object') { // must be config object
				cfg = url;
				url = cfg.url;
				callback = callback || cfg.callback;
				callerScope = cfg.scope;
				if (typeof cfg.timeout != 'undefined') {
					this.timeout = cfg.timeout;
				}
				if (typeof cfg.disableCaching != 'undefined') {
					this.disableCaching = cfg.disableCaching;
				}
			}
			if (this.scripts[url]) {
				if (typeof callback == 'function') {
					callback.call(callerScope || window);
				}
				return null;
			}
			this.showMask();
			Ext.Ajax.request({
				url: url,
				success: this.processSuccess,
				failure: this.processFailure,
				scope: this,
				timeout: (this.timeout*1000),
				disableCaching: this.disableCaching,
				argument: {
					url: url,
					'scope': callerScope || window,
					'callback': callback,
					'options': cfg
				}
			});
		}
	};
	ScriptLoaderMgr = function() {
		this.loader = new ScriptLoader();
		this.load = function(o) {
			if (!Ext.isArray(o.scripts)) {
				o.scripts = [o.scripts];
			}
			o.url = o.scripts.shift();
			if (o.scripts.length == 0) {
				this.loader.load(o);
			} else {
				o.scope = this;
				this.loader.load(o, function() {
				this.load(o);
			});
		  }
		};
	};
	
	/*第三种方式
		Ext.ux.OnDemandLoad.load('layout.js','initAccountSelect');
		
		function initAccountSelect(){
		   win.show(); // define in hello.js
		}
	*/
	Ext.namespace('Ext.ux');
	Ext.ux.OnDemandLoad = function(){		
		loadComponent = function(component,callback){
		var fileType = component.substring(component.lastIndexOf('.'));
		var head = document.getElementsByTagName("head")[0];
		var done = false;
		if (fileType === ".js") {
			var fileRef = document.createElement('script');
			fileRef.setAttribute("type", "text/javascript");
			fileRef.setAttribute("src", component);
			fileRef.onload = fileRef.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") ) {
				done = true;
				if(callback){
					eval(callback+'()');
				}
				head.removeChild(fileRef);
			}
			};
		}
		else if (fileType === ".css") {
			var fileRef = document.createElement("link");
			fileRef.setAttribute("type", "text/css");
			fileRef.setAttribute("rel", "stylesheet");
			fileRef.setAttribute("href", component);
		}
		if (typeof fileRef != "undefined") {
			head.appendChild(fileRef);
		}
		};		
		return {
			load: function(components, callback){
				Ext.each(components, function(component){
					loadComponent(component,callback);
				});
			}
		};
	}();
	
	
	
	window.common = {};
	window.common.loaderJs = new ModuleLoader(); 
	
	ScriptMgr = new ScriptLoaderMgr();  
	window.common.ScriptMgr = ScriptMgr;
	
	
})();