<?php
/**
 * Schema.org JSON-LD Generator
 */

if (!defined('ABSPATH')) {
    exit;
}

class WPWorld_AI_Schema_Generator {
    
    /**
     * Get complete schema for injection
     */
    public function get_schema() {
        // Check if schema injection is enabled
        if (!$this->is_enabled()) {
            return null;
        }
        
        $schemas = [];
        
        // Organization schema
        $org_schema = $this->get_organization_schema();
        if ($org_schema) {
            $schemas[] = $org_schema;
        }
        
        // WebSite schema
        $website_schema = $this->get_website_schema();
        if ($website_schema) {
            $schemas[] = $website_schema;
        }
        
        // FAQ schema (if on AI summary page)
        if ($this->is_ai_summary_page()) {
            $faq_schema = $this->get_faq_schema();
            if ($faq_schema) {
                $schemas[] = $faq_schema;
            }
        }
        
        // Single page/post schema
        if (is_singular()) {
            $article_schema = $this->get_article_schema();
            if ($article_schema) {
                $schemas[] = $article_schema;
            }
        }
        
        if (empty($schemas)) {
            return null;
        }
        
        // Return single schema or graph
        if (count($schemas) === 1) {
            return $schemas[0];
        }
        
        return [
            '@context' => 'https://schema.org',
            '@graph' => $schemas
        ];
    }
    
    /**
     * Check if schema generation is enabled
     */
    private function is_enabled() {
        $enabled = get_option('wpworld_ai_schema_enabled', true);
        
        // Don't inject if Yoast or Rank Math handles it (unless we're overriding)
        if ($this->has_seo_plugin_schema() && !get_option('wpworld_ai_override_schema', false)) {
            return false;
        }
        
        return $enabled;
    }
    
    /**
     * Check if an SEO plugin is handling schema
     */
    private function has_seo_plugin_schema() {
        // Check for Yoast
        if (defined('WPSEO_VERSION')) {
            $yoast_titles = get_option('wpseo_titles', []);
            if (!empty($yoast_titles['company-or-person'])) {
                return true;
            }
        }
        
        // Check for Rank Math
        if (defined('RANK_MATH_VERSION')) {
            $rm_settings = get_option('rank-math-options-titles', []);
            if (!empty($rm_settings['knowledgegraph_type'])) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Check if current page is AI summary page
     */
    private function is_ai_summary_page() {
        global $post;
        
        if (!$post) {
            return false;
        }
        
        return $post->post_name === 'ai-summary';
    }
    
    /**
     * Get Organization schema
     */
    public function get_organization_schema() {
        $schema_data = get_option('wpworld_ai_schema_data', []);
        
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => $schema_data['org_type'] ?? 'Organization',
            '@id' => home_url('/#organization'),
            'name' => get_bloginfo('name'),
            'url' => home_url(),
        ];
        
        // Description
        $description = $schema_data['description'] ?? get_bloginfo('description');
        if ($description) {
            $schema['description'] = $description;
        }
        
        // Logo
        $logo = $this->get_site_logo();
        if ($logo) {
            $schema['logo'] = [
                '@type' => 'ImageObject',
                '@id' => home_url('/#logo'),
                'url' => $logo,
                'contentUrl' => $logo,
                'caption' => get_bloginfo('name')
            ];
            $schema['image'] = ['@id' => home_url('/#logo')];
        }
        
        // Social profiles
        $social_urls = $this->get_social_urls();
        if (!empty($social_urls)) {
            $schema['sameAs'] = $social_urls;
        }
        
        // Contact
        $email = $schema_data['email'] ?? get_option('admin_email');
        if ($email && !empty($schema_data['show_email'])) {
            $schema['email'] = $email;
        }
        
        $phone = $schema_data['phone'] ?? '';
        if ($phone) {
            $schema['telephone'] = $phone;
        }
        
        // Address (if LocalBusiness)
        if (in_array($schema_data['org_type'] ?? '', ['LocalBusiness', 'Store', 'Restaurant'])) {
            $address = $this->get_address_schema($schema_data);
            if ($address) {
                $schema['address'] = $address;
            }
        }
        
        return $schema;
    }
    
    /**
     * Get WebSite schema
     */
    public function get_website_schema() {
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            '@id' => home_url('/#website'),
            'url' => home_url(),
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'publisher' => [
                '@id' => home_url('/#organization')
            ],
            'inLanguage' => get_locale()
        ];
        
        // Add search action if site has search
        $schema['potentialAction'] = [
            '@type' => 'SearchAction',
            'target' => [
                '@type' => 'EntryPoint',
                'urlTemplate' => home_url('/?s={search_term_string}')
            ],
            'query-input' => 'required name=search_term_string'
        ];
        
        return $schema;
    }
    
