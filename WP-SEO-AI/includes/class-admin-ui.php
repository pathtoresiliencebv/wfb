<?php
/**
 * Admin UI Dashboard
 */

if (!defined('ABSPATH')) {
    exit;
}

class WPWorld_AI_Admin_UI {
    
    /**
     * Get progress data from backend
     */
    private function get_progress_data() {
        $site_id = get_option('wpworld_ai_site_id', '');
        if (empty($site_id)) {
            return null;
        }
        
        // Cache progress data for 5 minutes
        $cache_key = 'wpworld_ai_progress_' . $site_id;
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return $cached;
        }
        
        $api_client = new WPWorld_AI_API_Client();
        $response = $api_client->get_progress();
        
        if ($response && isset($response['progress'])) {
            set_transient($cache_key, $response, 5 * MINUTE_IN_SECONDS);
            return $response;
        }
        
        return null;
    }
    
    /**
     * Render the admin dashboard
     */
    public function render_dashboard() {
        $ai_summary = new WPWorld_AI_AI_Summary();
        $indexing = new WPWorld_AI_Indexing();
        
        $is_registered = get_option('wpworld_ai_registered', false);
        $site_id = get_option('wpworld_ai_site_id', '');
        $ai_summary_exists = $ai_summary->page_exists();
        $schema_enabled = get_option('wpworld_ai_schema_enabled', false);
        $indexing_history = $indexing->get_indexing_history(3);
        
        // Get progress from backend
        $progress_data = $this->get_progress_data();
        $progress = $progress_data['progress'] ?? 0;
        $status = $progress_data['status'] ?? 'pending';
        $completed_tasks = $progress_data['completedTasks'] ?? 0;
        $total_tasks = $progress_data['totalTasks'] ?? 0;
        $phase = $progress_data['phase'] ?? 0;
        
        // Determine status label and color
        $status_label = $this->get_status_label($status, $progress);
        $progress_color = $this->get_progress_color($progress);
        
        ?>
        <div class="wrap wpworld-ai-dashboard">
            <h1>
                <span class="dashicons dashicons-visibility"></span>
                <?php _e('AI & SEO Visibility', 'wpworld-ai'); ?>
            </h1>
            
            <?php if ($is_registered && $status !== 'pending'): ?>
            <!-- Reassurance Banner -->
            <div class="wpworld-ai-reassurance-banner">
                <div class="reassurance-icon">🚀</div>
                <div class="reassurance-content">
                    <strong><?php _e('Your AI & SEO optimization is in progress!', 'wpworld-ai'); ?></strong>
                    <p><?php _e('Our automated systems, AI agents, and SEO team experts are reviewing your site and boosting your visibility for AI Chats & Search Engines. Expect a detailed final report (viewable here and via email) within 20-30 days of project activation.', 'wpworld-ai'); ?></p>
                </div>
            </div>
            <?php endif; ?>
            
            <?php if ($is_registered && $status !== 'pending'): ?>
            <!-- Main Progress Section -->
            <div class="wpworld-ai-progress-section">
                <div class="progress-header">
                    <div class="progress-title">
                        <h2><?php _e('SEO & AI Visibility Generation', 'wpworld-ai'); ?></h2>
                        <span class="status-badge <?php echo esc_attr($status); ?>"><?php echo esc_html($status_label); ?></span>
                    </div>
                    <div class="progress-stats">
                        <span class="progress-percentage" style="color: <?php echo esc_attr($progress_color); ?>">
                            <?php echo esc_html($progress); ?>%
                        </span>
                        <span class="progress-tasks">
                            <?php printf(__('%d of %d tasks completed', 'wpworld-ai'), $completed_tasks, $total_tasks); ?>
                        </span>
                    </div>
                </div>
                
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: <?php echo esc_attr($progress); ?>%; background: <?php echo esc_attr($progress_color); ?>;"></div>
                </div>
                
                <!-- Timeline -->
                <div class="progress-timeline">
                    <?php $this->render_timeline($phase, $ai_summary_exists, $schema_enabled, !empty($indexing_history), $progress); ?>
                </div>
            </div>
            <?php elseif ($is_registered && $status === 'pending'): ?>
            <!-- Awaiting Activation -->
            <div class="wpworld-ai-awaiting-section">
                <div class="awaiting-icon">⏳</div>
                <h2><?php _e('Awaiting Activation', 'wpworld-ai'); ?></h2>
                <p><?php _e('Your site is registered! Your SEO Ranking & AI Visibility project will begin shortly once activated by our team.', 'wpworld-ai'); ?></p>
                <p><small><?php _e('You\'ll receive an email when your optimization begins.', 'wpworld-ai'); ?></small></p>
            </div>
            <?php endif; ?>
            
            <div class="wpworld-ai-status-cards">
                <!-- Connection Status -->
                <div class="wpworld-ai-card <?php echo $is_registered ? 'status-ok' : 'status-error'; ?>">
                    <div class="card-icon">
                        <span class="dashicons <?php echo $is_registered ? 'dashicons-yes-alt' : 'dashicons-warning'; ?>"></span>
                    </div>
                    <div class="card-content">
                        <h3><?php _e('SEO Backend Connection', 'wpworld-ai'); ?></h3>
                        <p>
                            <?php if ($is_registered): ?>
                                <?php _e('Connected', 'wpworld-ai'); ?>
                                <small>(ID: <?php echo esc_html(substr($site_id, 0, 8)); ?>...)</small>
                            <?php else: ?>
                                <?php _e('Not connected', 'wpworld-ai'); ?>
                            <?php endif; ?>
                        </p>
                    </div>
                </div>
                
                <!-- AI Summary Page -->
                <div class="wpworld-ai-card <?php echo $ai_summary_exists ? 'status-ok' : 'status-pending'; ?>">
                    <div class="card-icon">
                        <span class="dashicons <?php echo $ai_summary_exists ? 'dashicons-yes-alt' : 'dashicons-clock'; ?>"></span>
                    </div>
                    <div class="card-content">
                        <h3><?php _e('AI Summary Page', 'wpworld-ai'); ?></h3>
                        <p>
                            <?php if ($ai_summary_exists): ?>
                                <?php _e('Active', 'wpworld-ai'); ?>
                                <a href="<?php echo esc_url($ai_summary->get_page_url()); ?>" target="_blank">
                                    <?php _e('View', 'wpworld-ai'); ?> →
                                </a>
                            <?php else: ?>
                                <?php _e('Pending creation', 'wpworld-ai'); ?>
                            <?php endif; ?>
                        </p>
                    </div>
                </div>
                
                <!-- Schema Status -->
                <div class="wpworld-ai-card <?php echo $schema_enabled ? 'status-ok' : 'status-pending'; ?>">
                    <div class="card-icon">
                        <span class="dashicons <?php echo $schema_enabled ? 'dashicons-yes-alt' : 'dashicons-clock'; ?>"></span>
                    </div>
                    <div class="card-content">
                        <h3><?php _e('Schema Markup', 'wpworld-ai'); ?></h3>
                        <p>
                            <?php if ($schema_enabled): ?>
                                <?php _e('Enabled', 'wpworld-ai'); ?>
                            <?php else: ?>
                                <?php _e('Pending setup', 'wpworld-ai'); ?>
                            <?php endif; ?>
                        </p>
                    </div>
                </div>
                
                <!-- Indexing Status -->
                <div class="wpworld-ai-card <?php echo !empty($indexing_history) ? 'status-ok' : 'status-pending'; ?>">
                    <div class="card-icon">
                        <span class="dashicons <?php echo !empty($indexing_history) ? 'dashicons-yes-alt' : 'dashicons-clock'; ?>"></span>
                    </div>
                    <div class="card-content">
                        <h3><?php _e('Search Indexing', 'wpworld-ai'); ?></h3>
                        <p>
                            <?php if (!empty($indexing_history)): ?>
                                <?php 
                                $last = $indexing_history[0];
                                $data = $last['log_value'];
                                echo $data['success'] ? __('Last ping successful', 'wpworld-ai') : __('Last ping failed', 'wpworld-ai');
                                ?>
                            <?php else: ?>
                                <?php _e('No pings yet', 'wpworld-ai'); ?>
                            <?php endif; ?>
                        </p>
                    </div>
                </div>
            </div>
            
            <?php if ($progress >= 100): ?>
            <!-- Primer Complete - Report CTA -->
            <div class="wpworld-ai-complete-section">
                <div class="complete-icon">🎉</div>
                <h2><?php _e('Your AI & SEO Visibility Report is Ready!', 'wpworld-ai'); ?></h2>
                <p><?php _e('Congratulations! Your website optimization is complete. View your detailed report below.', 'wpworld-ai'); ?></p>
                
                <?php 
                $report_url = $progress_data['reportUrl'] ?? '';
                if (!empty($report_url)): 
                ?>
                <a href="<?php echo esc_url($report_url); ?>" target="_blank" class="button button-primary button-hero wpworld-report-btn">
                    <span class="dashicons dashicons-media-document"></span>
                    <?php _e('View Your AI Visibility Report', 'wpworld-ai'); ?> →
                </a>
                <?php endif; ?>
                
                <div class="upgrade-section">
                    <h3><?php _e('Want to continue improving?', 'wpworld-ai'); ?></h3>
                    <div class="upgrade-features">
                        <div class="feature">
                            <span class="dashicons dashicons-chart-line"></span>
                            <span><?php _e('Continuous Monitoring', 'wpworld-ai'); ?></span>
                        </div>
                        <div class="feature">
                            <span class="dashicons dashicons-media-document"></span>
                            <span><?php _e('Monthly Reports', 'wpworld-ai'); ?></span>
                        </div>
                        <div class="feature">
                            <span class="dashicons dashicons-networking"></span>
                            <span><?php _e('Priority Citations', 'wpworld-ai'); ?></span>
                        </div>
                        <div class="feature">
                            <span class="dashicons dashicons-admin-users"></span>
                            <span><?php _e('Dedicated Support', 'wpworld-ai'); ?></span>
                        </div>
                    </div>
                    
                    <a href="https://wpworld.host/ai-visibility-premium" target="_blank" class="button button-secondary">
                        <?php _e('Upgrade to Premium AI Visibility', 'wpworld-ai'); ?> →
                    </a>
                </div>
            </div>
            <?php endif; ?>
            
            <!-- Info Box -->
            <div class="wpworld-ai-info-box">
                <h2><?php _e('How Your SEO Ranking & AI Visibility Project Works', 'wpworld-ai'); ?></h2>
                <p>
                    <?php _e('This plugin optimizes your website for AI systems like ChatGPT, Gemini, Perplexity, and Claude — while also improving your SEO rating and search engine ranking potential. This is achieved through our automated AI systems and our team\'s direct work. Here\'s what we do:', 'wpworld-ai'); ?>
                </p>
                <ul>
                    <li><strong><?php _e('AI Summary Page', 'wpworld-ai'); ?></strong> — <?php _e('A dedicated page that helps AI systems understand your business', 'wpworld-ai'); ?></li>
                    <li><strong><?php _e('Schema Markup', 'wpworld-ai'); ?></strong> — <?php _e('Structured data that search engines and AI can read', 'wpworld-ai'); ?></li>
                    <li><strong><?php _e('Search Indexing', 'wpworld-ai'); ?></strong> — <?php _e('Fast submission to Google, Bing, and IndexNow for faster indexing', 'wpworld-ai'); ?></li>
                    <li><strong><?php _e('AI Citations', 'wpworld-ai'); ?></strong> — <?php _e('External references that improve your AI discoverability', 'wpworld-ai'); ?></li>
                    <li><strong><?php _e('Blog Posts & Content', 'wpworld-ai'); ?></strong> — <?php _e('SEO-optimized articles published on high-authority platforms', 'wpworld-ai'); ?></li>
                    <li><strong><?php _e('Performance Scans', 'wpworld-ai'); ?></strong> — <?php _e('Before and after visibility measurements to track your improvement', 'wpworld-ai'); ?></li>
                </ul>
                <p>
                    <small><?php _e('All optimizations are performed by our systems and our experts. No action required from you.', 'wpworld-ai'); ?></small>
                </p>
            </div>
            
            <!-- All Tasks Progress -->
            <?php 
            $all_tasks = $progress_data['tasks'] ?? [];
            if (!empty($all_tasks)): 
            ?>
            <div class="wpworld-ai-all-tasks">
                <h2><?php _e('Optimization Tasks', 'wpworld-ai'); ?></h2>
                <p class="tasks-subtitle"><?php _e('Here\'s everything our team and AI systems are working on for your site:', 'wpworld-ai'); ?></p>
                <div class="tasks-grid">
                    <?php foreach ($all_tasks as $task): 
                        $task_label = $this->get_task_label($task['taskType']);
                        $task_status = $task['status'];
                        $is_completed = $task_status === 'completed';
                        $is_running = $task_status === 'running';
                    ?>
                    <div class="task-item <?php echo esc_attr($task_status); ?>">
                        <div class="task-icon">
                            <?php if ($is_completed): ?>
                                <span class="dashicons dashicons-yes-alt"></span>
                            <?php elseif ($is_running): ?>
                                <span class="dashicons dashicons-update spinning"></span>
                            <?php else: ?>
                                <span class="dashicons dashicons-clock"></span>
                            <?php endif; ?>
                        </div>
                        <div class="task-info">
                            <span class="task-name"><?php echo esc_html($task_label['name']); ?></span>
                            <span class="task-description"><?php echo esc_html($task_label['description']); ?></span>
                        </div>
                        <div class="task-status-badge <?php echo esc_attr($task_status); ?>">
                            <?php 
                            if ($is_completed) {
                                _e('Complete', 'wpworld-ai');
                            } elseif ($is_running) {
                                _e('In Progress', 'wpworld-ai');
                            } else {
                                _e('Scheduled', 'wpworld-ai');
                            }
                            ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
            
            <!-- Recent Activity (only show successful pings) -->
            <?php 
            $successful_pings = array_filter($indexing_history, function($log) {
                return isset($log['log_value']['success']) && $log['log_value']['success'];
            });
            if (!empty($successful_pings)): 
            ?>
            <div class="wpworld-ai-activity">
                <h2><?php _e('Recent Activity', 'wpworld-ai'); ?></h2>
                <table class="widefat">
                    <thead>
                        <tr>
                            <th><?php _e('Action', 'wpworld-ai'); ?></th>
                            <th><?php _e('Status', 'wpworld-ai'); ?></th>
                            <th><?php _e('Time', 'wpworld-ai'); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($successful_pings as $log): ?>
                        <tr>
                            <td>
                                <?php echo esc_html(ucfirst($log['log_key'])); ?> 
                                <?php _e('ping', 'wpworld-ai'); ?>
                            </td>
                            <td>
                                <span class="status-badge success"><?php _e('Success', 'wpworld-ai'); ?></span>
                            </td>
                            <td>
                                <?php echo esc_html(human_time_diff(strtotime($log['created_at']), current_time('timestamp'))); ?>
                                <?php _e('ago', 'wpworld-ai'); ?>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>
            
        </div>
        <?php
    }
    
    /**
     * Render progress timeline
     */
    private function render_timeline($phase, $ai_summary_done, $schema_done, $indexing_done, $progress) {
        $steps = [
            ['label' => __('Data Collection', 'wpworld-ai'), 'done' => $phase >= 1],
            ['label' => __('AI Summary', 'wpworld-ai'), 'done' => $ai_summary_done],
            ['label' => __('Schema Markup', 'wpworld-ai'), 'done' => $schema_done],
            ['label' => __('Search Indexing', 'wpworld-ai'), 'done' => $indexing_done],
            ['label' => __('Citations', 'wpworld-ai'), 'done' => $progress >= 70],
            ['label' => __('Report', 'wpworld-ai'), 'done' => $progress >= 100],
        ];
        
        echo '<div class="timeline-steps">';
        foreach ($steps as $index => $step) {
            $class = $step['done'] ? 'completed' : 'pending';
            echo '<div class="timeline-step ' . esc_attr($class) . '">';
            echo '<div class="step-indicator">';
            if ($step['done']) {
                echo '<span class="dashicons dashicons-yes"></span>';
            } else {
                echo '<span class="step-number">' . ($index + 1) . '</span>';
            }
            echo '</div>';
            echo '<span class="step-label">' . esc_html($step['label']) . '</span>';
            echo '</div>';
        }
        echo '</div>';
    }
    
    /**
     * Get status label
     */
    private function get_status_label($status, $progress) {
        if ($progress >= 100) {
            return __('Complete', 'wpworld-ai');
        } elseif ($status === 'active') {
            return __('In Progress', 'wpworld-ai');
        } elseif ($status === 'pending') {
            return __('Awaiting Activation', 'wpworld-ai');
        }
        return __('Unknown', 'wpworld-ai');
    }
    
    /**
     * Get progress color
     */
    private function get_progress_color($progress) {
        if ($progress >= 100) {
            return '#10b981'; // Green
        } elseif ($progress >= 50) {
            return '#3b82f6'; // Blue
        } elseif ($progress >= 25) {
            return '#f59e0b'; // Orange
        }
        return '#6b7280'; // Gray
    }
    
    /**
     * Get friendly task labels
     */
    private function get_task_label($task_type) {
        $labels = [
            'collect_data' => [
                'name' => __('Data Collection', 'wpworld-ai'),
                'description' => __('Analyzing your website content and structure', 'wpworld-ai')
            ],
            'generate_ai_summary' => [
                'name' => __('AI Summary Generation', 'wpworld-ai'),
                'description' => __('Creating AI-optimized content summary', 'wpworld-ai')
            ],
            'create_ai_summary_page' => [
                'name' => __('AI Summary Page', 'wpworld-ai'),
                'description' => __('Publishing dedicated AI discovery page', 'wpworld-ai')
            ],
            'inject_schema' => [
                'name' => __('Schema Markup', 'wpworld-ai'),
                'description' => __('Adding structured data for search engines', 'wpworld-ai')
            ],
            'optimize_meta' => [
                'name' => __('Meta Optimization', 'wpworld-ai'),
                'description' => __('Enhancing page titles and descriptions', 'wpworld-ai')
            ],
            'ping_indexing' => [
                'name' => __('Search Engine Ping', 'wpworld-ai'),
                'description' => __('Notifying Google, Bing & IndexNow', 'wpworld-ai')
            ],
            'scan_performance_before' => [
                'name' => __('Initial Performance Scan', 'wpworld-ai'),
                'description' => __('Measuring baseline visibility metrics', 'wpworld-ai')
            ],
            'create_citation_notion' => [
                'name' => __('Notion Citation', 'wpworld-ai'),
                'description' => __('Publishing reference on Notion', 'wpworld-ai')
            ],
            'create_citation_telegraph' => [
                'name' => __('Telegraph Citation', 'wpworld-ai'),
                'description' => __('Publishing reference on Telegraph', 'wpworld-ai')
            ],
            'create_citation_devto' => [
                'name' => __('Dev.to Citation', 'wpworld-ai'),
                'description' => __('Publishing reference on Dev.to', 'wpworld-ai')
            ],
            'create_citation_aihub' => [
                'name' => __('AI Hub Citation', 'wpworld-ai'),
                'description' => __('Publishing reference on AI Hub', 'wpworld-ai')
            ],
            'create_citation_ghost' => [
                'name' => __('Ghost Citation', 'wpworld-ai'),
                'description' => __('Publishing reference on Ghost', 'wpworld-ai')
            ],
            'create_blogpost_writeas' => [
                'name' => __('Write.as Blog Post', 'wpworld-ai'),
                'description' => __('Publishing organic blog content', 'wpworld-ai')
            ],
            'create_blogpost_hashnode' => [
                'name' => __('Hashnode Blog Post', 'wpworld-ai'),
                'description' => __('Publishing tech blog content', 'wpworld-ai')
            ],
            'scan_performance_after' => [
                'name' => __('Final Performance Scan', 'wpworld-ai'),
                'description' => __('Measuring improved visibility metrics', 'wpworld-ai')
            ],
            'scan_schema_validation' => [
                'name' => __('Schema Validation', 'wpworld-ai'),
                'description' => __('Verifying structured data implementation', 'wpworld-ai')
            ],
            'compile_report_data' => [
                'name' => __('Report Compilation', 'wpworld-ai'),
                'description' => __('Gathering all optimization results', 'wpworld-ai')
            ],
            'generate_pdf_report' => [
                'name' => __('Report Generation', 'wpworld-ai'),
                'description' => __('Creating your detailed visibility report', 'wpworld-ai')
            ],
            'send_report_email' => [
                'name' => __('Report Delivery', 'wpworld-ai'),
                'description' => __('Sending report to your email', 'wpworld-ai')
            ],
            'mark_project_complete' => [
                'name' => __('Project Completion', 'wpworld-ai'),
                'description' => __('Finalizing your AI visibility optimization', 'wpworld-ai')
            ],
        ];
        
        return $labels[$task_type] ?? [
            'name' => ucwords(str_replace('_', ' ', $task_type)),
            'description' => __('Processing...', 'wpworld-ai')
        ];
    }
}
