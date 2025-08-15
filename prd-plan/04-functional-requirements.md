# Functional Requirements - Wietforum België

## 1. User Management & Authentication

### 1.1 Account Registration
**Status:** ✅ Fully Implemented

**Requirements:**
- Email-based registration with verification
- Username uniqueness validation
- Password strength requirements (minimum 8 characters)
- Age verification (18+ only)
- Terms of service acceptance
- GDPR consent management

**Database Schema:**
```sql
-- Users handled by Supabase Auth
-- Profiles in public.profiles table
profiles: {
  user_id: uuid (FK to auth.users),
  username: varchar(50) UNIQUE,
  display_name: varchar(100),
  role: enum('user', 'supplier', 'admin', 'moderator'),
  avatar_url: text,
  bio: text,
  location: varchar(100),
  reputation: integer DEFAULT 0,
  is_email_verified: boolean DEFAULT false,
  is_banned: boolean DEFAULT false,
  created_at: timestamp,
  updated_at: timestamp
}
```

### 1.2 Authentication & Authorization
**Status:** ✅ Fully Implemented

**Features:**
- Email/password login
- Two-Factor Authentication (2FA) with TOTP
- Password reset via email
- Session management with device tracking
- Role-based access control (RBAC)

**Security Features:**
- Rate limiting on login attempts
- Device fingerprinting for suspicious activity detection
- Audit logging for security events
- Automatic session timeout

### 1.3 User Profiles
**Status:** ✅ Fully Implemented

**Profile Features:**
- Avatar upload and management
- Personal information (bio, location)
- Privacy settings for profile visibility
- Activity history and statistics
- Achievement badges display
- Reputation score tracking

## 2. Forum System

### 2.1 Categories & Topics
**Status:** ✅ Fully Implemented

**Category Structure:**
1. **Wetgeving & Nieuws**
   - Belgische cannabis wetgeving
   - Actuele ontwikkelingen
   - Internationale vergelijkingen

2. **Medicinaal Gebruik**
   - Therapeutische toepassingen
   - Patiënt ervaringen
   - Professional consultatie

3. **Teelt & Horticultuur**
   - Indoor/outdoor growing
   - Strain informatie
   - Equipment discussies

4. **Harm Reduction**
   - Veilig gebruik
   - Dosering en effecten
   - Hulpbronnen

5. **Community**
   - Algemene discussies
   - Introductie nieuwe leden
   - Events en meetups

**Database Schema:**
```sql
categories: {
  id: uuid PRIMARY KEY,
  name: varchar(100) NOT NULL,
  description: text,
  slug: varchar(100) UNIQUE,
  icon: varchar(50),
  color: varchar(7),
  image_url: text,
  sort_order: integer DEFAULT 0,
  is_active: boolean DEFAULT true,
  topic_count: integer DEFAULT 0,
  reply_count: integer DEFAULT 0
}

topics: {
  id: uuid PRIMARY KEY,
  category_id: uuid FK categories(id),
  author_id: uuid FK profiles(user_id),
  title: varchar(255) NOT NULL,
  content: text NOT NULL,
  is_pinned: boolean DEFAULT false,
  is_locked: boolean DEFAULT false,
  view_count: integer DEFAULT 0,
  reply_count: integer DEFAULT 0,
  last_activity_at: timestamp,
  created_at: timestamp,
  updated_at: timestamp
}
```

### 2.2 Replies & Threading
**Status:** ✅ Fully Implemented

**Features:**
- Nested reply system with parent-child relationships
- Rich text editor with markdown support
- Image upload and embedding
- Quote functionality for referencing other posts
- Edit history tracking
- Soft delete with reason logging

**Database Schema:**
```sql
replies: {
  id: uuid PRIMARY KEY,
  topic_id: uuid FK topics(id),
  author_id: uuid FK profiles(user_id),
  parent_id: uuid FK replies(id) NULL,
  content: text NOT NULL,
  is_solution: boolean DEFAULT false,
  created_at: timestamp,
  updated_at: timestamp
}
```

### 2.3 Content Management
**Status:** ✅ Fully Implemented

