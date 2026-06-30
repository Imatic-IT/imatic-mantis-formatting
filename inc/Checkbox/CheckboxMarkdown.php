<?php

namespace ImaticFormatting\Checkbox;

require_once __DIR__ . '/CheckboxListener.php';

use League\CommonMark\Environment\Environment;
use League\CommonMark\Environment\EnvironmentBuilderInterface;
use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
use League\CommonMark\MarkdownConverter;

/**
 * Builds a GitHub-flavored Markdown converter that, in addition to the usual
 * task-list checkboxes (first marker of a list item), turns EVERY remaining
 * "[ ]" / "[x]" / "[X]" marker into a checkbox too — mid-line and several per
 * line — via {@see CheckboxListener}.
 *
 * The stock GithubFlavoredMarkdownExtension is kept untouched, so list rendering
 * (tight vs loose, the task-list pretty-printing special case, etc.) is exactly
 * as before; the listener only fills in the markers GFM leaves as plain text and
 * reuses commonmark's own TaskListItemMarker node so they render identically.
 *
 * Centralised here so the renderer (ImaticFormatting) and the toggler
 * (ImaticChecklist) parse with byte-identical configuration — the only way the
 * rendered checkbox order can be guaranteed to match the source-marker order.
 */
final class CheckboxMarkdown
{
    /**
     * @param array<string,mixed> $config
     */
    public static function createConverter(array $config = []): MarkdownConverter
    {
        $config += [
            'html_input'         => 'allow',
            'allow_unsafe_links' => false,
        ];

        $environment = new Environment($config);
        $environment->addExtension(new CommonMarkCoreExtension());
        $environment->addExtension(new GithubFlavoredMarkdownExtension());

        self::register($environment);

        return new MarkdownConverter($environment);
    }

    /**
     * Register the every-marker checkbox listener. The node it produces
     * (TaskListItemMarker) already has a renderer from the GFM extension.
     */
    public static function register(EnvironmentBuilderInterface $environment): void
    {
        $environment->addEventListener(DocumentParsedEvent::class, new CheckboxListener());
    }
}
