import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import { display, center_text } from "./components";

export default {
  type: HtmlKeyboardResponsePlugin,
  stimulus: display(
    center_text(
      "You now have a break.\nPlease press [space] when you want to continue...."
    )
  ),
  choices: [" "],
};
