# GoGym — React Native App

## Setup (Do this once)

### 1. Install Node.js
Download from https://nodejs.org (choose LTS version)

### 2. Install Expo CLI
```bash
npm install -g expo-cli eas-cli
```

### 3. Install project dependencies
```bash
cd GoGym
npm install
```

### 4. Start the app
```bash
npx expo start
```

Then scan the QR code with the **Expo Go** app on your Android phone!

---

## Project Structure

```
GoGym/
├── App.js                        # Entry point
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js       # Tab + Stack navigation
│   ├── screens/
│   │   ├── HomeScreen.js         # Trainer listings
│   │   ├── BookingsScreen.js     # My bookings
│   │   ├── AiCoachScreen.js      # Claude AI chat
│   │   ├── ProfileScreen.js      # User profile
│   │   ├── TrainerDetailScreen.js# Trainer profile + book
│   │   └── PaymentScreen.js      # DuitNow / FPX / Card
│   ├── components/               # Reusable UI components
│   └── theme/
│       └── colors.js             # Dark/gold color system
```

---

## Screens to build next

1. **BookingsScreen.js** — list of upcoming & past sessions
2. **TrainerDetailScreen.js** — trainer profile, ratings, slots
3. **PaymentScreen.js** — DuitNow, FPX, card payment

## Backend (Supabase)

```bash
npm install @supabase/supabase-js
```

Create a free account at https://supabase.com
Tables needed:
- users (id, name, email, role: client/trainer)
- trainers (id, user_id, specialties, location, rate)
- bookings (id, client_id, trainer_id, date, status)
- reviews (id, booking_id, rating, text)

## Payments (Billplz)

Malaysia-based payment gateway supporting FPX & DuitNow.
Sign up at https://www.billplz.com

## Build for Play Store

```bash
eas build --platform android
eas submit --platform android
```

---

Built with ❤️ by GoGym
