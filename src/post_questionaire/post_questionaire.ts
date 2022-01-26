/**
 * @title Post-Questionaire
 * @description 
 * @version 0.1.0
 */

 import "../../styles/main.scss";

 import { initJsPsych } from "jspsych";
 
 import { post_trial } from "./post_trial";
 
 // import fullscreen from "@jspsych/plugin-fullscreen";
 
 export async function run() {
    const jsPsych = initJsPsych();

    const timeline = [];

    const post = post_trial(jsPsych);

    timeline.push(
        post.post_trial_instructions,
        post.post_trial,
    );

    // timeline.push({ type: fullscreen, delay_after: 300 });

    await jsPsych.run(timeline);
 }