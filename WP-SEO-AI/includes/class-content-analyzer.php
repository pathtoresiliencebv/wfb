<?php
/**
 * Content Analyzer
 * Analyzes site content quality and SEO elements for reporting
 */

if (!defined('ABSPATH')) {
    exit;
}

class WPWorld_AI_Content_Analyzer {
    
    /**
     * Analyze homepage and return detailed metrics
     */
    public function analyze_homepage() {
        $home_url = home_url('/');
        
        // Fetch as external browser to get full SEO tags
        $response = wp_remote_get($home_url, [
            'timeout' => 15,
            'sslverify' => false,
            'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'headers' => [
                'Accept' => 'text/html,application/xhtml+xml',
                'Accept-Language' => 'en-US,en;q=0.9'
            ]
        ]);
        
        if (is_wp_error($response)) {
            return ['error' => $response->get_error_message()];
        }
        
        $html = wp_remote_retrieve_body($response);
        
        return [
            'meta' => $this->analyze_meta($html),
            'schema' => $this->analyze_schema($html),
            'content' => $this->analyze_content_quality($html),
            'images' => $this->analyze_images($html),
            'headings' => $this->analyze_headings($html),
            'links' => $this->analyze_links($html)
        ];
    }
    
    /**
     * Analyze meta tags
     */
    private function analyze_meta($html) {
        $meta = [
            'title' => '',
            'title_length' => 0,
            'description' => '',
            'description_length' => 0,
            'has_og_tags' => false,
            'has_twitter_cards' => false,
            'canonical' => '',
            'robots' => ''
        ];
        
        // Title
        if (preg_match('/<title[^>]*>(.*?)<\/title>/si', $html, $match)) {
            $meta['title'] = trim(strip_tags($match[1]));
            $meta['title_length'] = mb_strlen($meta['title']);
        }
        
        // Description - use simpler, more robust regex
        if (preg_match('/<meta[^>]+name=["\']?description["\']?[^>]+content=["\']?([^"\']+)["\']?/si', $html, $match)) {
            $meta['description'] = html_entity_decode(trim($match[1]), ENT_QUOTES, 'UTF-8');
            $meta['description_length'] = mb_strlen($meta['description']);
        } elseif (preg_match('/<meta[^>]+content=["\']?([^"\']+)["\']?[^>]+name=["\']?description["\']?/si', $html, $match)) {
            $meta['description'] = html_entity_decode(trim($match[1]), ENT_QUOTES, 'UTF-8');
            $meta['description_length'] = mb_strlen($meta['description']);
        }
        
        // OG tags
        $meta['has_og_tags'] = (bool) preg_match('/<meta[^>]+property=["\']og:/si', $html);
        
        // Twitter cards
        $meta['has_twitter_cards'] = (bool) preg_match('/<meta[^>]+name=["\']twitter:/si', $html);
        
        // Canonical
        if (preg_match('/<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\'][^>]*>/si', $html, $match)) {
            $meta['canonical'] = $match[1];
        }
        
        // Robots
        if (preg_match('/<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']+)["\'][^>]*>/si', $html, $match)) {
            $meta['robots'] = $match[1];
        }
        
        // Quality assessment
        $meta['quality'] = $this->assess_meta_quality($meta);
        
        return $meta;
    }
    
    /**
     * Assess meta quality
     */
    private function assess_meta_quality($meta) {
        $score = 0;
        $issues = [];
        $good = [];
        
        // Title
        if ($meta['title_length'] > 0) {
            if ($meta['title_length'] >= 30 && $meta['title_length'] <= 60) {
                $score += 25;
                $good[] = 'Title length is optimal';
            } elseif ($meta['title_length'] > 60) {
                $score += 15;
                $issues[] = 'Title is too long (may be truncated)';
            } else {
                $score += 10;
                $issues[] = 'Title is too short';
            }
        } else {
            $issues[] = 'Missing title tag';
        }
        
        // Description
        if ($meta['description_length'] > 0) {
            if ($meta['description_length'] >= 120 && $meta['description_length'] <= 160) {
                $score += 25;
                $good[] = 'Description length is optimal';
            } elseif ($meta['description_length'] > 160) {
                $score += 15;
                $issues[] = 'Description is too long';
            } else {
                $score += 10;
                $issues[] = 'Description is too short';
            }
        } else {
            $issues[] = 'Missing meta description';
        }
        
        // OG tags
        if ($meta['has_og_tags']) {
            $score += 25;
            $good[] = 'Open Graph tags present';
        } else {
            $issues[] = 'Missing Open Graph tags';
        }
        
        // Twitter
        if ($meta['has_twitter_cards']) {
            $score += 15;
            $good[] = 'Twitter Card tags present';
        }
        
        // Canonical
        if (!empty($meta['canonical'])) {
            $score += 10;
            $good[] = 'Canonical URL set';
        }
        
        return [
            'score' => min(100, $score),
            'status' => $score >= 80 ? 'excellent' : ($score >= 60 ? 'good' : 'needs_work'),
            'issues' => $issues,
            'good' => $good
        ];
    }
    
    /**
     * Analyze schema markup
     */
    private function analyze_schema($html) {
        $schemas = [];
        
        // Find JSON-LD scripts
        preg_match_all('/<script[^>]+type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/si', $html, $matches);
        
        foreach ($matches[1] as $json) {
            $decoded = json_decode($json, true);
            if ($decoded) {
                // Handle @graph format
                if (isset($decoded['@graph'])) {
                    foreach ($decoded['@graph'] as $item) {
                        $schemas[] = $this->extract_schema_info($item);
                    }
                } else {
                    $schemas[] = $this->extract_schema_info($decoded);
                }
            }
        }
        
        return [
            'found' => !empty($schemas),
            'count' => count($schemas),
            'types' => array_column($schemas, 'type'),
            'details' => $schemas
        ];
    }
    
    /**
     * Extract schema info
     */
    private function extract_schema_info($schema) {
        $info = [
            'type' => $schema['@type'] ?? 'Unknown',
            'id' => $schema['@id'] ?? null
        ];
        
        // Extract key properties based on type
        switch ($info['type']) {
            case 'Organization':
            case 'LocalBusiness':
                $info['name'] = $schema['name'] ?? null;
                $info['logo'] = isset($schema['logo']);
                $info['url'] = $schema['url'] ?? null;
                break;
            case 'WebSite':
                $info['name'] = $schema['name'] ?? null;
                $info['has_search'] = isset($schema['potentialAction']);
                break;
            case 'FAQPage':
                $info['question_count'] = count($schema['mainEntity'] ?? []);
                break;
            case 'Article':
            case 'BlogPosting':
                $info['headline'] = $schema['headline'] ?? null;
                $info['author'] = $schema['author']['name'] ?? null;
                break;
        }
        
        return $info;
    }
    
    /**
     * Analyze content quality
     */
    private function analyze_content_quality($html) {
        // Remove scripts, styles
        $clean = preg_replace('/<script[^>]*>.*?<\/script>/si', '', $html);
        $clean = preg_replace('/<style[^>]*>.*?<\/style>/si', '', $clean);
        
        $text = strip_tags($clean);
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);
        
        $word_count = str_word_count($text);
        
        return [
            'word_count' => $word_count,
            'reading_time' => ceil($word_count / 200), // ~200 words per minute
            'has_sufficient_content' => $word_count >= 300
        ];
    }
    
    /**
     * Analyze images
     */
    private function analyze_images($html) {
        preg_match_all('/<img[^>]+>/si', $html, $matches);
        
        $total = count($matches[0]);
        $with_alt = 0;
        $without_alt = [];
        
        foreach ($matches[0] as $img) {
            if (preg_match('/alt=["\']([^"\']+)["\']/', $img, $alt_match)) {
                if (!empty(trim($alt_match[1]))) {
                    $with_alt++;
                } else {
                    // Get src for reference
                    preg_match('/src=["\']([^"\']+)["\']/', $img, $src_match);
                    $without_alt[] = $src_match[1] ?? 'unknown';
                }
            } else {
                preg_match('/src=["\']([^"\']+)["\']/', $img, $src_match);
                $without_alt[] = $src_match[1] ?? 'unknown';
            }
        }
        
        return [
            'total' => $total,
            'with_alt' => $with_alt,
            'without_alt_count' => count($without_alt),
            'alt_percentage' => $total > 0 ? round(($with_alt / $total) * 100) : 100
        ];
    }
    
    /**
     * Analyze headings
     */
    private function analyze_headings($html) {
        $headings = [];
        
        for ($i = 1; $i <= 6; $i++) {
            preg_match_all("/<h{$i}[^>]*>(.*?)<\/h{$i}>/si", $html, $matches);
            $headings["h{$i}"] = [
                'count' => count($matches[1]),
                'examples' => array_slice(array_map('strip_tags', $matches[1]), 0, 3)
            ];
        }
        
        return [
            'has_h1' => $headings['h1']['count'] > 0,
            'h1_count' => $headings['h1']['count'],
            'has_proper_hierarchy' => $headings['h1']['count'] === 1 && $headings['h2']['count'] > 0,
            'breakdown' => $headings
        ];
    }
    
    /**
     * Analyze links
     */
    private function analyze_links($html) {
        preg_match_all('/<a[^>]+href=["\']([^"\']+)["\'][^>]*>/si', $html, $matches);
        
        $internal = 0;
        $external = 0;
        $home_url = home_url();
        
        foreach ($matches[1] as $href) {
            if (strpos($href, $home_url) === 0 || strpos($href, '/') === 0) {
                $internal++;
            } elseif (strpos($href, 'http') === 0) {
                $external++;
            }
        }
        
        return [
            'total' => count($matches[1]),
            'internal' => $internal,
            'external' => $external
        ];
    }
    
    /**
     * Get full analysis for reporting
     */
    public function get_full_analysis() {
        $homepage = $this->analyze_homepage();
        
        // Get content stats from data collector
        $data_collector = new WPWorld_AI_Data_Collector();
        $content_stats = $data_collector->get_content_stats();
        
        // Check llms.txt
        $llms = new WPWorld_AI_LLMs_Txt();
        
        return [
            'homepage' => $homepage,
            'content_stats' => $content_stats,
            'llms_txt' => [
                'url' => $llms->get_url(),
                'accessible' => $llms->is_accessible()
            ],
            'analyzed_at' => current_time('c')
        ];
    }
}
