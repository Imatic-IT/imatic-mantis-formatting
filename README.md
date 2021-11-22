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
