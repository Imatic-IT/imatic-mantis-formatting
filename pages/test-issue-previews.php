<?php

auth_reauthenticate();
access_ensure_global_level(config_get('view_bug_threshold'));


layout_page_header('TEST ISSUE EMAIL PREVIEW');
layout_page_begin('view_all_bug_page.php');




$t_mantis_dir = dirname(__FILE__) . DIRECTORY_SEPARATOR;


?>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <h2 class="text-warning"><span class="glyphicon glyphicon-pencil"></span> Markdown Preview Test</h2>
            <?php include $t_mantis_dir . 'test-issue-preview-markdown.php'; ?>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h2 class="text-primary"><span class="glyphicon glyphicon-envelope"></span> Email Preview - HTML Rendered</h2>
            <?php include $t_mantis_dir . 'test-issue-preview-html-email-test.php'; ?>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <h2 class="text-success"><span class="glyphicon glyphicon-file"></span> Email Preview - Plain Text</h2>
            <?php include $t_mantis_dir . 'test-issue-preview-plain-text.php'; ?>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h2 class="text-success"><span class="glyphicon glyphicon-file"></span> Email Preview email reporter indentation</h2>
            <?php include $t_mantis_dir . 'test-issue-preview-email-reporter-indentation.php'; ?>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <h2 class="text-danger"><span class="glyphicon glyphicon-warning-sign"></span> Email Preview - Plain Text (Broken Format without plugin formatting)</h2>
            <?php include $t_mantis_dir . 'test-issue-preview-plain-text-broken.php'; ?>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <h2 class="text-info"><span class="glyphicon glyphicon-link"></span> Link Rendering & Query Parameter Handling</h2>
            <?php include $t_mantis_dir . 'test-issue-preview-links.php'; ?>
        </div>
    </div>
</div>

<?php
layout_page_end();
