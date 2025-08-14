# Test Instructies - WietForum België

## Test Accounts

### Admin Account
- **Username:** admin
- **Email:** admin@wietforum.com  
- **Password:** admin123
- **Role:** Admin
- **Access:** Via `/admin/login` of `/login`

### Leverancier Account
- **Username:** leverancier
- **Email:** leverancier@test.com
- **Password:** 12345678
- **Role:** Supplier
- **Access:** Via `/supplier-login` of `/login`

## Login Opties

### 1. Reguliere Login (`/login`)
- Werkt met zowel **username** als **email**
- Ondersteunt alle user rollen (user, supplier, admin, moderator)
- Automatische redirect op basis van rol:
  - Suppliers → `/leverancier/dashboard`
  - Andere rollen → homepage

### 2. Admin Login (`/admin/login`)
- Speciaal voor admin toegang
- Vereist admin of moderator rol

### 3. Supplier Login (`/supplier-login`)
- Speciaal voor leveranciers
- Vereist supplier rol

## Navigatie Features

- **Header:** Toont altijd login/register buttons voor niet-ingelogde gebruikers
- **React Router:** Alle navigatie gebruikt Link componenten (geen page refreshes)
- **Responsive:** Werkt op desktop en mobiel

## Test Scenarios

### Basic Login Test
1. Ga naar `/login`
2. Probeer inloggen met `admin` en `admin123`
3. Controleer dat je doorgestuurd wordt naar homepage met admin privileges

### Supplier Login Test  
1. Ga naar `/login` of `/supplier-login`
2. Probeer inloggen met `leverancier` en `12345678`
3. Controleer dat je doorgestuurd wordt naar `/leverancier/dashboard`

### Username vs Email Login
- Test `admin` (username) vs `admin@wietforum.com` (email)
- Test `leverancier` (username) vs `leverancier@test.com` (email)
- Beide moeten werken

### Navigation Test
1. Zorg dat je niet ingelogd bent
2. Controleer dat header login/register buttons toont
3. Klik op links en controleer dat pagina niet refresh
4. Log in en controleer user dropdown menu

## Known Issues Fixed

✅ Header toont nu altijd login/register buttons voor niet-ingelogde gebruikers  
✅ Layout toont altijd header (geen hidden header op homepage)  
✅ AuthContext ondersteunt username lookup voor login  
✅ Test accounts zijn aangemaakt in database  
✅ Alle navigatie gebruikt React Router Link componenten  
✅ Admin en supplier accounts hebben juiste rollen