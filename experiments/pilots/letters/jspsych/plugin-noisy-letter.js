var jsNoisyLetter = (function (jspsych) {
  "use strict";

  const info = {
		name: 'noisyLetter',
		parameters: {
			image: {
					type: jspsych.ParameterType.IMAGE,
					default: '',
				},
			context_image: {
				type: jspsych.ParameterType.IMAGE,
				default: ''
			},
			context_string: {
				type: jspsych.ParameterType.STRING,
				default: ' B LT'
			},
			pixel_size_factor: {
				type: jspsych.ParameterType.INT,
				default: 3,
				description: 'the actual width in pixels of every pixel in the image'
			},
			p_function: {
				type: jspsych.ParameterType.FUNCTION,
				default: (frame_index)=>{return 0.3},
				description: 'probability of showing true value as a function of frame_index'
			},
			frame_rate: {
				type: jspsych.ParameterType.INT,
				pretty_name: "Frame rate",
				default: 15,
				description: "Frame rate (Hz)"
			}
		}
	}

  /**
   * **PLUGIN-NAME**
   *
   * SHORT PLUGIN DESCRIPTION
   *
   * @author MATAN MAZOR
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */
  class NoisyLetterPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {

      display_element.innerHTML = '<div id="p5_loading" style="font-size:30px">+</div>';

      //open a p5 sketch
      let sketch = (p) => {

        p.preload = () => {
    			this.img = p.loadImage(trial.image);
    		}

        //sketch setup
        p.setup = () => {
          p.createCanvas(window.innerWidth, window.innerHeight);
          p.fill(255); //white
          p.strokeWeight(0)
          p.background(128); //gray
          p.frameRate(trial.frame_rate);
          p.textFont('Noto Sans Mono');
          p.textAlign(p.CENTER, p.CENTER)
          p.rectMode(p.TOP, p.LEFT);
          p.imageMode(p.CENTER);
          this.img.loadPixels();

          window.img_pixel_data = [];
          window.presented_pixel_data = [];

          for (let y = 0; y < this.img.height; y++) {
            var row = [];
            for (let x = 0; x < this.img.width; x++) {
              row.push(this.img.get(x,y))
            }
            window.img_pixel_data.push(row);
          }

          p.textSize(this.img.height*trial.pixel_size_factor);

          // determine top left point of image
          window.ref_x = p.innerWidth/2;
          window.ref_y = p.innerHeight/2;

          window.frame_number = 0;
        }

        p.draw = () => {
          p.background(128); //gray
          p.text(trial.context_string,p.width/2,p.height/2);
          var presented_frame = [];
          for (let y = 0; y < this.img.height; y++) {
            var presented_row = [];
            for (let x = 0; x < this.img.width; x++) {
              p.push()

              var color = window.img_pixel_data[y][x]
              if (Math.random() <= trial.p_function(window.frame_number)) {
                p.fill(window.img_pixel_data[y][x]);
                presented_row.push(window.img_pixel_data[y][x]);
              } else {
                var random_x = Math.floor(Math.random()*this.img.width);
                var random_y = Math.floor(Math.random()*this.img.height);
                p.fill(window.img_pixel_data[random_y][random_x]);
                presented_row.push(window.img_pixel_data[random_y][random_x]);
              }
              p.translate(p.width/2+x*trial.pixel_size_factor - this.img.width/2*trial.pixel_size_factor,
                p.height/2+y*trial.pixel_size_factor - this.img.height/2*trial.pixel_size_factor)
              p.rect(0,0,trial.pixel_size_factor,trial.pixel_size_factor)
              p.pop()
            }
            presented_frame.push(presented_row);
          }
          window.presented_pixel_data.push(presented_frame);
          window.frame_number++

        }

        p.keyPressed = () => {
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
            this.jsPsych.finishTrial(trial_data);
        }

    };


      let myp5 = new p5(sketch);
    }
  }
  NoisyLetterPlugin.info = info;

  return NoisyLetterPlugin;
})(jsPsychModule);
