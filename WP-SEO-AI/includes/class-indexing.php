<?php
/**
 * Search Engine Indexing Service
 */

if (!defined('ABSPATH')) {
    exit;
}

class WPWorld_AI_Indexing {
    
    /**
     * Ping Google with sitemap
     */
    public function ping_google($sitemap_url = null) {
        if (!$sitemap_url) {
            $sitemap_url = $this->get_sitemap_url();
        }
        
        $ping_url = 'https://www.google.com/ping?sitemap=' . urlencode($sitemap_url);
        
        $response = wp_remote_get($ping_url, [
            'timeout' => 10,
            'sslverify' => true
        ]);
        
        $success = !is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200;
        
        $this->log_ping('google', $sitemap_url, $success, $response);
        
        return $success;
    }
    
    /**
     * Ping Bing with sitemap
     */
    public function ping_bing($sitemap_url = null) {
        if (!$sitemap_url) {
            $sitemap_url = $this->get_sitemap_url();
        }
        
        $ping_url = 'https://www.bing.com/ping?sitemap=' . urlencode($sitemap_url);
        
        $response = wp_remote_get($ping_url, [
            'timeout' => 10,
            'sslverify' => true
        ]);
        
        $success = !is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200;
        
        $this->log_ping('bing', $sitemap_url, $success, $response);
        
        return $success;
    }
    
    /**
     * Submit URL via IndexNow (Bing, Yandex, Seznam, Naver)
     */
    public function submit_indexnow($urls = null) {
        if (!$urls) {
            $urls = [home_url('/')];
            
            // Add AI summary page if exists
            $ai_summary = new WPWorld_AI_AI_Summary();
            if ($ai_summary->page_exists()) {
                $urls[] = $ai_summary->get_page_url();
            }
        }
        
        if (!is_array($urls)) {
            $urls = [$urls];
        }
        
        // Get IndexNow key from backend or generate one
        $key = $this->get_indexnow_key();
        
        if (!$key) {
            return [
                'success' => false,
                'error' => 'No IndexNow key configured'
            ];
        }
        
        $host = wp_parse_url(home_url(), PHP_URL_HOST);
        
        $payload = [
            'host' => $host,
            'key' => $key,
            'keyLocation' => home_url('/' . $key . '.txt'),
            'urlList' => $urls
        ];
        
        $response = wp_remote_post('https://api.indexnow.org/indexnow', [
            'timeout' => 15,
            'headers' => [
                'Content-Type' => 'application/json'
            ],
            'body' => wp_json_encode($payload)
        ]);
        
        $status_code = wp_remote_retrieve_response_code($response);
        $success = !is_wp_error($response) && in_array($status_code, [200, 202]);
        
        $this->log_ping('indexnow', implode(', ', $urls), $success, $response);
        
        return [
            'success' => $success,
            'status_code' => $status_code,
            'urls_submitted' => count($urls)
        ];
    }
    
    /**
     * Run all indexing pings
     */
    public function ping_all() {
        return $this->ping_all_with_details();
    }
    
    /**
     * Run all indexing pings with detailed results for reporting
     */
    public function ping_all_with_details() {
        $sitemap_url = $this->get_sitemap_url();
        
        // Get URLs to submit
        $urls_to_submit = [home_url('/')];
        $ai_summary = new WPWorld_AI_AI_Summary();
        if ($ai_summary->page_exists()) {
            $urls_to_submit[] = $ai_summary->get_page_url();
        }
        
        $results = [
            'google' => [
                'success' => $this->ping_google($sitemap_url),
                'sitemap_url' => $sitemap_url,
                'pinged_at' => current_time('c')
            ],
            'bing' => [
                'success' => $this->ping_bing($sitemap_url),
                'sitemap_url' => $sitemap_url,
                'pinged_at' => current_time('c')
            ],
            'indexnow' => $this->submit_indexnow($urls_to_submit)
        ];
        
        // Add URLs submitted to indexnow result
        $results['indexnow']['urls_submitted'] = $urls_to_submit;
        $results['indexnow']['pinged_at'] = current_time('c');
        
        // Summary for report
        $results['summary'] = [
            'total_services' => 3,
            'successful' => ($results['google']['success'] ? 1 : 0) + 
                           ($results['bing']['success'] ? 1 : 0) + 
                           ($results['indexnow']['success'] ? 1 : 0),
            'urls_submitted' => $urls_to_submit,
            'sitemap_url' => $sitemap_url
        ];
        
        return $results;
    }
    
    /**
     * Get sitemap URL
     */
    private function get_sitemap_url() {
        // Check for common sitemap locations
        $possible_sitemaps = [
            '/wp-sitemap.xml',
            '/sitemap.xml',
            '/sitemap_index.xml'
        ];
        
        $home_url = home_url();
        
        foreach ($possible_sitemaps as $path) {
            $url = $home_url . $path;
            $response = wp_remote_head($url, ['timeout' => 5]);
            
            if (!is_wp_error($response)) {
                $status = wp_remote_retrieve_response_code($response);
                if ($status === 200) {
                    return $url;
                }
            }
        }
        
        // Default to WordPress sitemap
        return home_url('/wp-sitemap.xml');
    }
    
    /**
     * Get or create IndexNow key
     */
    private function get_indexnow_key() {
        $key = get_option('wpworld_ai_indexnow_key');
        
        if (!$key) {
            // Generate a key
            $key = wp_generate_password(32, false);
            update_option('wpworld_ai_indexnow_key', $key);
            
            // Create key file
            $this->create_indexnow_key_file($key);
        }
        
        return $key;
    }
    
    /**
     * Create IndexNow key file in root
     */
    private function create_indexnow_key_file($key) {
        $file_path = ABSPATH . $key . '.txt';
        
        // Try to create the file
        if (!file_exists($file_path)) {
            @file_put_contents($file_path, $key);
        }
        
        // Alternative: add rewrite rule to serve key
        add_action('init', function() use ($key) {
            add_rewrite_rule(
                '^' . preg_quote($key) . '\.txt$',
                'index.php?wpworld_indexnow_key=1',
                'top'
            );
        });
        
        add_filter('query_vars', function($vars) {
            $vars[] = 'wpworld_indexnow_key';
            return $vars;
        });
        
        add_action('template_redirect', function() use ($key) {
            if (get_query_var('wpworld_indexnow_key')) {
                header('Content-Type: text/plain');
                echo $key;
                exit;
            }
        });
    }
    
    /**
     * Log ping result
     */
    private function log_ping($service, $url, $success, $response) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'wpworld_ai_logs';
        
        $error_message = '';
        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
        }
        
        $wpdb->insert($table_name, [
            'log_type' => 'indexing',
            'log_key' => $service,
            'log_value' => wp_json_encode([
                'url' => $url,
                'success' => $success,
                'error' => $error_message,
                'timestamp' => current_time('c')
            ]),
            'created_at' => current_time('mysql')
        ]);
    }
    
    /**
     * Get indexing status/history
     */
    public function get_indexing_history($limit = 10) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'wpworld_ai_logs';
        
        $results = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$table_name} WHERE log_type = 'indexing' ORDER BY created_at DESC LIMIT %d",
            $limit
        ), ARRAY_A);
        
        return array_map(function($row) {
            $row['log_value'] = json_decode($row['log_value'], true);
            return $row;
        }, $results);
    }
}
