<?php
/**
 * API Client for communicating with WPWorld backend
 */

if (!defined('ABSPATH')) {
    exit;
}

class WPWorld_AI_API_Client {
    
    /**
     * API base URL
     */
    private $api_url;
    
    /**
     * Site token for authentication
     */
    private $site_token;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->api_url = WPWORLD_AI_API_URL;
        $this->site_token = get_option('wpworld_ai_site_token', '');
    }
    
    /**
     * Register site with backend
     */
    public function register_site($site_data) {
        return $this->post('/api/v1/sites/register', $site_data);
    }
    
    /**
     * Send site data to backend
     */
    public function send_site_data($data) {
        $site_id = get_option('wpworld_ai_site_id');
        
        if (!$site_id) {
            return false;
        }
        
        return $this->post("/api/v1/sites/{$site_id}/data", $data);
    }
    
    /**
     * Notify backend of status change
     */
    public function notify_status($status) {
        $site_id = get_option('wpworld_ai_site_id');
        
        if (!$site_id) {
            return false;
        }
        
        return $this->post("/api/v1/sites/{$site_id}/status", [
            'status' => $status,
            'timestamp' => current_time('c')
        ]);
    }
    
    /**
     * Report task completion to backend
     */
    public function report_task_completion($task_type, $result) {
        $site_id = get_option('wpworld_ai_site_id');
        
        if (!$site_id) {
            return false;
        }
        
        return $this->post("/api/v1/sites/{$site_id}/tasks/complete", [
            'task_type' => $task_type,
            'result' => $result,
            'timestamp' => current_time('c')
        ]);
    }
    
    /**
     * Get pending commands from backend
     */
    public function get_pending_commands() {
        $site_id = get_option('wpworld_ai_site_id');
        
        if (!$site_id) {
            return [];
        }
        
        $response = $this->get("/api/v1/sites/{$site_id}/commands");
        
        return $response['commands'] ?? [];
    }
    
    /**
     * Get progress data from backend
     */
    public function get_progress() {
        $site_id = get_option('wpworld_ai_site_id');
        
        if (!$site_id) {
            return null;
        }
        
        return $this->get("/api/v1/sites/{$site_id}/progress");
    }
    
    /**
     * Make POST request to API
     */
    private function post($endpoint, $data) {
        $url = $this->api_url . $endpoint;
        $body = wp_json_encode($data);
        
        $response = wp_remote_post($url, [
            'timeout' => 30,
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->site_token,
                'X-Site-Domain' => $this->get_domain(),
                'X-Signature' => $this->generate_signature($body)
            ],
            'body' => $body
        ]);
        
        if (is_wp_error($response)) {
            $this->log_error('POST', $endpoint, $response->get_error_message());
            return false;
        }
        
        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        if ($status_code >= 400) {
            $this->log_error('POST', $endpoint, "HTTP {$status_code}: {$body}");
            return false;
        }
        
        return json_decode($body, true);
    }
    
    /**
     * Make GET request to API
     */
    private function get($endpoint) {
        $url = $this->api_url . $endpoint;
        
        $response = wp_remote_get($url, [
            'timeout' => 30,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->site_token,
                'X-Site-Domain' => $this->get_domain(),
                'X-Signature' => $this->generate_signature('')
            ]
        ]);
        
        if (is_wp_error($response)) {
            $this->log_error('GET', $endpoint, $response->get_error_message());
            return false;
        }
        
        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        
        if ($status_code >= 400) {
            $this->log_error('GET', $endpoint, "HTTP {$status_code}: {$body}");
            return false;
        }
        
        return json_decode($body, true);
    }
    
    /**
     * Generate HMAC signature for request
     */
    private function generate_signature($body) {
        $timestamp = time();
        $data = $timestamp . '.' . $body;
        $signature = hash_hmac('sha256', $data, $this->site_token);
        
        return $timestamp . '.' . $signature;
    }
    
    /**
     * Get site domain
     */
    private function get_domain() {
        return wp_parse_url(home_url(), PHP_URL_HOST);
    }
    
    /**
     * Log API error
     */
    private function log_error($method, $endpoint, $message) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'wpworld_ai_logs';
        
        $wpdb->insert($table_name, [
            'log_type' => 'api_error',
            'log_key' => "{$method} {$endpoint}",
            'log_value' => $message,
            'created_at' => current_time('mysql')
        ]);
    }
}
