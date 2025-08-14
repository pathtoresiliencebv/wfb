# Testing Instructions for Supplier Login

## Test Leverancier Account Setup

To test the new supplier functionality, follow these steps:

### Step 1: Create Auth User (REQUIRED)

Since the database now has a complete supplier profile ready, you just need to create the auth user:

1. **Register the test account:**
   - Go to `/register`
   - Use email: `leverancier@test.com`
   - Use password: `12345678`
   - Complete registration

2. **Link to existing profile:**
   - The system will automatically link to the existing "leverancier" profile
   - No manual admin promotion needed - the profile already has supplier role

### Option 2: Database Setup (If needed)

If you have existing auth users, you can update the database directly:

```sql
-- Update an existing user to be the test supplier
UPDATE public.profiles 
SET username = 'leverancier', 
    display_name = 'Cannabis Shop Amsterdam',
    role = 'supplier' 
WHERE user_id = 'YOUR_EXISTING_USER_ID';

-- Create supplier profile (replace USER_ID)
INSERT INTO public.supplier_profiles (
  user_id, business_name, description, stats, features
) VALUES (
  'YOUR_EXISTING_USER_ID',
  'Cannabis Shop Amsterdam',
  'Test cannabis leverancier voor demo doeleinden',
  '{"customers": 100, "rating": 4.5}',
  '["Snelle levering", "Kwaliteit gegarandeerd"]'
);
```

## Testing Features

### Login Testing
1. **Regular user login:** `/login` - supports both email and username
2. **Admin login:** `/admin/login` - supports both email and username
3. **Supplier login:** `/supplier-login` - supports both email and username

### Test Credentials
- **Username:** `leverancier`
- **Email:** `leverancier@test.com` 
- **Password:** `12345678`

### Supplier Page Testing
Once logged in as supplier, test:
1. Visit `/supplier/leverancier` - public supplier page
2. Visit `/leverancier/leverancier` - alternative URL (same page)
3. Visit `/leverancier/dashboard` - supplier dashboard

## Features Implemented

✅ `/supplier/:username` route created
✅ Login forms accept both email and username  
✅ Cross-navigation between login pages
✅ Supplier-specific styling and texts
✅ Database structure for full supplier profiles
✅ Menu items and categories support

## Next Steps

After creating the test account, you can:
1. Test the public supplier page design
2. Add menu items via supplier dashboard
3. Test contact functionality
4. Verify all styling and features work correctly