**Rich Text Features:**
- WYSIWYG editor with formatting options
- Image upload with automatic resizing
- Emoji support
- Mention system (@username)
- Automatic link preview generation
- Code syntax highlighting

**Content Moderation:**
- Automated spam detection
- Profanity filtering
- Community reporting system
- Moderator queue for flagged content
- Content appeal process

## 3. Supplier Marketplace

### 3.1 Supplier Profiles
**Status:** ✅ Fully Implemented

**Profile Components:**
- Business information (name, description, contact)
- Brand customization (logo, banner, theme colors)
- Statistics (customers, rating, delivery time)
- Features and specializations list
- Operating hours and delivery areas
- Why choose us section

**Database Schema:**
```sql
supplier_profiles: {
  id: uuid PRIMARY KEY,
  user_id: uuid FK profiles(user_id),
  business_name: varchar(255) NOT NULL,
  description: text,
  contact_info: jsonb DEFAULT '{}',
  stats: jsonb DEFAULT '{}',
  features: text[] DEFAULT '{}',
  ranking: integer DEFAULT 0,
  is_active: boolean DEFAULT true,
  banner_image: text,
  logo_image: text,
  theme_color: varchar(7) DEFAULT '#10b981',
  delivery_areas: text[] DEFAULT '{}',
  opening_hours: jsonb DEFAULT '{}',
  minimum_order: numeric DEFAULT 0,
  delivery_fee: numeric DEFAULT 0,
  why_choose_us: text[] DEFAULT '{}'
}
```

### 3.2 Menu Management
**Status:** ✅ Fully Implemented

**Menu Features:**
- Product catalog with categories
- Pricing tiers for different quantities
- Weight options and availability status
- Product images and descriptions
- Stock level tracking
- Position-based ordering

**Database Schema:**
```sql
supplier_menu_items: {
  id: uuid PRIMARY KEY,
  supplier_id: uuid FK supplier_profiles(id),
  name: text NOT NULL,
  description: text,
  price: numeric NOT NULL DEFAULT 0,
  unit: varchar(20) DEFAULT 'stuk',
  category: text,
  tags: text[] DEFAULT '{}',
  is_available: boolean DEFAULT true,
  position: integer DEFAULT 0,
  pricing_tiers: jsonb DEFAULT '{}',
  weight_options: text[] DEFAULT array['1g','2.5g','5g','10g','25g','50g','100g'],
  in_stock: boolean DEFAULT true,
  image_url: text,
  category_id: uuid FK supplier_categories(id)
}

supplier_categories: {
  id: uuid PRIMARY KEY,
  supplier_id: uuid FK supplier_profiles(id),
  name: varchar(255) NOT NULL,
  description: text,
  sort_order: integer DEFAULT 0,
  is_active: boolean DEFAULT true
}
```

### 3.3 Supplier Discovery
**Status:** ✅ Fully Implemented

**Discovery Features:**
- Public supplier directory
- Search and filtering capabilities
- Ranking system for visibility
- Featured supplier promotions
- Customer reviews and ratings
- Geographic location filtering

## 4. Gamification System

### 4.1 Experience Points (XP) & Levels
**Status:** ✅ Fully Implemented

**XP Sources:**
- Creating topics: 25 XP
- Creating replies: 15 XP
- Receiving upvotes: 5 XP
- Daily login: 5 XP
- First post bonus: 50 XP

**Database Schema:**
```sql
user_levels: {
  id: uuid PRIMARY KEY,
  user_id: uuid FK profiles(user_id),
  current_level: integer DEFAULT 1,
  total_xp: integer DEFAULT 0,
  xp_this_level: integer DEFAULT 0,
  level_title: varchar(100) DEFAULT 'Newbie'
}

level_definitions: {
  id: uuid PRIMARY KEY,
  level_number: integer NOT NULL,
  title: varchar(100) NOT NULL,
  required_xp: integer NOT NULL,
  icon: varchar(50),
  color: varchar(7) DEFAULT '#10b981',
  perks: jsonb DEFAULT '[]'
}
```

### 4.2 Achievements System
**Status:** ✅ Fully Implemented

