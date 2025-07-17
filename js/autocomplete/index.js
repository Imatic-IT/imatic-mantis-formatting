import {getHandlerForMention} from "../utils/mentionDom";
import {getCaretInfo} from "../utils/mentionUtils";
import Tribute from "tributejs";

export function createAutocomplete(editor) {
    const handlers = getHandlerForMention();
    const editorContents = document.querySelectorAll('.toastui-editor .ProseMirror');
    const tributeInstances = [];

    editorContents.forEach((editorContent) => {
        if (editorContent.__tribute) {
            editorContent.__tribute.detach(editorContent);
            editorContent.__tribute = null;
        }
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                editorContents.forEach((editorContent, index) => {
                    const tributeContainer = document.querySelector(`.tribute-container-${index}`);
                    if (tributeContainer) {
                        requestAnimationFrame(() => {
                            tributeContainer.style.display = 'none';
                            const editorRect = editorContent.getBoundingClientRect();
                            const caretInfo = getCaretInfo();
                            const rect = caretInfo.node ? caretInfo.node.parentElement.getBoundingClientRect() : editorRect;

                            tributeContainer.style.width = `${editorRect.width}px`;
                            tributeContainer.style.left = `${rect.left + window.scrollX - 25}px`;
                            tributeContainer.style.top = `${rect.top + window.scrollY + rect.height}px`;

                            const items = tributeContainer.querySelectorAll('li');
                            if (items.length === 0 || (items.length === 1 && items[0].textContent === 'No matching found')) {
                                tributeContainer.style.display = 'none';
                            } else {
                                tributeContainer.style.display = 'block';
                            }
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    editorContents.forEach((editorContent, index) => {
        if (editorContent.__tribute) {
            return;
        }

        const tribute = new Tribute({
            values: (text, cb) => {
                const filtered = handlers
                    .filter(user => user.key.toLowerCase().startsWith(text.toLowerCase()))
                    .map(user => ({key: user.value, value: user.key}));
                if (filtered.length === 0) {
                    const tributeContainer = document.querySelector(`.tribute-container-${index}`);
                    if (tributeContainer) {
                        tributeContainer.style.display = 'none';
                    }
                }
                cb(filtered);
            },
            trigger: '@',
            selectClass: 'tribute-highlight',
            containerClass: `tribute-container-${index}`,
            itemClass: 'tribute-item',
            lookup: 'key',
            fillAttr: 'value',
            selectTemplate: function (item) {
                setTimeout(() => {
                    editorContent.focus();
                }, 0);
                return '@' + item.original.value + ' ';
            },
            menuItemTemplate: function (item) {
                return item.string;
            },
            menuShowMinLength: 1,
            allowSpaces: false,
            replaceTextSuffix: ' ',
            positionMenu: true,
            spaceSelectsMatch: false,
            noMatchTemplate: function () {
                return '';
            },
        });

        tribute.attach(editorContent);
        editorContent.__tribute = tribute;
        tributeInstances.push(tribute);

        editorContent.addEventListener(
            'keydown',
            (event) => {
                if (tribute.isActive && (event.key === 'Tab' || event.key === 'Enter')) {
                    event.preventDefault();
                    event.stopPropagation();
                    tribute.selectItemAtIndex(tribute.menuSelected);
                    tribute.hideMenu();
                }
            },
            {capture: true},
        );

        editorContent.addEventListener('blur', () => {
            const tributeContainer = document.querySelector(`.tribute-container-${index}`);
            if (tributeContainer) {
                tribute.hideMenu();
            }
        });

        // editorContent.addEventListener('tribute-active-true', () => {
        // });
        // editorContent.addEventListener('tribute-active-false', () => {
        // });
        // editorContent.addEventListener('tribute-replaced', (e) => {
        //     // tribute.hideMenu();
        // });
        //
        // editorContent.addEventListener('input', () => {
        // });
    });

    return tributeInstances;
}