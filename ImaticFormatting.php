<?php

use League\CommonMark\GithubFlavoredMarkdownConverter;

class ImaticFormattingPlugin extends MantisPlugin
{
	public function register(): void
	{
		$this->name = 'Imatic formatting';
		$this->description = 'Formatting';
		$this->version = '0.0.4';
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
		];
	}

	public function config(): array {
		return [
			'include_prism' => true,
		];
	}

	private function getConverter(): GithubFlavoredMarkdownConverter
	{
		static $converter = null;
		if ($converter === null) {
			$converter = new GithubFlavoredMarkdownConverter([
				'html_input' => 'escape',
				'allow_unsafe_links' => false,
			]);
		}

		return $converter;
	}

	private function convert(string $text): string {
		return string_process_bugnote_link(string_process_bug_link(mention_format_text($this->getConverter()->convertToHtml($text))));
	}

	public function display_formatted_hook( $p_event, $p_string, $p_multiline = true ) {
		return $this->convert($p_string);
	}

	private function prism_includes() {
		if (!plugin_config_get('include_prism', null, true)) {
			return '';
		}

		return '<link rel="stylesheet" type="text/css" href="' . plugin_file('prism.css') . '&v=' . $this->version . '" />'
				. '<script async type="text/javascript" src="' . plugin_file( 'prism.js' ) . '&v=' . $this->version . '"></script>';
	}

	public function layout_resources_hook() {
		return '<link rel="stylesheet" type="text/css" href="' . plugin_file('styles.css') . '&v=' . $this->version . '" />'
				. $this->prism_includes();
	}
}
