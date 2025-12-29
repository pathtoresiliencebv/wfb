<?php
/**
 * Plugin Name: WPWorld & WPIT SEO - AI Visibility Engine
 * Plugin URI: https://wpworld.host
 * Description: Automated SEO Rankings & AI Visibility Optimization - Makes your website discoverable by search engines & AI systems like ChatGPT, Gemini, and Perplexity.
 * Version: 1.1.2
 * Author: WPWorld
 * Author URI: https://wpworld.host
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wpworld-ai
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('WPWORLD_AI_VERSION', '1.1.2');
define('WPWORLD_AI_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WPWORLD_AI_PLUGIN_URL', plugin_dir_url(__FILE__));
define('WPWORLD_AI_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Backend API URL
define('WPWORLD_AI_API_URL', 'https://wpworld-ai-backend-production.up.railway.app');

/**
 * Autoloader for plugin classes
 */
spl_autoload_register(function ($class) {
    $prefix = 'WPWorld_AI_';
    
    if (strpos($class, $prefix) !== 0) {
        return;
    }
    
    $class_name = str_replace($prefix, '', $class);
    $class_name = strtolower(str_replace('_', '-', $class_name));
    $file = WPWORLD_AI_PLUGIN_DIR . 'includes/class-' . $class_name . '.php';
    
    if (file_exists($file)) {
        require_once $file;
    }
});

/**
 * Main plugin class
 */
final class WPWorld_AI {
    
    /**
     * Singleton instance
     */
    private static $instance = null;
    
    /**
     * Plugin components
     */
    private $api_client;
    private $data_collector;
    private $ai_summary;
    private $schema_generator;
    private $meta_optimizer;
    private $indexing;
    private $rest_endpoints;
    private $admin_ui;
    
