import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import {display, center_text, box_text} from "./components";

module.exports = function(jsPsych) {

    const values = [
        { center_text: "S\toder\tH?", target: "HH HH", context: "top", keys: ["s", "h"] },
        { center_text: "S\toder\tH?", target: "SS SS", context: "top", keys: ["s", "h"] },
        { center_text: "S\toder\tH?", target: "HH HH", context: "bottom", keys: ["s", "h"] },
        { center_text: "S\toder\tH?", target: "SS SS", context: "bottom", keys: ["s", "h"] },
        { center_text: "A\toder\tF?", target: "AA AA", context: "top", keys: ["a", "f"] },
        { center_text: "A\toder\tF?", target: "FF FF", context: "top", keys: ["a", "f"] },
        { center_text: "A\toder\tF?", target: "AA AA", context: "bottom", keys: ["a", "f"] },
        { center_text: "A\toder\tF?", target: "FF FF", context: "bottom", keys: ["a", "f"] },
    ];
    
    const target = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: () => display(
            center_text(jsPsych.timelineVariable("center_text")),
            box_text(jsPsych.timelineVariable("target"), [jsPsych.timelineVariable("context")])
        ),
        data: () => ({
            box_text: jsPsych.timelineVariable("target"),
            box_class: jsPsych.timelineVariable("context"),
        }),
        choices: () => jsPsych.timelineVariable("keys"),
    };

    const answer = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: () => {
            const answer = jsPsych.data.getLastTrialData().trials[0].response.toUpperCase();
            return display(
            box_text(jsPsych.timelineVariable("target").split(" ").join(answer),
            [jsPsych.timelineVariable("context"), "green"])
        )},
        choices: "NO_KEYS",
        trial_duration: 500,
    };

    const iti = {
        type: HtmlKeyboardResponsePlugin,
        stimulus: display(),
        choices: "NO_KEYS",
        trial_duration: 500,
    };
        
    return {
        timeline: [target, answer, iti],
        timeline_variables: values,
        sample: {
            type: "without-replacement"
        }
    }
};
