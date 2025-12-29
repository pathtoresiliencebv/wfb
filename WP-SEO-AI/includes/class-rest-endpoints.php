<?php
/**
 * REST API Endpoints for backend communication
 */

if (!defined('ABSPATH')) {
    exit;
}

class WPWorld_AI_REST_Endpoints {
    
    /**
     * Namespace for REST routes
     */
    const NAMESPACE = 'wpworld/v1';
    
    /**
     * Register REST routes
     */
    public function register_routes() {
        // Execute command from backend
        register_rest_route(self::NAMESPACE, '/execute', [
            'methods' => 'POST',
            'callback' => [$this, 'execute_command'],
            'permission_callback' => [$this, 'verify_request']
        ]);
        
        // Get site status
        register_rest_route(self::NAMESPACE, '/status', [
            'methods' => 'GET',
            'callback' => [$this, 'get_status'],
            'permission_callback' => [$this, 'verify_request']
        ]);
        
        // Get logs
        register_rest_route(self::NAMESPACE, '/logs', [
            'methods' => 'GET',
            'callback' => [$this, 'get_logs'],
            'permission_callback' => [$this, 'verify_request']
        ]);
        
        // Get optimization summary (for reports)
        register_rest_route(self::NAMESPACE, '/optimization-summary', [
            'methods' => 'GET',
            'callback' => [$this, 'get_optimization_summary'],
            'permission_callback' => [$this, 'verify_request']
        ]);
        
        // Get content analysis (for reports)
        register_rest_route(self::NAMESPACE, '/content-analysis', [
            'methods' => 'GET',
            'callback' => [$this, 'get_content_analysis'],
            'permission_callback' => [$this, 'verify_request']
        ]);
        
        // Health check (public)
        register_rest_route(self::NAMESPACE, '/health', [
            'methods' => 'GET',
            'callback' => [$this, 'health_check'],
            'permission_callback' => '__return_true'
        ]);
    }
    
    /**
     * Verify request signature from backend
     */
    public function verify_request($request) {
        $signature = $request->get_header('X-Signature');
        $site_token = get_option('wpworld_ai_site_token');
        
        if (!$signature || !$site_token) {
            return false;
        }
        
        // Parse signature: timestamp.hash
        $parts = explode('.', $signature);
        if (count($parts) !== 2) {
            return false;
        }
        
        list($timestamp, $hash) = $parts;
        
        // Check timestamp is within 5 minutes
        if (abs(time() - (int)$timestamp) > 300) {
            return false;
        }
        
        // Verify hash
        $body = $request->get_body();
        $expected_hash = hash_hmac('sha256', $timestamp . '.' . $body, $site_token);
        
        return hash_equals($expected_hash, $hash);
    }
    
    /**
     * Execute command from backend
     */
    public function execute_command($request) {
        $params = $request->get_json_params();
        
        $command = $params['command'] ?? '';
        $payload = $params['payload'] ?? [];
        
        wpworld_ai()->log('command', $command, $payload);
        
        switch ($command) {
            case 'create_ai_summary_page':
                return $this->cmd_create_ai_summary($payload);
                
            case 'update_ai_summary_page':
                return $this->cmd_update_ai_summary($payload);
                
            case 'inject_schema':
                return $this->cmd_inject_schema($payload);
                
            case 'optimize_meta':
                return $this->cmd_optimize_meta($payload);
                
            case 'ping_indexing':
                return $this->cmd_ping_indexing($payload);
                
            case 'collect_data':
                return $this->cmd_collect_data();
            
            case 'get_content_analysis':
                return $this->cmd_get_content_analysis();
                
            case 'get_screenshot_data':
                return $this->cmd_get_screenshot_data();
                
            default:
                return new WP_Error(
                    'unknown_command',
                    'Unknown command: ' . $command,
                    ['status' => 400]
                );
        }
    }
    
    /**
     * Create AI summary page
     */
    private function cmd_create_ai_summary($payload) {
        $ai_summary = new WPWorld_AI_AI_Summary();
        $result = $ai_summary->create_page($payload);
        
        // Report back to backend
        $api_client = new WPWorld_AI_API_Client();
        $api_client->report_task_completion('create_ai_summary_page', $result);
        
        return rest_ensure_response($result);
    }
    
    /**
     * Update AI summary page
     */
    private function cmd_update_ai_summary($payload) {
        $ai_summary = new WPWorld_AI_AI_Summary();
        $result = $ai_summary->create_page($payload); // create_page handles updates too
        
        return rest_ensure_response($result);
    }
    
    /**
     * Inject schema data
     */
    private function cmd_inject_schema($payload) {
        $schema_generator = new WPWorld_AI_Schema_Generator();
        $result = $schema_generator->save_schema_data($payload);
        
        // Get details about what schemas are now active
        $schema_status = $schema_generator->get_schema_status();
        
        $response = [
            'success' => $result,
            'schema_status' => $schema_status
        ];
        
        // Report back with details
        $api_client = new WPWorld_AI_API_Client();
        $api_client->report_task_completion('inject_schema', $response);
        
        return rest_ensure_response($response);
    }
    
    /**
     * Optimize meta tags
     */
    private function cmd_optimize_meta($payload) {
        $meta_optimizer = new WPWorld_AI_Meta_Optimizer();
        $result = $meta_optimizer->save_meta_data($payload);
        
        // Get details about what was optimized
        $meta_status = $meta_optimizer->get_meta_status();
        
        $response = [
            'success' => $result,
            'meta_status' => $meta_status
        ];
        
        // Report back with details
        $api_client = new WPWorld_AI_API_Client();
        $api_client->report_task_completion('optimize_meta', $response);
        
        return rest_ensure_response($response);
    }
    
