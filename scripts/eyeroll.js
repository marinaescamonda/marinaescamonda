(function(){

	var eyeRects = [];
	var eyes = [];
	var scrollTop =0;
	var mousePositions =[];
	var eyesIntensity = [];
	var eyeRotations = [];
	var eyeRange = [];
	var eyeLooks = [];
	var eyeStartingRotations = [];


	var updateEyeRects = function(){
		eyeRects = [];
		scrollTop = 0;
		_.each(eyes, function(eye, index){
			eyeRects[index] = eye.getBoundingClientRect();
	    });
	}

	var initEyes = function(){

		eyes = document.querySelectorAll('.content [data-caption*="#eye"]');

		if ( Cargo.Helper.IsAdminEdit() ){

			_.each(eyes, function(eye, index){
				var $cardParent = $(eye).closest('.gallery_card');
				if ( $cardParent.length == 0){
					return;
		        }
				$cardParent.find('.gallery_image_caption').hide();

			});
	    	return;
		}


		updateEyeRects();
		var rotation = 0;

		_.each(eyes, function(eye, index){
			eyeRotations[index] = rotation;
			eyeLooks[index] = {x: 0, y: 0};
			var caption = eye.getAttribute('data-caption');
			caption = caption.split(' ');

			if ( eye.hasAttribute('data-rotation') ){
				eyeStartingRotations[index] = parseInt(eye.getAttribute('data-rotation')) * (Math.PI/180)
			} else {
				eyeStartingRotations[index] = 0;
			}			

			var range = 1;
			var eyeIntensity = 0.5;
			_.each(caption, function(key, index){
				if ( key.indexOf("rollspeed:") > -1 ){
					var components = key.split(':')
					eyeIntensity = parseFloat(components[1]);
					eyeIntensity = eyeIntensity*1 + (1-eyeIntensity)*.1;
					eyeIntensity = eyeIntensity*eyeIntensity;
				}
				if ( key.indexOf("range:") > -1 ){
					var components = key.split(':')
					range = parseFloat(components[1])
				}
			});

			if ( !isNaN(parseFloat(caption)) ){
				eyeIntensity = parseFloat(caption);
			}

			eyeRange[index] = range;
			eyesIntensity[index] = eyeIntensity;

			var $cardParent = $(eye).closest('.gallery_card');
			if ( $cardParent.length == 0){
				return;
	        }

			$cardParent.find('.gallery_image_caption').hide();

			eye.style.transformOrigin = 'center';
			eye.style.transform = 'rotate('+(rotation+eyeStartingRotations[index])+'rad)'
	    });
	}

	var eyeLook = function(event){

		if ( eyes.length == 0){
			return;
		}

	    if ( mousePositions.length == 0){
		    return
	    }

	    _.each(eyeLooks, function(look, index){
	    	var intensity = eyesIntensity[index] || 1;

			look.x = (mousePositions[index%mousePositions.length].x)*intensity + (1-intensity)*look.x;
			look.y = (mousePositions[index%mousePositions.length].y)*intensity + (1-intensity)*look.y;

	    });

		_.each(eyes, function(eye, index){
			var rect = eyeRects[index];
			var centerX = rect.width*.5 + rect.left;
			var centerY = rect.height*.5 + rect.top + scrollTop;

			var rotation;
			if ( eyeRange[index] < 1){
				rotation = Math.atan2(eyeLooks[index].y,centerX-eyeLooks[index].x)+ -Math.PI*.5 ;
				rotation = rotation*eyeRange[index];

			} else {
				rotation = Math.atan2(eyeLooks[index].y - centerY,eyeLooks[index].x - centerX)+ Math.PI*.5;
				rotation = rotation*eyeRange[index];				
			}

		
			eye.style.transformOrigin = 'center';
			eye.style.transform = 'rotate('+(rotation+eyeStartingRotations[index])+'rad)'
			eye.style.transition = 'initial';

			eyeRotations[index] = rotation%(Math.PI*2);

	    });
	}

	var draw = function(){
		
		requestAnimationFrame(function(){
			draw();
		});
		eyeLook();
	}

	var updateMousePositions = function(event){
		mousePositions = [];
		if ( event.type == 'touchmove'){
			_.each(event.touches, function(touch){
				mousePositions.push({
					x: touch.clientX,
					y: touch.clientY
				});
        	});
    	} else {
			mousePositions = [ {x: event.clientX, y: event.clientY}];
		}
	}

	Cargo.Event.on('image_gallery_init_complete', initEyes);
	$(document).ready(initEyes);

	if ( !Cargo.Helper.IsAdminEdit() ){
		draw();

		window.addEventListener('touchmove', updateMousePositions, { passive: true }); 
		window.addEventListener('mousemove', updateMousePositions, { passive: true }); 
		window.addEventListener('scroll', function(){
		  updateEyeRects();
		  eyeLook();
		}, { passive: true });

		Cargo.Event.on('elementresizer_update_complete', updateEyeRects);

	} else {

		Cargo.Event.on('image_gallery_rendered', initEyes);

	}

})();
