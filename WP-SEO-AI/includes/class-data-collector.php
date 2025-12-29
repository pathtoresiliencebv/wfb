<?php
/**
 * Data Collector - Gathers site information for backend
 */

if (!defined('ABSPATH')) {
    exit;
}

class WPWorld_AI_Data_Collector {
    
    /**
     * Collect initial registration data
     */
    public function collect_initial_data() {
        return [
            'domain' => $this->get_domain(),
            'site_url' => home_url(),
            'site_name' => get_bloginfo('name'),
            'site_token' => get_option('wpworld_ai_site_token'),
            'wp_version' => get_bloginfo('version'),
            'php_version' => phpversion(),
            'plugin_version' => WPWORLD_AI_VERSION,
            'admin_email' => get_option('admin_email'),
            'language' => get_locale(),
            'timezone' => wp_timezone_string(),
            'registered_at' => current_time('c')
        ];
    }
    
    /**
     * Collect full site data for analysis
     */
    public function collect_full_data() {
        return [
            'domain' => $this->get_domain(),
            'site_url' => home_url(),
            'site_name' => get_bloginfo('name'),
            'tagline' => get_bloginfo('description'),
            'wp_version' => get_bloginfo('version'),
            'php_version' => phpversion(),
            'theme' => $this->get_theme_info(),
            'plugins' => $this->get_active_plugins(),
            'homepage' => $this->get_homepage_data(),
            'metadata' => $this->get_site_metadata(),
            'sitemap' => $this->get_sitemap_url(),
            'robots_txt' => $this->get_robots_txt(),
            'schema_detected' => $this->detect_existing_schema(),
            'content_stats' => $this->get_content_stats(),
            'collected_at' => current_time('c')
        ];
    }
    
    /**
     * Get domain without protocol
     */
    private function get_domain() {
        return wp_parse_url(home_url(), PHP_URL_HOST);
    }
    
    /**
     * Get theme information
     */
    private function get_theme_info() {
        $theme = wp_get_theme();
        
        return [
            'name' => $theme->get('Name'),
            'version' => $theme->get('Version'),
            'author' => $theme->get('Author'),
            'template' => $theme->get_template()
        ];
    }
    
    /**
     * Get list of active plugins
     */
    private function get_active_plugins() {
        $active_plugins = get_option('active_plugins', []);
        $plugins = [];
        
        foreach ($active_plugins as $plugin_path) {
            $plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin_path, false);
            $plugins[] = [
                'name' => $plugin_data['Name'],
                'version' => $plugin_data['Version'],
                'slug' => dirname($plugin_path)
            ];
        }
        
