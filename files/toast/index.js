function getSettings() {
    const el = document.querySelector('#imaticFormatting')
    const data = el.dataset.data;
    if (!data) {
        throw new Error('Missing data attribute on #imaticFormatting element');
    }
    return JSON.parse(data);
}


function initEditor(textArea, settings, onReady) {
    const editorBarOffset = 70;

    const editorContainer = document.createElement('div');
    editorContainer.id = 'editor';
    textArea.parentNode.insertBefore(editorContainer, textArea.nextSibling);

    const computedStyle = window.getComputedStyle(textArea);

    const baseHeight = parseFloat(computedStyle.height);

    const heightValue = settings.options.height ? settings.options.height : baseHeight + editorBarOffset;


    const Editor = toastui.Editor;

    const savedText = textArea.value || '';

    const editor = new Editor({
        el: editorContainer,
        height: heightValue + 'px',
        initialEditType: settings.options.initialEditType || 'markdown',
        initialValue: savedText,
        previewStyle: settings.options.previewStyle || 'tab',
        customHTMLSanitizer: settings.options.useDefaultHTMLSanitizer === false
            ? html => DOMPurify.sanitize(html, settings.options.useDefaultHTMLSanitizerOptions)
            : undefined,
        useCommandShortcut: settings.options.useCommandShortcut || false,
        useDefaultHTMLSanitizerOptions: settings.options.useDefaultHTMLSanitizerOptions || {},
    });

    editor.on('change', () => {
        textArea.value = editor.getMarkdown();

        textArea.dispatchEvent(new Event('input', {bubbles: true}));
        textArea.dispatchEvent(new Event('change', {bubbles: true}));
    });

    if (typeof onReady === 'function') {
        onReady(editor, editorContainer, computedStyle);
    }

    return editor;
}

document.addEventListener('DOMContentLoaded', () => {

    const settings = getSettings();

    if (!settings.enabled) return;

    settings.textAreas.forEach(id => {
        const textarea = document.getElementById(id);
        if (!textarea) return;

        initEditor(textarea, settings, (editorInstance, editorContainer, computedStyle) => {

            let editorForChangeBgColor = editorContainer;

            if (settings.options.initialEditType === 'wysiwyg') {
                const wwMode = editorContainer.querySelector('.toastui-editor.ww-mode');
                if (wwMode) {
                    editorForChangeBgColor = wwMode;
                    wwMode.style.backgroundColor = computedStyle.backgroundColor;
                }
            }

            textarea.style.display = 'none'

            const viewStatusElements = [
                document.getElementById('bugnote_add_view_status'),
                document.getElementById('private')
            ].filter(Boolean);

            viewStatusElements.forEach(viewStatus => {
                viewStatus.addEventListener('change', () => {
                    const computedStyle = window.getComputedStyle(textarea);
                    editorForChangeBgColor.style.backgroundColor = computedStyle.backgroundColor;
                });
            });
        });
    });
});



