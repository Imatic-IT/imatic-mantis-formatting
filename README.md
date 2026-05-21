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
                'initialEditType' => 'markdown', // 'markdown' or 'wysiwyg'
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



## User mentions (autocomplete)

When typing `@` in any supported text area, the plugin shows an autocomplete dropdown of assignable users in the current project so you can quickly insert `@username` mentions. The user list is derived from MantisBT's assignee selector (`select[name="handler_id"]`), so only users that can be set as a handler in the current project context are offered — special pseudo-entries such as `[Myself]` and `[Reporter]` are filtered out.

Supported text areas (both plain and ToastUI/WYSIWYG mode):

- `#summary`
- `#description`
- `#steps_to_reproduce`
- `#additional_info`, `#additional_information`
- `#bugnote_text`

The autocomplete UI is powered by [Tribute.js](https://github.com/zurb/tribute) (bundled, no runtime CDN).

Mention rendering and notifications are handled by MantisBT core: after the markdown converter runs, the plugin pipes the output through `mention_format_text()`, which turns `@username` into a clickable link and (when `$g_enable_user_mention` is enabled in MantisBT config) sends the standard mention notification to that user. See the [MantisBT User Mention configuration](https://www.mantisbt.org/docs/master/en-US/Admin_Guide/html-desktop/admin.preferences.usermention.html) for the notification settings.


## Preview Test Pages

The plugin provides **test pages** where you can see how your Markdown and HTML formatting will be rendered before using it in actual issues.

1. Navigate to the **Plugin Configuration Page**:
   `Manage -> Manage Plugins -> Imatic Formatting`

2. Click on **"Test Issue Formatting Preview"** or open directly:
   [/plugin.php?page=ImaticFormatting/test-issue-previews.php](./plugin.php?page=ImaticFormatting/test-issue-previews.php)

3. You will find several preview sections:

   - 📧 **HTML Rendered Preview** – see how HTML emails will render
   - 📝 **Plain Text Preview** – view the plain text formatting
   - ⚠️ **Broken Format Preview** – simulate text without plugin formatting
   - 🔗 **Link Rendering & Query Parameters** – test links including query strings and `&` characters
   - 🖋️ **Markdown Preview** – test all Markdown elements including headings, lists, blockquotes, code blocks, tables, images, links, and horizontal rules

This is useful for verifying your formatting rules, link handling, WYSIWYG editor integration, and Markdown rendering be

