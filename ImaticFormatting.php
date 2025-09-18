<?php

use League\CommonMark\CommonMarkConverter;
use League\CommonMark\Environment;
use League\CommonMark\Extension\InlinesOnly\InlinesOnlyExtension;
use League\CommonMark\GithubFlavoredMarkdownConverter;
use League\CommonMark\MarkdownConverterInterface;

class ImaticFormattingPlugin extends MantisPlugin
{
    public function register(): void
    {
        $this->name = 'Imatic formatting';
        $this->description = 'Formatting';
        $this->version = '0.2.0';
        $this->requires = [
            'MantisCore' => '2.0.0',
        ];

		$this->author = 'Imatic Software s.r.o.';
		$this->contact = 'info@imatic.cz';
		$this->url = 'https://www.imatic.cz/';
	}

    public function hooks(): array
    {
        return [
            'EVENT_DISPLAY_FORMATTED' => 'display_formatted_hook',
            'EVENT_LAYOUT_RESOURCES' => 'layout_resources_hook',
            'EVENT_LAYOUT_BODY_END' => 'layout_end_resources_hook',
        ];
    }

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
                    'initialEditType' => 'markdown', # 'markdown' or 'wysiwyg'
                    'previewStyle' => 'tab', # 'tab' or 'vertical'
                    'height' => false, // SET NUMBER or false for default height from mantisbt + BAR height
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

	private function getOneLineConverter(): MarkdownConverterInterface {
		static $converter = null;
		if ($converter === null) {
			$environment = new Environment();
			$environment->addExtension(new InlinesOnlyExtension());
			$converter = new CommonMarkConverter([
				'html_input' => 'escape',
				'allow_unsafe_links' => false,
			], $environment);
		}

		return $converter;
	}

	private function getMultiLineConverter(): MarkdownConverterInterface {
		static $converter = null;
		if ($converter === null) {
			$converter = new GithubFlavoredMarkdownConverter([
				'html_input' => 'escape',
				'allow_unsafe_links' => false,
			]);
		}

		return $converter;
	}

	public function convert(string $text): string {
        $converter = $this->getConverter();
		return string_process_bugnote_link(string_process_bug_link(mention_format_text($converter->convertToHtml($text))));
	}

    private function isHtml($string)
    {
        return $string != strip_tags($string);
    }

    public function display_formatted_hook($p_event, $p_string, $p_multiline = true)
    {

        if ($this->isHtml($p_string)) {
            return $p_string;
        }

        return $this->convert($p_string);
    }

    private function getConverter($p_multiline = true): MarkdownConverterInterface
    {
        return $p_multiline ? $this->getMultiLineConverter() : $this->getOneLineConverter();
    }

	private function prism_includes() {
		if (!plugin_config_get('include_prism', null, true)) {
			return '';
		}

		return '<link rel="stylesheet" type="text/css" href="' . plugin_file('prism.css') . '&v=' . $this->version . '" />'
				. '<script async type="text/javascript" src="' . plugin_file( 'prism.js' ) . '&v=' . $this->version . '"></script>';
	}

    public function layout_resources_hook()
    {
        return $this->prism_includes();
    }

    public function layout_end_resources_hook()
    {
        $config = htmlspecialchars(json_encode(plugin_config_get('toastui_editor', [], true)));

        return '<link rel="stylesheet" type="text/css" href="' . plugin_file('toast/toastui-editor.min.css') . '&v=' . $this->version . '" />
                <link rel="stylesheet" type="text/css" href="' . plugin_file('toast/custom.css') . '&v=' . $this->version . '" />'
            . '<script type="text/javascript" src="' . plugin_file('toast/toastui-editor.min.js') . '&v=' . $this->version . '"></script>
		        <script  id="imaticFormatting" data-data="' . $config . '" type="text/javascript" src="' . plugin_file('main.js') . '&v=' . $this->version . '"></script>';

    }
}
