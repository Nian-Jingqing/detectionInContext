var jsNoisyLetter = (function (jspsych) {
  "use strict";

  const info = {
		name: 'noisyLetter',
		parameters: {
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

        //sketch setup
        p.setup = () => {
          p.createCanvas(window.innerWidth, window.innerHeight);
        }

        p.draw = () => {
          p.background(128); //gray
          p.text(window.text,p.width/2,p.height/2);

        }

        p.keyReleased = () => {
         
          var key_code = p.keyCode
			trial.response = String.fromCharCode(key_code).toLowerCase();
			p.remove()
			// data saving
			var trial_data = {
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