**Achievement Categories:**
- **First Steps**: First post, first reply, first upvote
- **Engagement**: Daily streaks, conversation starter
- **Community**: Helpful member, expert helper
- **Special**: Seasonal events, milestone achievements

**Database Schema:**
```sql
achievements: {
  id: uuid PRIMARY KEY,
  name: varchar(100) NOT NULL,
  description: text,
  icon: varchar(50),
  category: varchar(50) DEFAULT 'general',
  rarity: varchar(20) DEFAULT 'common',
  points: integer DEFAULT 0,
  criteria: jsonb DEFAULT '{}',
  is_active: boolean DEFAULT true
}

user_achievements: {
  id: uuid PRIMARY KEY,
  user_id: uuid FK profiles(user_id),
  achievement_id: uuid FK achievements(id),
  earned_at: timestamp DEFAULT now(),
  progress: jsonb DEFAULT '{}'
}
```

### 4.3 Streaks & Consistency
**Status:** ✅ Fully Implemented

**Streak Types:**
- Login streaks (daily platform visits)
- Post streaks (consistent content creation)
- Community engagement streaks

**Database Schema:**
```sql
user_streaks: {
  id: uuid PRIMARY KEY,
  user_id: uuid FK profiles(user_id),
  streak_type: varchar(50) DEFAULT 'login',
  current_streak: integer DEFAULT 0,
  longest_streak: integer DEFAULT 0,
  last_activity_date: date
}
```

### 4.4 Points & Rewards
**Status:** ✅ Fully Implemented

**Point Categories:**
- Content points (creating quality posts)
- Social points (community interaction)
- Helpful points (providing useful answers)
- General points (daily activities)

**Database Schema:**
```sql
point_categories: {
  id: uuid PRIMARY KEY,
  name: varchar(100) NOT NULL,
  description: text,
  icon: varchar(50),
  color: varchar(7) DEFAULT '#10b981'
}

user_points: {
  id: uuid PRIMARY KEY,
  user_id: uuid FK profiles(user_id),
  category_id: uuid FK point_categories(id),
  points: integer DEFAULT 0
}

rewards: {
  id: uuid PRIMARY KEY,
  name: varchar(255) NOT NULL,
  description: text,
  reward_type: varchar(50) NOT NULL,
  cost_points: integer DEFAULT 0,
  cost_category_id: uuid FK point_categories(id),
  required_level: integer DEFAULT 1,
  is_active: boolean DEFAULT true,
  is_limited: boolean DEFAULT false,
  max_claims: integer,
  current_claims: integer DEFAULT 0,
  expires_at: timestamp
}
```

## 5. Messaging System

### 5.1 Private Conversations
**Status:** ✅ Fully Implemented

**Features:**
- One-on-one private messaging
- Conversation threading
- Real-time message delivery
- Read receipts and status indicators
- Message search and history
- File attachment support

**Database Schema:**
```sql
conversations: {
  id: uuid PRIMARY KEY,
  created_at: timestamp DEFAULT now(),
  updated_at: timestamp DEFAULT now(),
  last_message_at: timestamp DEFAULT now()
}

conversation_participants: {
  id: uuid PRIMARY KEY,
  conversation_id: uuid FK conversations(id),
  user_id: uuid FK profiles(user_id),
  joined_at: timestamp DEFAULT now(),
  last_read_at: timestamp DEFAULT now()
}

messages: {
  id: uuid PRIMARY KEY,
  conversation_id: uuid FK conversations(id),
  sender_id: uuid FK profiles(user_id),
  content: text NOT NULL,
  is_read: boolean DEFAULT false,
  created_at: timestamp DEFAULT now(),
  updated_at: timestamp DEFAULT now()
}
```

### 5.2 Real-time Features
**Status:** ✅ Fully Implemented

**Real-time Capabilities:**
- Live message delivery via Supabase subscriptions
- Typing indicators during message composition
- Online status indicators
- Push notifications for new messages
- Message status updates (sent, delivered, read)

## 6. Search & Discovery

### 6.1 Content Search
**Status:** 🚧 Partially Implemented

**Search Capabilities:**
- Full-text search across topics and replies
- Filter by category, author, date range
- Tag-based filtering
- Sort by relevance, date, popularity
- Saved search preferences

