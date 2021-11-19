/**
 * @title conflict-task
 * @description 
 * @version 0.1.0
 *
 * The following lines specify which media directories will be packaged and preloaded by jsPsych.
 * Modify them to arbitrary paths (or comma-separated lists of paths) within the `media` directory,
 * or just delete them.
 * @imageDir images
 * @audioDir audio
 * @videoDir video
 * @miscDir misc
 */

// You can import stylesheets (.scss or .css).
import "../styles/main.scss";

import { initJsPsych, JsPsych } from "jspsych";

import FullscreenPlugin from "@jspsych/plugin-fullscreen";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import PreloadPlugin from "@jspsych/plugin-preload";
import produce_sequence from "./sequence";

/**
 * This method will be executed by jsPsych Builder and is expected to run the jsPsych experiment
 *
 * @param {object} options Options provided by jsPsych Builder
 * @param {any} [options.input] A custom object that can be specified via the JATOS web interface ("JSON study input").
 * @param {"development"|"production"|"jatos"} options.environment The context in which the experiment is run: `development` for `jspsych run`, `production` for `jspsych build`, and "jatos" if served by JATOS
 * @param {{images: string[]; audio: string[]; video: string[];, misc: string[];}} options.assetPaths An object with lists of file paths for the respective `@...Dir` pragmas
 */
export async function run({ assetPaths, input = {}, environment }) {
  const jsPsych = initJsPsych();

  const timeline = [];

  // Preload assets
  timeline.push({
    type: PreloadPlugin,
    images: assetPaths.images,
    audio: assetPaths.audio,
    video: assetPaths.video,
  });

  // Welcome screen
  // timeline.push({
  //   type: HtmlKeyboardResponsePlugin,
  //   stimulus: "<p>Welcome!<p/>",
  // });

  // Switch to fullscreen
  // timeline.push({
  //   type: FullscreenPlugin,
  //   fullscreen_mode: true,
  // });

  const sequence = produce_sequence(1)

  const context_boxes_start = '<div class="boxes"><div class="top-box"></div><div class="bottom-box"></div>'
  const context_boxes_end = '</div>'
  const stimulus = (stim) => '<div class="stimulus target ' + jsPsych.timelineVariable('position') + '"><p>' + jsPsych.timelineVariable(stim) + '</p></div>'
  const removeStim = () => {
    const data = jsPsych.data.getLastTrialData().trials[0];
    if(data.response === null) {
      const stim = document.getElementsByClassName("target")[0];
      stim.parentNode.removeChild(stim);
    }
  }
  const feedback_stim = () => {
    const data = jsPsych.data.getLastTrialData().trials[0];
    const feedback_text = data.response === null ? "Zu langsam" : (data.correct ? "" : "Fehler");
    const feedback_class = data.correct ? "" : " feedback-error";
    return '<div class="stimulus ' + jsPsych.timelineVariable('position') + feedback_class + '"><p>' + feedback_text + '</p></div>';
  }

  const fixation = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: context_boxes_start + '<div class="fixation_cross"><p>+</p></div>' + context_boxes_end,
    choices: "NO_KEYS",
    trial_duration: 500,
  }

  const context = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: context_boxes_start + context_boxes_end,
    choices: "NO_KEYS",
    trial_duration: 1000,
  }

  const distractor = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: () => {
      return context_boxes_start + stimulus("distractor") + context_boxes_end;
    },
    choices: "NO_KEYS",
    trial_duration: 140,
  }

  const target = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: () => {
      return context_boxes_start + stimulus("target") + context_boxes_end;
    },
    choices: ['a', 'f', 'h', 's'],
    trial_duration: 1990,
    data: {
      congruency: jsPsych.timelineVariable('congruency'),
      type: jsPsych.timelineVariable('type'),
      correct_key: jsPsych.timelineVariable('correct_key')
    },
    on_load: function() {
      setTimeout(removeStim, 590)
    },
    on_finish: function(data) {
      data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_key);
    },
  }

  const feedback = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: () => {
      return context_boxes_start + feedback_stim() + context_boxes_end;
    },
    choices: "NO_KEYS",
    trial_duration: 1500,
  }

  timeline.push({
    timeline: [fixation, context, distractor, target, feedback],
    timeline_variables: sequence,
  })

  await jsPsych.run(timeline);

  // Return the jsPsych instance so jsPsych Builder can access the experiment results (remove this
  // if you handle results yourself, be it here or in `on_finish()`)
  return jsPsych;
}
