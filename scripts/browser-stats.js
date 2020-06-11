(function(){

	var noPad = !String.prototype.padStart
	var timePanels =[];
	var datePanels = [];
	var widthPanels = [];
	var heightPanels = [];
	var scrollPanels = [];

	function pad(number) {
		return number < 10 ? '0'+ number : number
	}	

	var updateTimePanels = function(){
		var time = new Date(),
			hours = pad(time.getHours()),
			minutes = pad(time.getMinutes()),
			seconds = pad(time.getSeconds());
		_.each(timePanels, function(panel){
			panel.innerText =  hours + ':' + minutes + ':' + seconds;
		});
	}

	var updateDatePanels = function() {
		var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

		var time = new Date(),
			day = weekdays[time.getDay()],
			date = time.getDate(),
			month = months[time.getMonth()],
			year = time.getFullYear();

		_.each(datePanels, function(panel){
			panel.innerText = day + ' ' + month + ' ' + date + ' ' + year;
		})

	};

	var updateScrollPanels = function(){

		var scrollTop = document.scrollingElement.scrollTop;

		_.each(scrollPanels, function(panel){

			var multiplier = panel.getAttribute('multiplier') || 1;
			multiplier = parseFloat(multiplier);

			var offset = panel.getAttribute('offset') || 0;
			var trim = offset.toString().length;
       
			var value = Math.floor(scrollTop*multiplier+parseFloat(offset));
			if (!noPad){
				if ( value < 0 ){
                    value = value.toString();        
                	value = value.slice(1);
              		value = value.toString().padStart(trim,0)
                	value = '-'+value
            	} else {
              		value = value.toString().padStart(trim,0)              
            	}
			}

			panel.innerText =value;

		});
	}

	var updateHeightPanels = function(){

		var height = window.innerHeight;

     	_.each(heightPanels, function(panel){

			var multiplier = panel.getAttribute('multiplier') || 1;
			multiplier = parseFloat(multiplier);
       
			var offset = panel.getAttribute('offset') || 0;
			var trim = offset.toString().length;
       
        	var value = Math.floor(height*multiplier+parseFloat(offset));
			
	 		if (!noPad){
        		if ( value < 0 ){
		    		value = value.toString();        
                	value = value.slice(1);
              		value = value.toString().padStart(trim,0)
                	value = '-'+value
            	} else {
	              	value = value.toString().padStart(trim,0)              
    	        }
	        }
	        
			panel.innerText =value;       
		});
	}	

	var updateWidthPanels = function(){
		var width = window.innerWidth;

     	_.each(widthPanels, function(panel){

			var multiplier = panel.getAttribute('multiplier') || 1;
			multiplier = parseFloat(multiplier);
       
			var offset = panel.getAttribute('offset') || 0;
			var trim = offset.toString().length;
       
        	var value = Math.floor(width*multiplier+parseFloat(offset));
			
	 		if (!noPad){
        		if ( value < 0 ){
		    		value = value.toString();        
                	value = value.slice(1);
              		value = value.toString().padStart(trim,0)
                	value = '-'+value
            	} else {
	              	value = value.toString().padStart(trim,0)              
    	        }
	        }

			panel.innerText =value;       
		});
	}

	var dataPanels = [];

  	var tearDownPanels = function(){
  		_.each(dataPanels, function(panel){
  			panel.style.minWidth = '';
  			panel.style.display = '';
  			panel.innerHTML = '';
  		});
  	}
  
	var refreshData = function(){
    
		dataPanels = document.querySelectorAll('.data-panel');

		datePanels = [];
		timePanels = [];
		scrollPanels = [];
		widthPanels = [];
		heightPanels = [];


		_.each(dataPanels, function(panel){
	        if ( !panel.hasAttribute('infotype') ) {
				return;
	        }

			var type = panel.getAttribute('infotype');
	        switch(type){
	        	case "scroll":
		        	scrollPanels.push(panel);
		        	break;

	        	case "window_width":
	        		widthPanels.push(panel);
	        		break;

	        	case "window_height":
	        		heightPanels.push(panel);
	        		break;

	        	case "time":
	        		panel.style.minWidth = '8ch';
	        		panel.style.display = 'inline-block';
	        		timePanels.push(panel);
	        		break;

	        	case "date":
	        		datePanels.push(panel);
	        		break;
	        }
	    });

		updateScrollPanels();
		updateWidthPanels(); 
		updateHeightPanels(); 
		updateTimePanels();   
		updateDatePanels();
	}

	Cargo.Event.on('pageview_removed', refreshData);
	Cargo.Event.on('image_gallery_init_complete', refreshData);
	
	Cargo.Event.on('cargoEditor:before-html-to-projectcontent', function(){
		tearDownPanels();
		setTimeout(refreshData, 0);
	});	
  
	refreshData();

	setInterval(updateTimePanels, 1000);
 
	window.addEventListener('scroll', updateScrollPanels, {passive: true} )
	window.addEventListener('resize', function(){
		updateWidthPanels();
		updateHeightPanels();
	}, {passive: true} )
})();