    /**
     * Ping indexing services
     */
    private function cmd_ping_indexing($payload) {
        $indexing = new WPWorld_AI_Indexing();
        $results = $indexing->ping_all_with_details();
        
        // Report back to backend with full details
        $api_client = new WPWorld_AI_API_Client();
        $api_client->report_task_completion('ping_indexing', $results);
        
        return rest_ensure_response($results);
    }
    
    /**
     * Collect and return site data
     */
    private function cmd_collect_data() {
        $data_collector = new WPWorld_AI_Data_Collector();
        $data = $data_collector->collect_full_data();
        
        return rest_ensure_response($data);
    }
    
    /**
     * Get content analysis for report generation
     */
    private function cmd_get_content_analysis() {
        $analyzer = new WPWorld_AI_Content_Analyzer();
        $analysis = $analyzer->get_full_analysis();
        
        // Report back
        $api_client = new WPWorld_AI_API_Client();
        $api_client->report_task_completion('get_content_analysis', $analysis);
        
        return rest_ensure_response($analysis);
    }
    
    /**
     * Get data needed for screenshots
     */
    private function cmd_get_screenshot_data() {
        $ai_summary = new WPWorld_AI_AI_Summary();
        
        return rest_ensure_response([
            'homepage_url' => home_url('/'),
            'ai_summary_url' => $ai_summary->get_page_url(),
            'sitemap_url' => home_url('/wp-sitemap.xml')
        ]);
    }
    
    /**
     * Get plugin status
     */
    public function get_status($request) {
        $ai_summary = new WPWorld_AI_AI_Summary();
        $schema_generator = new WPWorld_AI_Schema_Generator();
        $indexing = new WPWorld_AI_Indexing();
        
        return rest_ensure_response([
            'plugin_version' => WPWORLD_AI_VERSION,
            'site_id' => get_option('wpworld_ai_site_id'),
            'registered' => (bool) get_option('wpworld_ai_registered'),
            'ai_summary_page' => [
                'exists' => $ai_summary->page_exists(),
                'url' => $ai_summary->get_page_url()
            ],
            'schema_enabled' => (bool) get_option('wpworld_ai_schema_enabled'),
            'indexing_history' => $indexing->get_indexing_history(5),
            'last_sync' => get_option('wpworld_ai_last_sync'),
            'wp_version' => get_bloginfo('version'),
            'php_version' => phpversion()
        ]);
    }
    
    /**
     * Get full optimization summary for report generation
     */
    public function get_optimization_summary($request) {
        $ai_summary = new WPWorld_AI_AI_Summary();
        $schema_generator = new WPWorld_AI_Schema_Generator();
        $meta_optimizer = new WPWorld_AI_Meta_Optimizer();
        $indexing = new WPWorld_AI_Indexing();
        $data_collector = new WPWorld_AI_Data_Collector();
        
        // Get content stats
        $content_stats = $data_collector->get_content_stats();
        
        // Get AI summary info
        $summary_data = $ai_summary->get_summary_data();
        $ai_summary_info = [
            'page_exists' => $ai_summary->page_exists(),
            'page_url' => $ai_summary->get_page_url(),
            'word_count' => $summary_data ? str_word_count(strip_tags($summary_data['content'] ?? '')) : 0,
            'faq_count' => !empty($summary_data['faq']) ? count($summary_data['faq']) : 0,
            'has_services' => !empty($summary_data['services']),
            'last_updated' => get_post_modified_time('c', false, $ai_summary->get_page_id())
        ];
        
        return rest_ensure_response([
            'ai_summary' => $ai_summary_info,
            'schema_status' => $schema_generator->get_schema_status(),
            'meta_status' => $meta_optimizer->get_meta_status(),
            'indexing_history' => $indexing->get_indexing_history(10),
            'content_stats' => $content_stats,
            'site_info' => [
                'name' => get_bloginfo('name'),
                'url' => home_url(),
                'language' => get_locale(),
                'timezone' => wp_timezone_string()
            ]
        ]);
    }
    
    /**
     * Get logs
     */
    public function get_logs($request) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'wpworld_ai_logs';
        $limit = (int) $request->get_param('limit') ?: 50;
        $type = $request->get_param('type');
        
        if ($type) {
            $results = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$table_name} WHERE log_type = %s ORDER BY created_at DESC LIMIT %d",
                $type,
                $limit
            ), ARRAY_A);
        } else {
            $results = $wpdb->get_results($wpdb->prepare(
                "SELECT * FROM {$table_name} ORDER BY created_at DESC LIMIT %d",
                $limit
            ), ARRAY_A);
        }
        
        return rest_ensure_response($results);
    }
    
    /**
     * Get content analysis for report
     */
    public function get_content_analysis($request) {
        $analyzer = new WPWorld_AI_Content_Analyzer();
        return rest_ensure_response($analyzer->get_full_analysis());
    }
    
    /**
     * Health check endpoint
     */
    public function health_check($request) {
        return rest_ensure_response([
            'status' => 'ok',
            'plugin' => 'wpworld-ai',
            'version' => WPWORLD_AI_VERSION,
            'timestamp' => current_time('c')
        ]);
    }
}
