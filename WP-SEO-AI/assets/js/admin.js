/**
 * WPWorld AI Visibility Engine - Admin JavaScript
 */

(function($) {
    'use strict';

    const WPWorldAI = {
        /**
         * Initialize
         */
        init: function() {
            this.bindEvents();
            this.checkStatus();
        },

        /**
         * Bind event handlers
         */
        bindEvents: function() {
            // Manual sync button (if added later)
            $(document).on('click', '.wpworld-ai-sync-btn', this.triggerSync.bind(this));
            
            // Manual indexing ping (if added later)
            $(document).on('click', '.wpworld-ai-ping-btn', this.triggerPing.bind(this));
        },

        /**
         * Check plugin status via REST API
         */
        checkStatus: function() {
            // Could be used for live status updates
        },

        /**
         * Trigger manual sync
         */
        triggerSync: function(e) {
            e.preventDefault();
            
            const $btn = $(e.currentTarget);
            const originalText = $btn.text();
            
            $btn.prop('disabled', true).text('Syncing...');
            
            $.ajax({
                url: wpworldAI.ajaxUrl,
                method: 'POST',
                data: {
                    action: 'wpworld_ai_manual_sync',
                    nonce: wpworldAI.nonce
                },
                success: function(response) {
                    if (response.success) {
                        $btn.text('Synced!');
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    } else {
                        $btn.text('Error');
                        console.error('Sync failed:', response.data);
                    }
                },
                error: function(xhr, status, error) {
                    $btn.text('Error');
                    console.error('Sync error:', error);
                },
                complete: function() {
                    setTimeout(function() {
                        $btn.prop('disabled', false).text(originalText);
                    }, 3000);
                }
            });
        },

        /**
         * Trigger manual indexing ping
         */
        triggerPing: function(e) {
            e.preventDefault();
            
            const $btn = $(e.currentTarget);
            const originalText = $btn.text();
            
            $btn.prop('disabled', true).text('Pinging...');
            
            $.ajax({
                url: wpworldAI.ajaxUrl,
                method: 'POST',
                data: {
                    action: 'wpworld_ai_manual_ping',
                    nonce: wpworldAI.nonce
                },
                success: function(response) {
                    if (response.success) {
                        $btn.text('Done!');
                        setTimeout(function() {
                            location.reload();
                        }, 1000);
                    } else {
                        $btn.text('Error');
                        console.error('Ping failed:', response.data);
                    }
                },
                error: function(xhr, status, error) {
                    $btn.text('Error');
                    console.error('Ping error:', error);
                },
                complete: function() {
                    setTimeout(function() {
                        $btn.prop('disabled', false).text(originalText);
                    }, 3000);
                }
            });
        }
    };

    // Initialize when ready
    $(document).ready(function() {
        WPWorldAI.init();
    });

})(jQuery);
