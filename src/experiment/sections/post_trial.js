import InstructionsPlugin from "@jspsych/plugin-instructions";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import { display, trial_display, center_text, box_text } from "./components";

function instructions() {
  const continue_hint = "Please press the right arrow key to continue &#x27A1";
  const backtrack_hint = "&#x2B05 Left arrow key to go back";

  const hint = (backtrack = false) => {
    if (backtrack) {
      return box_text(continue_hint + "</p><p>" + backtrack_hint, ["hint"]);
    } else {
      return box_text(continue_hint, ["hint"]);
    }
  };

  const instructions = [
    display(
      center_text(
        "This is the final portion of the experiment<br>",
        "There will be a total of 8 trials. " +
          "Contrary to earlier trial, there is no time limit." +
          " So, please take your time to select carefully..."
      ) + hint()
    ),
    display(
      center_text(
        "Like before, you will be presented with a sequence of letters. However, this time the middle letter will not be shown.",
        'Your task is to select the letter you <strong>"feel"</strong> should be in the middle'
      ) + hint(true)
    ),
    display(
      box_text("AA AA", ["top"]),
      box_text("", ["bottom"]),
      center_text(
        "An example is shown here above. Here you can select either A or F, using the [A] or [F] keys."
      ) + hint(true)
    ),
    display(
      box_text("", ["top"]),
      box_text("SS SS", ["bottom"]),
      center_text(
        "Here you can select either S or H, using the [S] or [H] keys."
      ) + hint(true)
    ),
    display(
      center_text(
        "You can now begin...",
        "When you are ready to <b>start</b> press the right arrow key &#x27A1"
      ) + hint(true)
    ),
  ];

  return {
    type: InstructionsPlugin,
    pages: instructions,
  };
}

export default function (group, jsPsych, block, top_context, bottom_context) {
  const values = [
    {
      center_text: "S\tor\tH?",
      target: "HH HH",
      position: "top",
      type: "inducer",
      context: top_context,
      keys: ["s", "h"],
    },
    {
      center_text: "S\tor\tH?",
      target: "SS SS",
      position: "top",
      type: "inducer",
      context: top_context,
      keys: ["s", "h"],
    },
    {
      center_text: "S\tor\tH?",
      target: "HH HH",
      position: "bottom",
      type: "inducer",
      context: bottom_context,
      keys: ["s", "h"],
    },
    {
      center_text: "S\tor\tH?",
      target: "SS SS",
      position: "bottom",
      type: "inducer",
      context: bottom_context,
      keys: ["s", "h"],
    },
    {
      center_text: "A\tor\tF?",
      target: "AA AA",
      position: "top",
      type: "transfer",
      context: top_context,
      keys: ["a", "f"],
    },
    {
      center_text: "A\tor\tF?",
      target: "FF FF",
      position: "top",
      type: "transfer",
      context: top_context,
      keys: ["a", "f"],
    },
    {
      center_text: "A\tor\tF?",
      target: "AA AA",
      position: "bottom",
      type: "transfer",
      context: bottom_context,
      keys: ["a", "f"],
    },
    {
      center_text: "A\tor\tF?",
      target: "FF FF",
      position: "bottom",
      type: "transfer",
      context: bottom_context,
      keys: ["a", "f"],
    },
  ];

  const target = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: () =>
      trial_display(
        center_text(jsPsych.timelineVariable("center_text")),
        box_text(jsPsych.timelineVariable("target"), [
          jsPsych.timelineVariable("position"),
        ])
      ),
    data: () => ({
      target: jsPsych.timelineVariable("target"),
      position: jsPsych.timelineVariable("position"),
      type: jsPsych.timelineVariable("type"),
      context: jsPsych.timelineVariable("context"),
      trial: "post_trial",
      block: block,
      group: group,
    }),
    choices: () => jsPsych.timelineVariable("keys"),
  };

  const answer = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: () => {
      const answer = jsPsych.data
        .getLastTrialData()
        .trials[0].response.toUpperCase();
      return trial_display(
        box_text(jsPsych.timelineVariable("target").split(" ").join(answer), [
          jsPsych.timelineVariable("position"),
        ])
      );
    },
    choices: "NO_KEYS",
    trial_duration: 500,
  };

  const iti = {
    type: HtmlKeyboardResponsePlugin,
    stimulus: trial_display(),
    choices: "NO_KEYS",
    trial_duration: 500,
  };

  return {
    timeline: [
      instructions(),
      {
        timeline: [target, answer, iti],
        timeline_variables: values,
        sample: {
          type: "without-replacement",
        },
      },
    ],
  };
}
