
export function sanitizeHandlerName(name) {
    return name.replace(/^[^\w\[]+\s*/, '');
}

export function getMentionQuery(text, offset) {
    const textBeforeCaret = text.slice(0, offset);
    const indexOfAt = textBeforeCaret.lastIndexOf('@');
    if (indexOfAt >= 0) {
        const mentionQuery = textBeforeCaret.slice(indexOfAt + 1);
        if (mentionQuery.includes(' ') || mentionQuery === '') {
            return null;
        }
        return mentionQuery;
    }
    return null;
}
export function getCaretInfo() {
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode) return;

    let node = sel.anchorNode;

    if (node.nodeType === Node.ELEMENT_NODE) {
        node = node.childNodes[0];
    }
    const offset = sel.anchorOffset;

    return {node, offset}
}

