<?php

namespace ImaticFormatting\Checkbox;

use League\CommonMark\Event\DocumentParsedEvent;
use League\CommonMark\Extension\TaskList\TaskListItemMarker;
use League\CommonMark\Node\Inline\Text;

/**
 * After parsing, walks every Text node and converts each "[ ]" / "[x]" / "[X]"
 * occurrence into a TaskListItemMarker inline node — so any task marker becomes
 * a rendered checkbox, even several on one line or mid-sentence, not only the
 * first marker of a list item (which the stock GFM extension already handles).
 *
 * Reusing commonmark's own TaskListItemMarker node means the produced checkboxes
 * render byte-for-byte like the native ones and inherit the list-item
 * pretty-printing special case in ListItemRenderer.
 *
 * Working on Text nodes (rather than the raw markdown) means code spans and
 * code blocks are skipped for free: their content never becomes a Text node.
 *
 * The exact same marker set is reproduced by ImaticChecklist\CheckboxToggler so
 * that the n-th rendered checkbox always maps back to the n-th source marker.
 */
final class CheckboxListener
{
    /**
     * A marker, but not one immediately followed by "(" — that would be link or
     * image syntax (e.g. "[x](url)"), which must stay intact. The toggler uses
     * the identical pattern so both sides agree on what counts as a checkbox.
     */
    public const MARKER = '/(\[[ xX]\])(?!\()/';

    public function __invoke(DocumentParsedEvent $event): void
    {
        $targets = [];
        foreach ($event->getDocument()->iterator() as $node) {
            if ($node instanceof Text && \preg_match(self::MARKER, $node->getLiteral()) === 1) {
                $targets[] = $node;
            }
        }

        foreach ($targets as $text) {
            self::split($text);
        }
    }

    private static function split(Text $text): void
    {
        $parts = \preg_split(
            self::MARKER,
            $text->getLiteral(),
            -1,
            PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY
        );

        foreach ($parts as $part) {
            if ($part === '[x]' || $part === '[X]') {
                $text->insertBefore(new TaskListItemMarker(true));
            } elseif ($part === '[ ]') {
                $text->insertBefore(new TaskListItemMarker(false));
            } else {
                $text->insertBefore(new Text($part));
            }
        }

        $text->detach();
    }
}
