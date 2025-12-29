<?php
/**
 * Uninstall WPWorld AI Visibility Engine
 * 
 * This file runs when the plugin is deleted via the WordPress admin.
 */

// Exit if not called by WordPress
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Delete plugin options
$options_to_delete = [
    'wpworld_ai_site_token',
    'wpworld_ai_site_id',
    'wpworld_ai_registered',
    'wpworld_ai_schema_enabled',
    'wpworld_ai_schema_data',
    'wpworld_ai_meta_data',
    'wpworld_ai_indexnow_key',
    'wpworld_ai_last_sync'
];

foreach ($options_to_delete as $option) {
    delete_option($option);
}

// Delete the logs table
global $wpdb;
$table_name = $wpdb->prefix . 'wpworld_ai_logs';
$wpdb->query("DROP TABLE IF EXISTS {$table_name}");

// Delete the AI Summary page
$ai_summary_page = get_posts([
    'name' => 'ai-summary',
    'post_type' => 'page',
    'post_status' => 'any',
    'numberposts' => 1
]);

if (!empty($ai_summary_page)) {
    wp_delete_post($ai_summary_page[0]->ID, true);
}

// Delete IndexNow key file if exists
$indexnow_key = get_option('wpworld_ai_indexnow_key');
if ($indexnow_key) {
    $key_file = ABSPATH . $indexnow_key . '.txt';
    if (file_exists($key_file)) {
        @unlink($key_file);
    }
}

// Clear scheduled events
wp_clear_scheduled_hook('wpworld_ai_daily_sync');

// Flush rewrite rules
flush_rewrite_rules();
