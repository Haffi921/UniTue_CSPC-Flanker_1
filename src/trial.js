import produce_sequence from "./sequence";

const sequence = produce_sequence(1)

const container = (body) => '<div class="boxes">' + body + '</div>'
const context_box = (class_name) => '<div class="' + class_name + '"></div>'
const context_boxes = context_box("top-stim") + context_box("bottom-stim")

container(context_boxes)

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