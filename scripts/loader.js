(function(){

	var jsVersion
	if ( __cargo_context__ !== "live" ){
		jsVersion = Date.now()+'';
	} else {
		jsVersion = __cargo_js_ver__;
	}


	var loadModules = function(){

		var scriptTags = document.querySelectorAll('script[data-name]');
		var scripts = {}
		_.each(scriptTags, function(script){
			var scriptName = script.getAttribute('data-name');
			if ( scriptName ){
				scripts['cargo-'+scriptName] = 'https://static.cargo.site/scripts/'+scriptName+'.js';				
			}
		});

		requirejs.config({

		    urlArgs: function(id, url) {
		    	if ( id.indexOf('static.cargo.site') > -1  ){
			        return "?v="+jsVersion		    		
		    	} else {
		    		return "";
		    	}

		    },

			map: {
				"*": scripts
		    }
		});

		var scriptKeys = _.keys(scripts);
		require(scriptKeys);
	}

	loadModules();
})();
