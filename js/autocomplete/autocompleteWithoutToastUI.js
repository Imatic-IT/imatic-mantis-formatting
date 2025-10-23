import { getHandlerForMention } from "../utils/mentionDom";
import Tribute from "tributejs";

export function createAutocompleteWithoutToastUI(editor) {
    const handlers = getHandlerForMention();
    const editorContents = document.querySelectorAll('#bugnote_text, #description, #steps_to_reproduce, #additional_info, #summary, #additional_information');
    const tributeInstances = [];
    let isActive = false;

    function hideAllTributeContainers() {
        document.querySelectorAll('.tribute-container').forEach((container) => {
            container.style.display = 'none';
        });
    }

    editorContents.forEach((editorContent) => {
        if (editorContent.__tribute) {
            editorContent.__tribute.detach(editorContent);
            editorContent.__tribute = null;
        }
        document.querySelectorAll(`.tribute-container`).forEach(container => {
            container.remove();
        });
    });

    const observer = new MutationObserver((mutations) => {
        if (!isActive) {
            hideAllTributeContainers();
            return;
        }
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                editorContents.forEach((editorContent, index) => {
                    const tributeContainer = document.querySelector(`.tribute-container-${index}`);
                    if (tributeContainer) {
                        const editorRect = editorContent.getBoundingClientRect();

                        const centeredLeft = editorRect.left + window.scrollX + (editorRect.width / 2) - (editorContent.offsetWidth / 2);
                        tributeContainer.style.width = `${editorContent.offsetWidth}px`;
                        tributeContainer.style.left = `${centeredLeft}px`;

                        const items = tributeContainer.querySelectorAll('li');
                        if (items.length === 0 || (items.length === 1 && items[0].textContent === 'No matching found')) {
                            tributeContainer.style.display = 'none';
                        } else if (isActive) {
                            tributeContainer.style.display = 'block';
                        } else {
                            tributeContainer.style.display = 'none';
                        }
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
                    .map(user => ({ key: user.value, value: user.key }));
                const tributeContainer = document.querySelector(`.tribute-container-${index}`);
                if (filtered.length === 0 && tributeContainer) {
                    tributeContainer.style.display = 'none';
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
                const tributeContainer = document.querySelector(`.tribute-container-${index}`);
                if (tributeContainer) {
                    tributeContainer.style.display = 'none';
                }
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
            { capture: true },
        );

        editorContent.addEventListener('blur', () => {
            const tributeContainer = document.querySelector(`.tribute-container-${index}`);
            if (tributeContainer) {
                tributeContainer.style.display = 'none';
                tribute.hideMenu();
            }
        });

        editorContent.addEventListener('tribute-active-true', () => {
            isActive = true;
        });
        editorContent.addEventListener('tribute-active-false', () => {
            isActive = false;
            hideAllTributeContainers();
            editorContent.focus();
        });
        editorContent.addEventListener('tribute-replaced', () => {
            isActive = false;
            const tributeContainer = document.querySelector(`.tribute-container-${index}`);
            if (tributeContainer) {
                tributeContainer.style.display = 'none';
                // tributeContainer.remove();
            }
            tribute.hideMenu();
        });
    });

    return tributeInstances;
}