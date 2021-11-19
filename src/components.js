function display_base () {
    const display = "<div class='display'>" + Array.from(arguments).join("") + "</div>"
    return display;
}

const context_boxes = "<div class='top'></div><div class='bottom'></div>";
const center_text = (text) => `<div class='center-text'><p>${text}</p></div>`
const box_text = (text, classes) => {
    return `<div class='${classes.join(" ")}'><p>${text}</p>`
}

const display = display_base.bind(null, context_boxes)

module.exports = {
    display,
    center_text,
    box_text,
}