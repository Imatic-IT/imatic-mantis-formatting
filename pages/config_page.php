<?php
access_ensure_global_level(config_get('manage_plugin_threshold'));

layout_page_header(plugin_lang_get('title'));

layout_page_begin('manage_overview_page.php');

print_manage_menu('manage_plugin_page.php');

?>

<?php

$plugin = plugin_get('ImaticFormatting');
$pluginPageTest = plugin_page('test-issue-previews.php');

echo '<div class="container"><div class="row"><div class="col-md-12">';
echo '<h2 class="text-info"><span class="glyphicon glyphicon-link"></span> Test Issue formatting preview</h2>';
echo '<a href="' . $pluginPageTest . '">' . $pluginPageTest . '</a>';