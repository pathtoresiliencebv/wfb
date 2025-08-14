# Testing Instructions for Supplier Login

## Test Leverancier Account Setup

To test the new supplier functionality, you need to create a test account:

### Option 1: Manual Account Creation (Recommended)

1. **Register a new account:**
   - Go to `/register`
   - Use email: `leverancier@test.com`
   - Use username: `leverancier`
   - Use password: `12345678`
   - Complete registration and email verification

2. **Promote to supplier role:**
   - Go to admin panel (`/admin/users`) as admin
   - Find the user "leverancier"
   - Change role from "user" to "supplier"
   - The supplier profile will be created automatically

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