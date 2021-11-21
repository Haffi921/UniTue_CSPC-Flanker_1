import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
/* TODO: Change out for Instructions plugin */

import instruction_screen from "./components";

const instructions = [
    ""
];

module.exports = (JsPsych) => {
    const instructions = (text) => {
        return {
            type: HtmlKeyboardResponsePlugin,
            stimulus: instruction_screen(text),
            choices: ["space"],
        }
    }

    return {
        screens
    }
}