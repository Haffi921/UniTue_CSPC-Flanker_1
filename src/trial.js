import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import {display, center_text, box_text} from "./components";

module.exports = function(jsPsych, sequence) {    
    function removeStim () {
        const stim = document.getElementsByClassName("target")[0];
        if (stim === null) {
            stim.removeChild(stim.firstChild);
        }
    }

    function getFeedbackText() {
        const data = jsPsych.data.getLastTrialData().trials[0];
        const feedback_text = data.response === null ? "Zu langsam" : (data.correct ? "" : "Fehler");
        const feedback_class = data.correct ? "" : "error";
        return box_text(feedback_text, ["feedback", jsPsych.timelineVariable("position"), feedback_class]);
    }

    const fixation = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: display(center_text("+")),
        choices: "NO_KEYS",
        trial_duration: 500,
    }
    
    const context = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: display(),
        choices: "NO_KEYS",
        trial_duration: 1000,
    }
    
    const distractor = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: () => display(box_text(jsPsych.timelineVariable("distractor"), [jsPsych.timelineVariable("position")])),
        choices: "NO_KEYS",
        trial_duration: 140,
    }
    
    const target = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: () => display(box_text(jsPsych.timelineVariable("target"), ["target", jsPsych.timelineVariable("position")])),
        choices: ['a', 'f', 'h', 's'],
        trial_duration: 1990,
        data: () => ({
            congruency: jsPsych.timelineVariable('congruency'),
            type: jsPsych.timelineVariable('type'),
            correct_key: jsPsych.timelineVariable('correct_key')
        }),
        on_load: function() {
            setTimeout(removeStim, 590)
        },
        on_finish: function(data) {
            data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_key);
        },
    }
    
    const feedback = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: () => display(getFeedbackText()),
        choices: "NO_KEYS",
        trial_duration: 1500,
    }
    
    return {
        timeline: [fixation, context, distractor, target, feedback],
        timeline_variables: sequence,
    };
};