        return $plugins;
    }
    
    /**
     * Get homepage data for AI analysis
     */
    private function get_homepage_data() {
        // Get the homepage content
        $home_url = home_url();
        
        // Use WordPress HTTP API to fetch homepage
        $response = wp_remote_get($home_url, [
            'timeout' => 15,
            'sslverify' => false
        ]);
        
        if (is_wp_error($response)) {
            return ['error' => $response->get_error_message()];
        }
        
        $html = wp_remote_retrieve_body($response);
        
        // Extract title
        preg_match('/<title[^>]*>(.*?)<\/title>/si', $html, $title_match);
        $title = isset($title_match[1]) ? trim(strip_tags($title_match[1])) : '';
        
        // Extract meta description
        preg_match('/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\'][^>]*>/si', $html, $desc_match);
        if (empty($desc_match)) {
            preg_match('/<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']description["\'][^>]*>/si', $html, $desc_match);
        }
        $description = isset($desc_match[1]) ? trim($desc_match[1]) : '';
        
        // Extract visible text (first 2000 chars)
        $text = $this->extract_visible_text($html);
        
        // Extract H1
        preg_match('/<h1[^>]*>(.*?)<\/h1>/si', $html, $h1_match);
        $h1 = isset($h1_match[1]) ? trim(strip_tags($h1_match[1])) : '';
        
        // Extract all headings
        preg_match_all('/<h[1-6][^>]*>(.*?)<\/h[1-6]>/si', $html, $headings_match);
        $headings = array_map(function($h) {
            return trim(strip_tags($h));
        }, $headings_match[1] ?? []);
        
        return [
            'title' => $title,
            'description' => $description,
            'h1' => $h1,
            'headings' => array_slice($headings, 0, 20),
            'text_preview' => mb_substr($text, 0, 2000),
            'word_count' => str_word_count($text)
        ];
    }
    
    /**
     * Extract visible text from HTML
     */
    private function extract_visible_text($html) {
        // Remove scripts, styles, and other non-visible elements
        $html = preg_replace('/<script[^>]*>.*?<\/script>/si', '', $html);
        $html = preg_replace('/<style[^>]*>.*?<\/style>/si', '', $html);
        $html = preg_replace('/<noscript[^>]*>.*?<\/noscript>/si', '', $html);
        $html = preg_replace('/<!--.*?-->/s', '', $html);
        
        // Get text content
        $text = strip_tags($html);
        
        // Clean up whitespace
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);
        
        return $text;
    }
    
    /**
     * Get site metadata
     */
    private function get_site_metadata() {
        $home_url = home_url();
        
        $response = wp_remote_get($home_url, [
            'timeout' => 15,
            'sslverify' => false
        ]);
        
        if (is_wp_error($response)) {
            return [];
        }
        
        $html = wp_remote_retrieve_body($response);
        $metadata = [];
        
        // OG tags
        preg_match_all('/<meta[^>]+property=["\']og:([^"\']+)["\'][^>]+content=["\']([^"\']*)["\'][^>]*>/si', $html, $og_matches, PREG_SET_ORDER);
        foreach ($og_matches as $match) {
            $metadata['og:' . $match[1]] = $match[2];
        }
        
        // Twitter tags
        preg_match_all('/<meta[^>]+name=["\']twitter:([^"\']+)["\'][^>]+content=["\']([^"\']*)["\'][^>]*>/si', $html, $twitter_matches, PREG_SET_ORDER);
        foreach ($twitter_matches as $match) {
            $metadata['twitter:' . $match[1]] = $match[2];
        }
        
        // Canonical
        preg_match('/<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\'][^>]*>/si', $html, $canonical_match);
        $metadata['canonical'] = $canonical_match[1] ?? '';
        
        return $metadata;
    }
    
    /**
     * Get sitemap URL
     */
    private function get_sitemap_url() {
        $possible_sitemaps = [
            '/sitemap.xml',
            '/sitemap_index.xml',
            '/wp-sitemap.xml',
            '/sitemap.xml.gz'
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
        
        return home_url('/wp-sitemap.xml');
    }
    
    /**
     * Get robots.txt content
     */
    private function get_robots_txt() {
        $robots_url = home_url('/robots.txt');
        
        $response = wp_remote_get($robots_url, ['timeout' => 5]);
        
        if (is_wp_error($response)) {
            return '';
        }
        
        return wp_remote_retrieve_body($response);
    }
    
    /**
     * Detect existing schema markup
     */
    private function detect_existing_schema() {
        $home_url = home_url();
        
        $response = wp_remote_get($home_url, [
            'timeout' => 15,
            'sslverify' => false
        ]);
        
        if (is_wp_error($response)) {
            return ['detected' => false];
        }
        
        $html = wp_remote_retrieve_body($response);
        
        // Find JSON-LD scripts
        preg_match_all('/<script[^>]+type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/si', $html, $schema_matches);
        
        $schemas = [];
        foreach ($schema_matches[1] as $json) {
            $decoded = json_decode($json, true);
            if ($decoded) {
                $type = $decoded['@type'] ?? 'Unknown';
                $schemas[] = $type;
            }
        }
        
        return [
            'detected' => !empty($schemas),
            'types' => array_unique($schemas)
        ];
    }
    
    /**
     * Get content statistics (public for report generation)
     */
    public function get_content_stats() {
        $post_count = wp_count_posts('post');
        $page_count = wp_count_posts('page');
        
        // Get posts with featured images
        global $wpdb;
        $posts_with_image = (int) $wpdb->get_var(
            "SELECT COUNT(DISTINCT p.ID) FROM {$wpdb->posts} p 
             INNER JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id 
             WHERE p.post_type = 'post' AND p.post_status = 'publish' 
             AND pm.meta_key = '_thumbnail_id'"
        );
        
        // Get posts with excerpts
        $posts_with_excerpt = (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM {$wpdb->posts} 
             WHERE post_type = 'post' AND post_status = 'publish' 
             AND post_excerpt != ''"
        );
        
        $total_published_posts = (int) $post_count->publish;
        
        return [
            'posts' => [
                'published' => $total_published_posts,
                'draft' => (int) $post_count->draft,
                'with_featured_image' => $posts_with_image,
                'with_excerpt' => $posts_with_excerpt
            ],
            'pages' => [
                'published' => (int) $page_count->publish,
                'draft' => (int) $page_count->draft
            ],
            'categories' => (int) wp_count_terms('category'),
            'tags' => (int) wp_count_terms('post_tag'),
            'comments' => (int) wp_count_comments()->approved,
            'language' => get_locale(),
            'total_content_items' => $total_published_posts + (int) $page_count->publish
        ];
    }
}