    /**
     * Get singleton instance
     */
    public static function instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }
    
    /**
     * Load required files
     */
    private function load_dependencies() {
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-api-client.php';
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-data-collector.php';
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-ai-summary.php';
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-schema-generator.php';
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-meta-optimizer.php';
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-indexing.php';
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-rest-endpoints.php';
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-admin-ui.php';
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-llms-txt.php';
        require_once WPWORLD_AI_PLUGIN_DIR . 'includes/class-content-analyzer.php';
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Activation/Deactivation
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);
        
        // Initialize components after plugins loaded
        add_action('plugins_loaded', [$this, 'init_components']);
        
        // Initialize REST API
        add_action('rest_api_init', [$this, 'init_rest_api']);
        
        // Admin hooks
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        
        // Frontend hooks for schema injection
        add_action('wp_head', [$this, 'inject_schema'], 1);
        
        // Cron for periodic data sync
        add_action('wpworld_ai_daily_sync', [$this, 'daily_sync']);
        
        // Add cron schedule
        add_filter('cron_schedules', [$this, 'add_cron_schedules']);
    }
    
    /**
     * Initialize plugin components
     */
    public function init_components() {
        $this->api_client = new WPWorld_AI_API_Client();
        $this->data_collector = new WPWorld_AI_Data_Collector();
        $this->ai_summary = new WPWorld_AI_AI_Summary();
        $this->schema_generator = new WPWorld_AI_Schema_Generator();
        $this->meta_optimizer = new WPWorld_AI_Meta_Optimizer();
        $this->indexing = new WPWorld_AI_Indexing();
        $this->admin_ui = new WPWorld_AI_Admin_UI();
        
        // Initialize llms.txt (serves /llms.txt for AI crawlers)
        $llms_txt = new WPWorld_AI_LLMs_Txt();
        $llms_txt->init();
    }
    
    /**
     * Initialize REST API endpoints
     */
    public function init_rest_api() {
        $this->rest_endpoints = new WPWorld_AI_REST_Endpoints();
        $this->rest_endpoints->register_routes();
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Generate unique site token
        if (!get_option('wpworld_ai_site_token')) {
            $token = wp_generate_password(64, false);
            update_option('wpworld_ai_site_token', $token);
        }
        
        // Create database table for logs
        $this->create_tables();
        
        // Schedule daily sync
        if (!wp_next_scheduled('wpworld_ai_daily_sync')) {
            wp_schedule_event(time(), 'daily', 'wpworld_ai_daily_sync');
        }
        
        // Register site with backend
        $this->register_with_backend();
        
        // Flush rewrite rules for ai-summary page
        flush_rewrite_rules();
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Clear scheduled events
        wp_clear_scheduled_hook('wpworld_ai_daily_sync');
        
        // Notify backend of deactivation
        $this->notify_deactivation();
    }
    
    /**
     * Create plugin database tables
     */
    private function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        $table_name = $wpdb->prefix . 'wpworld_ai_logs';
        
        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            log_type varchar(50) NOT NULL,
            log_key varchar(100) NOT NULL,
            log_value longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY log_type (log_type),
            KEY log_key (log_key)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    /**
     * Register site with WPWorld backend
     */
    private function register_with_backend() {
        $api_client = new WPWorld_AI_API_Client();
        $data_collector = new WPWorld_AI_Data_Collector();
        
        $site_data = $data_collector->collect_initial_data();
        $result = $api_client->register_site($site_data);
        
        if ($result && isset($result['site_id'])) {
            update_option('wpworld_ai_site_id', $result['site_id']);
            update_option('wpworld_ai_registered', true);
            $this->log('registration', 'success', $result);
        } else {
            $this->log('registration', 'failed', $result);
        }
    }
    
    /**
     * Notify backend of deactivation
     */
    private function notify_deactivation() {
        $api_client = new WPWorld_AI_API_Client();
        $api_client->notify_status('deactivated');
    }
    
    /**
     * Add custom cron schedules
     */
    public function add_cron_schedules($schedules) {
        $schedules['wpworld_weekly'] = [
            'interval' => 604800,
            'display' => __('Once Weekly', 'wpworld-ai')
        ];
        return $schedules;
    }
    
    /**
     * Daily sync with backend
     */
    public function daily_sync() {
        $data_collector = new WPWorld_AI_Data_Collector();
        $api_client = new WPWorld_AI_API_Client();
        
        $site_data = $data_collector->collect_full_data();
        $api_client->send_site_data($site_data);
        
        $this->log('sync', 'daily', ['timestamp' => current_time('mysql')]);
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            __('AI & SEO Visibility', 'wpworld-ai'),
            __('AI & SEO Visibility', 'wpworld-ai'),
            'manage_options',
            'wpworld-ai',
            [$this->admin_ui, 'render_dashboard'],
            'dashicons-visibility',
            30
        );
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'wpworld-ai') === false) {
            return;
        }
        
        wp_enqueue_style(
            'wpworld-ai-admin',
            WPWORLD_AI_PLUGIN_URL . 'assets/css/admin.css',
            [],
            WPWORLD_AI_VERSION
        );
        
        wp_enqueue_script(
            'wpworld-ai-admin',
            WPWORLD_AI_PLUGIN_URL . 'assets/js/admin.js',
            ['jquery'],
            WPWORLD_AI_VERSION,
            true
        );
        
        wp_localize_script('wpworld-ai-admin', 'wpworldAI', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('wpworld_ai_nonce'),
            'apiUrl' => WPWORLD_AI_API_URL
        ]);
    }
    
    /**
     * Inject schema JSON-LD into head
     */
    public function inject_schema() {
        $schema_generator = new WPWorld_AI_Schema_Generator();
        $schema = $schema_generator->get_schema();
        
        if (!empty($schema)) {
            echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
        }
    }
    
    /**
     * Log activity
     */
    public function log($type, $key, $value = null) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'wpworld_ai_logs';
        
        $wpdb->insert($table_name, [
            'log_type' => $type,
            'log_key' => $key,
            'log_value' => is_array($value) ? wp_json_encode($value) : $value,
            'created_at' => current_time('mysql')
        ]);
    }
    
    /**
     * Get component instances
     */
    public function api_client() {
        return $this->api_client;
    }
    
    public function data_collector() {
        return $this->data_collector;
    }
    
    public function ai_summary() {
        return $this->ai_summary;
    }
    
    public function schema_generator() {
        return $this->schema_generator;
    }
    
    public function meta_optimizer() {
        return $this->meta_optimizer;
    }
    
    public function indexing() {
        return $this->indexing;
    }
}

/**
 * Initialize plugin
 */
function wpworld_ai() {
    return WPWorld_AI::instance();
}

// Start the plugin
wpworld_ai();
