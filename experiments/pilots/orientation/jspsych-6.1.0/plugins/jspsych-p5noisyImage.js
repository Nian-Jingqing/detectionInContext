jsPsych.plugins["noisyImage"] = (function() {

	var plugin = {};

	plugin.info = {
		name: 'noisyImage',
		parameters: {
			image: {
					type: jsPsych.plugins.parameterType.IMAGE,
					default: '',
				},
			context_image: {
				type: jsPsych.plugins.parameterType.IMAGE,
				default: ''
			},
			duration: {
				type: jsPsych.plugins.parameterType.INT,
				default: 2000,
			},
			pixel_size_factor: {
				type: jsPsych.plugins.parameterType.INT,
				default: 5,
				description: 'the actual width in pixels of every pixel in the image'
			},
			min_p: {
				type: jsPsych.plugins.parameterType.FLOAT,
				default: 0.1,
				description: 'probability of showing true value for first frame'
			},
			max_p: {
				type: jsPsych.plugins.parameterType.FLOAT,
				default: 0.4,
				description: 'max probability of showing true value'
			},
			delta_p: {
				type: jsPsych.plugins.parameterType.FLOAT,
				default: 0.005,
				description: 'increase in probability per frame'
			},
			frame_rate: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: "Frame rate",
				default: 15,
				description: "Frame rate (Hz)"
			}
		}
	}

	plugin.trial = function(display_element, trial) {

		display_element.innerHTML = ''

		//open a p5 sketch
		let sketch = function(p) {

		//sketch setup

		p.preload = function () {
			img = p.loadImage(trial.image);
			context = p.loadImage(trial.context_image);
		}

		p.setup = function() {
			p.createCanvas(window.innerWidth, window.innerHeight);
			p.fill(255); //white
			p.strokeWeight(0)
			p.background(128); //gray
			p.frameRate(trial.frame_rate);
			p.textFont('Quicksand');
      p.rectMode(p.TOP, p.LEFT);
			p.imageMode(p.CENTER);
			img.loadPixels();

			window.img_pixel_data = [];
			window.presented_pixel_data = [];

			for (let y = 0; y < img.height; y++) {
				var row = [];
    		for (let x = 0; x < img.width; x++) {
      		row.push(img.get(x,y))
				}
				window.img_pixel_data.push(row);
			}

			// determine top left point of iamge
			window.ref_x = p.innerWidth/2;
			window.ref_y = p.innerHeight/2;

			window.frame_number = 0;
		}


		//organize everything in one sequence
		p.draw = function() {
			p.background(128); //gray
			p.image(context,p.width/2,p.height/2,
				width=context.width*trial.pixel_size_factor,
				height=context.height*trial.pixel_size_factor);
			presented_frame = [];
			for (let y = 0; y < img.height; y++) {
				presented_row = [];
				for (let x = 0; x < img.width; x++) {
					p.push()

					color = window.img_pixel_data[y][x]
					if (Math.random() <= Math.min(trial.min_p+trial.delta_p*window.frame_number,trial.max_p) & color[3]>0) {
						p.fill(window.img_pixel_data[y][x]);
						presented_row.push(window.img_pixel_data[y][x]);
					} else {
						// random_x = Math.floor(Math.random()*img.width);
						// random_y = Math.floor(Math.random()*img.height);
						// p.fill(window.img_pixel_data[random_y][random_x]);
						random_number = Math.random()*255;
						p.fill(Math.random()*255);
						presented_row.push(random_number);
					}
					p.translate(p.width/2+x*trial.pixel_size_factor - img.width/2*trial.pixel_size_factor,
						p.height/2+y*trial.pixel_size_factor - img.height/2*trial.pixel_size_factor)
					p.rect(0,0,trial.pixel_size_factor,trial.pixel_size_factor)
					p.pop()
				}
				presented_frame.push(presented_row);
			}
			window.presented_pixel_data.push(presented_frame);
			window.frame_number++

		}


		p.keyPressed = function() {
			// it's only possible to query the key code once for each key press,
			// so saving it as a variable here:
			var key_code = p.keyCode
			// only regard relevant key presses during the response phase
				trial.response = String.fromCharCode(key_code).toLowerCase();
				trial.RT = p.millis();
				p.remove()
				// data saving
				var trial_data = {
					presented_pixel_data: window.presented_pixel_data,
					RT: trial.RT,
					response: trial.response,
				};

				// end trial
				jsPsych.finishTrial(trial_data);
		}

	}

		// start sketch!
		let myp5 = new p5(sketch);
}
//

//Return the plugin object which contains the trial
return plugin;
})();
