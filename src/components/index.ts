export function display(...args: string[]) {
    return "<div class='display'>" + Array.from(args).join("") + "</div>"
}

export const context_boxes = "<div class='top'></div><div class='bottom'></div>";

export const trial_display = display.bind(null, context_boxes);

export function center_text(...args: string[]) {
    return `<div class='center-text'><p>${Array.from(args).join("</p><p>")}</p></div>`;
}

export const box_text = (text: string, ...classes: string[]) => {
    return `<div class='${classes.join(" ")}'><p>${text}</p></div>`
}

export function paragraphs(...args: string[]) {
    return `<p>${Array.from(args).join("</p><p>")}</p>`;
}
