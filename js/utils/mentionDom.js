import {sanitizeHandlerName} from "./mentionUtils";

export function getSettings() {
    const el = document.querySelector('#imaticFormatting')
    const data = el.dataset.data;
    if (!data) {
        throw new Error('Missing data attribute on #imaticFormatting element');
    }
    return JSON.parse(data);
}
export function getHandlerForMention() {
    const blocked = ["[Myself]", "[Reporter]", "[Já sám]", "[Reportér]"];
    const selects = document.querySelectorAll('select[name="handler_id"]');

    const completions = Array.from(selects).flatMap(select =>
        Array.from(select.options)
            .map(option => ({
                key: sanitizeHandlerName(option.textContent),
                value: option.textContent
            }))
            .filter(user => !blocked.includes(user.key))
    );
    return completions;
}