**Current Implementation:**
- Basic search functionality exists
- Advanced filtering needs enhancement
- Search performance optimization required

### 6.2 User Discovery
**Status:** ✅ Implemented

**Discovery Features:**
- User search by username or display name
- Filter by role (expert, supplier, member)
- Sort by reputation, activity level
- Follow/unfollow functionality
- User recommendation system

## 7. Notifications System

### 7.1 Real-time Notifications
**Status:** ✅ Fully Implemented

**Notification Types:**
- New reply to your topic
- Mention in a post (@username)
- Achievement earned
- Level up notifications
- New private message
- Supplier contact requests

**Database Schema:**
```sql
notifications: {
  id: uuid PRIMARY KEY,
  user_id: uuid FK profiles(user_id),
  type: varchar(50) NOT NULL,
  title: varchar(255) NOT NULL,
  message: text,
  data: jsonb DEFAULT '{}',
  read_at: timestamp,
  created_at: timestamp DEFAULT now()
}
```

### 7.2 Notification Preferences
**Status:** ✅ Implemented

**Preference Controls:**
- Email notification settings
- Push notification preferences
- Frequency controls (real-time, digest, off)
- Category-specific settings
- Do not disturb hours

## 8. Content Moderation

### 8.1 Automated Moderation
**Status:** ✅ Implemented

**Automated Features:**
- Spam detection algorithms
- Profanity filtering
- Link validation and blacklisting
- Rate limiting for posting
- Duplicate content detection

### 8.2 Community Moderation
**Status:** ✅ Implemented

**Community Tools:**
- Content reporting system
- Community voting on reports
- Moderator queue for flagged content
- Appeal process for moderated content
- User reputation impact from moderation

**Database Schema:**
```sql
reports: {
  id: uuid PRIMARY KEY,
  reporter_id: uuid FK profiles(user_id),
  reported_item_id: uuid,
  reported_item_type: varchar(50),
  reason: varchar(100),
  description: text,
  status: varchar(20) DEFAULT 'pending',
  resolved_by: uuid FK profiles(user_id),
  resolved_at: timestamp
}
```

## 9. Analytics & Insights

### 9.1 User Analytics
**Status:** ✅ Implemented

**User Metrics:**
- Activity tracking (posts, replies, votes)
- Session duration and frequency
- Feature usage analytics
- Engagement scoring
- Retention metrics

### 9.2 Content Analytics
**Status:** ✅ Implemented

**Content Metrics:**
- Post performance (views, replies, votes)
- Topic trending analysis
- Category popularity
- Search query analytics
- Content quality scoring

## 10. Security & Privacy

### 10.1 Data Protection
**Status:** ✅ Fully Implemented

**Privacy Features:**
- GDPR compliant data handling
- User data export functionality
- Account deletion with data purging
- Privacy settings for profile visibility
- Consent management for data processing

**Database Schema:**
```sql
user_privacy_settings: {
  id: uuid PRIMARY KEY,
  user_id: uuid FK profiles(user_id),
  profile_visibility: varchar(20) DEFAULT 'public',
  email_notifications: boolean DEFAULT true,
  activity_tracking: boolean DEFAULT true,
  data_sharing: boolean DEFAULT false,
  marketing_emails: boolean DEFAULT false,
  security_alerts: boolean DEFAULT true
}
```

### 10.2 Security Monitoring
**Status:** ✅ Fully Implemented

**Security Features:**
- Device fingerprinting for unusual activity
- IP-based geographic tracking
- Failed login attempt monitoring
- Security event logging and alerting
- Automated threat response

**Database Schema:**
```sql
user_security_events: {
  id: uuid PRIMARY KEY,
  user_id: uuid FK profiles(user_id),
  event_type: varchar(100),
  event_description: text,
  ip_address: inet,
  user_agent: text,
  risk_level: varchar(20) DEFAULT 'low',
  metadata: jsonb DEFAULT '{}'
}
```

This comprehensive functional requirements document covers all major system capabilities implemented in Wietforum België, providing the technical foundation for understanding platform functionality and future development priorities.