    /**
     * Get FAQ schema from AI summary page
     */
    public function get_faq_schema() {
        $ai_summary = new WPWorld_AI_AI_Summary();
        $summary_data = $ai_summary->get_summary_data();
        
        if (!$summary_data || empty($summary_data['faq'])) {
            return null;
        }
        
        $faq_items = [];
        foreach ($summary_data['faq'] as $item) {
            $faq_items[] = [
                '@type' => 'Question',
                'name' => $item['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $item['answer']
                ]
            ];
        }
        
        if (empty($faq_items)) {
            return null;
        }
        
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            '@id' => home_url('/ai-summary/#faq'),
            'mainEntity' => $faq_items
        ];
    }
    
    /**
     * Get Article/WebPage schema for single posts/pages
     */
    public function get_article_schema() {
        global $post;
        
        if (!$post) {
            return null;
        }
        
        $type = $post->post_type === 'post' ? 'Article' : 'WebPage';
        
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => $type,
            '@id' => get_permalink($post->ID) . '#' . strtolower($type),
            'headline' => get_the_title($post->ID),
            'url' => get_permalink($post->ID),
            'datePublished' => get_the_date('c', $post->ID),
            'dateModified' => get_the_modified_date('c', $post->ID),
            'author' => [
                '@type' => 'Person',
                'name' => get_the_author_meta('display_name', $post->post_author)
            ],
            'publisher' => [
                '@id' => home_url('/#organization')
            ],
            'isPartOf' => [
                '@id' => home_url('/#website')
            ],
            'inLanguage' => get_locale()
        ];
        
        // Featured image
        $thumbnail_id = get_post_thumbnail_id($post->ID);
        if ($thumbnail_id) {
            $image_url = wp_get_attachment_image_url($thumbnail_id, 'full');
            $schema['image'] = $image_url;
        }
        
        // Description
        $excerpt = get_the_excerpt($post->ID);
        if ($excerpt) {
            $schema['description'] = wp_strip_all_tags($excerpt);
        }
        
        return $schema;
    }
    
    /**
     * Get site logo URL
     */
    private function get_site_logo() {
        $custom_logo_id = get_theme_mod('custom_logo');
        
        if ($custom_logo_id) {
            return wp_get_attachment_image_url($custom_logo_id, 'full');
        }
        
        // Check for site icon as fallback
        $site_icon_id = get_option('site_icon');
        if ($site_icon_id) {
            return wp_get_attachment_image_url($site_icon_id, 'full');
        }
        
        return '';
    }
    
    /**
     * Get social profile URLs
     */
    private function get_social_urls() {
        $schema_data = get_option('wpworld_ai_schema_data', []);
        $urls = [];
        
        $social_fields = [
            'facebook_url',
            'twitter_url',
            'instagram_url',
            'linkedin_url',
            'youtube_url',
            'pinterest_url',
            'tiktok_url'
        ];
        
        foreach ($social_fields as $field) {
            if (!empty($schema_data[$field])) {
                $urls[] = $schema_data[$field];
            }
        }
        
        return $urls;
    }
    
    /**
     * Get address schema
     */
    private function get_address_schema($schema_data) {
        if (empty($schema_data['address_street'])) {
            return null;
        }
        
        return [
            '@type' => 'PostalAddress',
            'streetAddress' => $schema_data['address_street'] ?? '',
            'addressLocality' => $schema_data['address_city'] ?? '',
            'addressRegion' => $schema_data['address_region'] ?? '',
            'postalCode' => $schema_data['address_postal'] ?? '',
            'addressCountry' => $schema_data['address_country'] ?? ''
        ];
    }
    
    /**
     * Save schema data from backend
     */
    public function save_schema_data($data) {
        update_option('wpworld_ai_schema_data', $data);
        update_option('wpworld_ai_schema_enabled', true);
        
        return true;
    }
    
    /**
     * Get schema status for reporting
     */
    public function get_schema_status() {
        $schema_data = get_option('wpworld_ai_schema_data', []);
        $enabled = get_option('wpworld_ai_schema_enabled', false);
        
        // Check for SEO plugins
        $seo_plugin = 'none';
        if (defined('WPSEO_VERSION')) {
            $seo_plugin = 'yoast';
        } elseif (defined('RANK_MATH_VERSION')) {
            $seo_plugin = 'rank_math';
        } elseif (defined('AIOSEO_VERSION')) {
            $seo_plugin = 'aioseo';
        }
        
        $handled_by = ($seo_plugin !== 'none' && !get_option('wpworld_ai_override_schema', false)) 
            ? 'existing_plugin' 
            : 'wpworld';
        
        // Determine which schemas are active
        $schemas_active = [];
        if ($handled_by === 'wpworld') {
            $schemas_active[] = 'Organization';
            $schemas_active[] = 'WebSite';
            
            // Check for FAQ
            $ai_summary = new WPWorld_AI_AI_Summary();
            $summary_data = $ai_summary->get_summary_data();
            if (!empty($summary_data['faq'])) {
                $schemas_active[] = 'FAQPage';
            }
            $schemas_active[] = 'Article'; // For blog posts
        }
        
        return [
            'enabled' => $enabled,
            'seo_plugin_detected' => $seo_plugin,
            'schema_handled_by' => $handled_by,
            'schemas_active' => $schemas_active,
            'organization_data' => [
                'name' => get_bloginfo('name'),
                'type' => $schema_data['org_type'] ?? 'Organization',
                'has_logo' => !empty($this->get_site_logo()),
                'has_description' => !empty($schema_data['description'] ?? get_bloginfo('description'))
            ],
            'faq_count' => !empty($summary_data['faq']) ? count($summary_data['faq']) : 0
        ];
    }
    
    /**
     * Clear schema data
     */
    public function clear_schema_data() {
        delete_option('wpworld_ai_schema_data');
        
        return true;
    }
}
