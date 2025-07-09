[![License: GPL-2.0-or-later](https://img.shields.io/badge/License-GPL--2.0--or--later-blue.svg)](https://spdx.org/licenses/GPL-2.0-or-later.html)

# Imatic formatting

## Purpose

Converts markdown into html.

## Installation

```
composer config --unset platform.php
composer require imatic-it/imatic-formatting
```

## Code highlighting

Following url was used to fetch code highlighting code: https://prismjs.com/download.html#themes=prism&languages=markup+css+clike+javascript+bash+clojure+markup-templating+php+sql

It can be disabled with:
```php
$g_plugin_ImaticFormatting_include_prism = false;
```


## ToastUI Editor (WYSIWYG)

This plugin integrates ToastUI Editor to provide a modern WYSIWYG and Markdown editor for text areas in MantisBT.

You can enable or configure the editor in your plugin config.
Example:

```php
public function config(): array
{
    return [
        'include_prism' => true,
        'toastui_editor' => [
            'enabled' => true,
            'textAreas'=> [
                'description',
                'additional_info',
                'additional_information',
                'bugnote_text'
            ],
            'options' => [
                'initialEditType' => 'wysiwyg', // 'markdown' or 'wysiwyg'
                'previewStyle' => 'tab', // 'tab' or 'vertical'
                'height' => false, // Use false for default height
                'useDefaultHTMLSanitizer' => true,
                'useCommandShortcut' => true,
                'useDefaultHTMLSanitizerOptions' => [
                    'allowAttributes' => ['class', 'style'],
                    'allowTags' => ['a', 'b', 'i', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
                ],
            ],
        ]
    ];
}
```

### Features
- Markdown and WYSIWYG editing mode
- Live preview (tab or vertical split)
- Custom HTML sanitization with [DOMPurify](https://github.com/cure53/DOMPurify)
- Optional keyboard shortcuts
- Automatic synchronization with MantisBT text areas
