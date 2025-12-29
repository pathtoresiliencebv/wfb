<?php
/**
 * AI Summary Page Generator
 */

if (!defined('ABSPATH')) {
    exit;
}

class WPWorld_AI_AI_Summary {
    
    /**
     * Page slug
     */
    const PAGE_SLUG = 'ai-summary';
    
    /**
     * Create or update the AI summary page
     */
    public function create_page($summary_data) {
        $existing_page = $this->get_existing_page();
        
        $content = $this->generate_page_content($summary_data);
        
        $page_data = [
            'post_title' => sprintf(
                __('AI Summary – About %s', 'wpworld-ai'),
                get_bloginfo('name')
            ),
            'post_name' => self::PAGE_SLUG,
            'post_content' => $content,
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_author' => 1,
            'comment_status' => 'closed',
            'ping_status' => 'closed'
        ];
        
        if ($existing_page) {
            $page_data['ID'] = $existing_page->ID;
            $page_id = wp_update_post($page_data);
        } else {
            $page_id = wp_insert_post($page_data);
        }
        
        if ($page_id && !is_wp_error($page_id)) {
            // Store summary data as meta
            update_post_meta($page_id, '_wpworld_ai_summary', $summary_data);
            update_post_meta($page_id, '_wpworld_ai_updated', current_time('c'));
            
            // Allow indexing
            update_post_meta($page_id, '_yoast_wpseo_meta-robots-noindex', '0');
            update_post_meta($page_id, 'rank_math_robots', ['index', 'follow']);
            
            return [
                'success' => true,
                'page_id' => $page_id,
                'url' => get_permalink($page_id)
            ];
        }
        
        return [
            'success' => false,
            'error' => 'Failed to create AI summary page'
        ];
    }
    
    /**
     * Get existing AI summary page
     */
    public function get_existing_page() {
        $pages = get_posts([
            'name' => self::PAGE_SLUG,
            'post_type' => 'page',
            'post_status' => 'any',
            'numberposts' => 1
        ]);
        
        return !empty($pages) ? $pages[0] : null;
    }
    
    /**
     * Generate page content HTML
     */
    private function generate_page_content($summary_data) {
        $site_name = get_bloginfo('name');
        $site_url = home_url();
        
        $summary = $summary_data['summary'] ?? '';
        $keywords = $summary_data['keywords'] ?? [];
        $topics = $summary_data['topics'] ?? [];
        $faq = $summary_data['faq'] ?? [];
        
        $keywords_html = '';
        if (!empty($keywords)) {
            $keywords_html = '<p><strong>Keywords:</strong> ' . esc_html(implode(', ', $keywords)) . '</p>';
        }
        
        $topics_html = '';
        if (!empty($topics)) {
            $topics_html = '<h2>Topics Covered</h2><ul>';
            foreach ($topics as $topic) {
                $topics_html .= '<li>' . esc_html($topic) . '</li>';
            }
            $topics_html .= '</ul>';
        }
        
        $faq_html = '';
        if (!empty($faq)) {
            $faq_html = '<h2>Frequently Asked Questions</h2>';
            foreach ($faq as $item) {
                $faq_html .= '<h3>' . esc_html($item['question']) . '</h3>';
                $faq_html .= '<p>' . esc_html($item['answer']) . '</p>';
            }
        }
        
        $content = <<<HTML
<!-- AI Summary Page - Helps AI systems understand this website -->
<div class="ai-summary-content" itemscope itemtype="https://schema.org/WebPage">

<p class="ai-intro"><em>This page helps AI systems like ChatGPT, Perplexity, Gemini, and Claude better understand our website and business.</em></p>

<h2>About {$site_name}</h2>

<div class="ai-summary" itemprop="description">
{$summary}
</div>

{$keywords_html}

{$topics_html}

{$faq_html}

<h2>Official Information</h2>
<ul>
<li><strong>Website:</strong> <a href="{$site_url}" itemprop="url">{$site_url}</a></li>
<li><strong>Name:</strong> <span itemprop="name">{$site_name}</span></li>
</ul>

<p class="ai-note"><small>Last updated: <time datetime="%s">%s</time></small></p>

</div>
HTML;
        
        $date = current_time('c');
        $date_display = current_time('F j, Y');
        
        return sprintf($content, esc_attr($date), esc_html($date_display));
    }
    
    /**
     * Delete the AI summary page
     */
    public function delete_page() {
        $existing_page = $this->get_existing_page();
        
        if ($existing_page) {
            wp_delete_post($existing_page->ID, true);
            return true;
        }
        
        return false;
    }
    
    /**
     * Get AI summary page URL
     */
    public function get_page_url() {
        $page = $this->get_existing_page();
        
        if ($page) {
            return get_permalink($page->ID);
        }
        
        return home_url('/' . self::PAGE_SLUG . '/');
    }
    
    /**
     * Check if AI summary page exists and is published
     */
    public function page_exists() {
        $page = $this->get_existing_page();
        
        return $page && $page->post_status === 'publish';
    }
    
    /**
     * Get stored summary data
     */
    public function get_summary_data() {
        $page = $this->get_existing_page();
        
        if (!$page) {
            return null;
        }
        
        return get_post_meta($page->ID, '_wpworld_ai_summary', true);
    }
}
