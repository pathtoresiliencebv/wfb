<?php
/**
 * Meta Tags Optimizer
 */

if (!defined('ABSPATH')) {
    exit;
}

class WPWorld_AI_Meta_Optimizer {
    
    /**
     * Stored meta data from backend
     */
    private $meta_data;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->meta_data = get_option('wpworld_ai_meta_data', []);
        
        // Only hook if we have optimized meta and no SEO plugin
        if (!empty($this->meta_data) && $this->should_optimize()) {
            $this->init_hooks();
        }
    }
    
    /**
     * Initialize hooks for meta optimization
     */
    private function init_hooks() {
        // Title
        add_filter('pre_get_document_title', [$this, 'filter_title'], 999);
        add_filter('document_title_parts', [$this, 'filter_title_parts'], 999);
        
        // Meta tags
        add_action('wp_head', [$this, 'output_meta_tags'], 1);
        
        // OG tags
        add_action('wp_head', [$this, 'output_og_tags'], 2);
        
        // Twitter tags
        add_action('wp_head', [$this, 'output_twitter_tags'], 3);
    }
    
    /**
     * Check if we should optimize (no SEO plugin active)
     */
    private function should_optimize() {
        // Skip if Yoast is active and handling this
        if (defined('WPSEO_VERSION')) {
            return false;
        }
        
        // Skip if Rank Math is active
        if (defined('RANK_MATH_VERSION')) {
            return false;
        }
        
        // Skip if All in One SEO is active
        if (defined('AIOSEO_VERSION')) {
            return false;
        }
        
        // Skip if SEOPress is active
        if (defined('SEOPRESS_VERSION')) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Filter document title
     */
    public function filter_title($title) {
        if (is_front_page() && !empty($this->meta_data['home_title'])) {
            return $this->meta_data['home_title'];
        }
        
        return $title;
    }
    
    /**
     * Filter title parts
     */
    public function filter_title_parts($parts) {
        if (is_front_page() && !empty($this->meta_data['home_title'])) {
            return ['title' => $this->meta_data['home_title']];
        }
        
        return $parts;
    }
    
    /**
     * Output meta description
     */
    public function output_meta_tags() {
        $description = '';
        
        if (is_front_page()) {
            $description = $this->meta_data['home_description'] ?? '';
        } elseif (is_singular()) {
            global $post;
            $post_description = get_post_meta($post->ID, '_wpworld_ai_description', true);
            $description = $post_description ?: wp_trim_words(get_the_excerpt(), 25, '...');
        }
        
        if ($description) {
            echo '<meta name="description" content="' . esc_attr($description) . '" />' . "\n";
        }
        
        // Robots meta
        if (is_front_page()) {
            echo '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />' . "\n";
        }
    }
    
    /**
     * Output Open Graph tags
     */
    public function output_og_tags() {
        $og = [
            'og:type' => is_singular('post') ? 'article' : 'website',
            'og:site_name' => get_bloginfo('name'),
            'og:locale' => get_locale()
        ];
        
        if (is_front_page()) {
            $og['og:title'] = $this->meta_data['home_title'] ?? get_bloginfo('name');
            $og['og:description'] = $this->meta_data['home_description'] ?? get_bloginfo('description');
            $og['og:url'] = home_url('/');
            
            if (!empty($this->meta_data['home_image'])) {
                $og['og:image'] = $this->meta_data['home_image'];
            }
        } elseif (is_singular()) {
            global $post;
            $og['og:title'] = get_the_title();
            $og['og:description'] = wp_trim_words(get_the_excerpt(), 25, '...');
            $og['og:url'] = get_permalink();
            
            $thumbnail = get_the_post_thumbnail_url($post->ID, 'large');
            if ($thumbnail) {
                $og['og:image'] = $thumbnail;
            }
        }
        
        foreach ($og as $property => $content) {
            if ($content) {
                echo '<meta property="' . esc_attr($property) . '" content="' . esc_attr($content) . '" />' . "\n";
            }
        }
    }
    
    /**
     * Output Twitter Card tags
     */
    public function output_twitter_tags() {
        $twitter = [
            'twitter:card' => 'summary_large_image'
        ];
        
        if (!empty($this->meta_data['twitter_handle'])) {
            $twitter['twitter:site'] = $this->meta_data['twitter_handle'];
        }
        
        if (is_front_page()) {
            $twitter['twitter:title'] = $this->meta_data['home_title'] ?? get_bloginfo('name');
            $twitter['twitter:description'] = $this->meta_data['home_description'] ?? get_bloginfo('description');
            
            if (!empty($this->meta_data['home_image'])) {
                $twitter['twitter:image'] = $this->meta_data['home_image'];
            }
        } elseif (is_singular()) {
            global $post;
            $twitter['twitter:title'] = get_the_title();
            $twitter['twitter:description'] = wp_trim_words(get_the_excerpt(), 25, '...');
            
            $thumbnail = get_the_post_thumbnail_url($post->ID, 'large');
            if ($thumbnail) {
                $twitter['twitter:image'] = $thumbnail;
            }
        }
        
        foreach ($twitter as $name => $content) {
            if ($content) {
                echo '<meta name="' . esc_attr($name) . '" content="' . esc_attr($content) . '" />' . "\n";
            }
        }
    }
    
    /**
     * Save optimized meta data from backend
     */
    public function save_meta_data($data) {
        update_option('wpworld_ai_meta_data', $data);
        
        return true;
    }
    
    /**
     * Get current meta data
     */
    public function get_meta_data() {
        return $this->meta_data;
    }
    
    /**
     * Get meta optimization status for reporting
     */
    public function get_meta_status() {
        // Check for SEO plugins
        $seo_plugin = 'none';
        if (defined('WPSEO_VERSION')) {
            $seo_plugin = 'yoast';
        } elseif (defined('RANK_MATH_VERSION')) {
            $seo_plugin = 'rank_math';
        } elseif (defined('AIOSEO_VERSION')) {
            $seo_plugin = 'aioseo';
        } elseif (defined('SEOPRESS_VERSION')) {
            $seo_plugin = 'seopress';
        }
        
        $handled_by = ($seo_plugin !== 'none') ? 'existing_plugin' : 'wpworld';
        
        $optimizations = [];
        if ($handled_by === 'wpworld' && !empty($this->meta_data)) {
            $optimizations['homepage'] = [
                'title_set' => !empty($this->meta_data['home_title']),
                'title_value' => $this->meta_data['home_title'] ?? null,
                'description_set' => !empty($this->meta_data['home_description']),
                'description_value' => $this->meta_data['home_description'] ?? null,
                'og_tags_added' => true,
                'twitter_cards_added' => true
            ];
        }
        
        return [
            'seo_plugin_detected' => $seo_plugin,
            'seo_plugin_name' => $this->get_plugin_name($seo_plugin),
            'meta_handled_by' => $handled_by,
            'optimizations_made' => $optimizations,
            'pages_optimized' => $handled_by === 'wpworld' ? 1 : 0, // Only homepage
            'note' => $handled_by === 'existing_plugin' 
                ? "Meta tags managed by {$this->get_plugin_name($seo_plugin)} - your existing setup is AI-ready"
                : 'Homepage meta tags optimized for AI discovery'
        ];
    }
    
    /**
     * Get friendly plugin name
     */
    private function get_plugin_name($slug) {
        $names = [
            'yoast' => 'Yoast SEO',
            'rank_math' => 'Rank Math',
            'aioseo' => 'All in One SEO',
            'seopress' => 'SEOPress',
            'none' => 'None'
        ];
        return $names[$slug] ?? $slug;
    }
    
    /**
     * Clear meta data
     */
    public function clear_meta_data() {
        delete_option('wpworld_ai_meta_data');
        
        return true;
    }
    
    /**
     * Generate optimized meta from content (local fallback)
     */
    public function generate_meta_from_content() {
        $data_collector = new WPWorld_AI_Data_Collector();
        $homepage = $data_collector->collect_full_data()['homepage'] ?? [];
        
        // Use existing description or generate from content
        $description = $homepage['description'] ?? '';
        
        if (empty($description) && !empty($homepage['text_preview'])) {
            // Take first 155 characters
            $description = wp_trim_words($homepage['text_preview'], 25, '...');
        }
        
        return [
            'home_title' => $homepage['title'] ?? get_bloginfo('name'),
            'home_description' => $description
        ];
    }
}
