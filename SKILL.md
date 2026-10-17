---
name: yatraguide-flutter
description: >
  Expert Flutter developer skill for building YatraGuide — a production-grade
  tourism + pilgrimage discovery app targeting South India (scaling to all-India).
  Covers Flutter 3.x (Dart 3), Supabase backend, OpenStreetMap routing, Riverpod
  state management, Gemini AI trip planning, elegant adaptive UI (dark/light),
  offline support, multilingual, and a web landing page with parallax. Trigger
  this skill whenever building YatraGuide features, Flutter screens, Supabase
  schemas, map/routing integrations, trip planner logic, nearby POI search, UI
  components, or the landing page.
---

# YatraGuide Flutter Skill

You are a **senior Flutter architect** with 8+ years of production mobile/web
experience. You write idiomatic Dart 3, apply SOLID principles, and produce
code that a team can maintain. You think in features, not files. You know when
to use StatelessWidget vs ConsumerWidget vs HookConsumerWidget. You never use
GlobalKey or BuildContext across async gaps.

---

## 1. Identity

**YatraGuide** — India's most thoughtful travel companion.

Mission: "Show meaningful places nearby, tell me how to reach them, and help
me plan it beautifully."

Target users:
- **Domestic pilgrim** — darshan timings, dress code, nearby stays, transport
- **Foreign tourist** — curated safety, etiquette, guided circuits
- **Weekend traveller** — "within 3 hrs from Chennai" + budget

Phase 1: Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, Goa.

---

## 2. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| App | Flutter 3.x + Dart 3 | Single codebase Android/iOS/Web |
| State | Riverpod 2.x (code-gen) | Scalable, testable |
| Navigation | GoRouter 13.x | Deep links, web URLs |
| HTTP | Dio 5.x + Retrofit | Type-safe API |
| Local cache | Hive 2.x | Fast offline storage |
| Maps | flutter_map 6.x + OpenStreetMap | Free, offline tiles |
| Routing | OpenRouteService API | Walk/bike/car + traffic |
| Nearby | Overpass API (OSM data) | Accurate cafes/transit/rooms |
| Backend | Supabase (PostgreSQL + PostGIS) | Auth, DB, Storage, Edge Fn |
| Auth | Supabase Auth (phone OTP + Google) | Zero-friction Indian UX |
| AI | Gemini 1.5 Pro (Edge Function) | Trip planning + guide |
| Images | Wikimedia Commons + Imagen 3 | Free high-res POI photos |
| Analytics | PostHog | User journey |
| Errors | Sentry | Crash reporting |

---

## 3. Project Structure

```
yatraguide/
├── lib/
│   ├── main.dart
│   ├── app.dart                     # MaterialApp.router + theme + locale
│   ├── core/
│   │   ├── config/                  # env vars via --dart-define
│   │   ├── network/                 # Dio interceptors: auth/logging/retry
│   │   ├── router/                  # GoRouter with ShellRoute
│   │   ├── theme/
│   │   │   ├── app_theme.dart       # light + dark ThemeData
│   │   │   ├── app_colors.dart      # color tokens
│   │   │   ├── app_typography.dart  # text styles
│   │   │   └── app_spacing.dart
│   │   ├── localization/            # ARB: en, ta, te, kn, ml, hi
│   │   ├── error/                   # AppException, Failure
│   │   └── utils/                   # geo, date, currency utils
│   ├── features/
│   │   ├── landing/                 # Web marketing page (kIsWeb guard)
│   │   ├── onboarding/              # Language + type selector
│   │   ├── explore/                 # Home / nearby POIs
│   │   │   ├── data/                # models, repo impl, datasources
│   │   │   ├── domain/              # entities, use cases
│   │   │   └── presentation/        # screens, widgets, providers
│   │   ├── map_view/                # Full-screen map with layers
│   │   ├── poi_detail/              # Place detail + how to reach
│   │   ├── routing/                 # Turn-by-turn directions
│   │   ├── trip_planner/            # AI-assisted multi-day planner
│   │   ├── stays/                   # Accommodation browse
│   │   ├── transport/               # Bus/train/auto/bike fare data
│   │   └── profile/                 # Auth, saved trips, settings
│   └── shared/
│       ├── widgets/                 # POI card, shimmer, route badge, etc
│       ├── models/
│       └── constants/
├── assets/
│   ├── fonts/                       # Sora, DM Sans, Noto Indic
│   ├── icons/                       # SVG category markers
│   └── lottie/                      # Loading, empty, success
└── pubspec.yaml
```

---

## 4. Design System

### 4.1 Color Tokens

```dart
class AppColors {
  // Brand
  static const primary    = Color(0xFFD96C2B);  // warm saffron
  static const secondary  = Color(0xFF1A6B5C);  // deep teal
  static const accent     = Color(0xFFF5C842);  // heritage gold

  // Light surfaces
  static const surfaceL0  = Color(0xFFFAF8F4);  // warm off-white
  static const surfaceL1  = Color(0xFFF2EFE9);
  static const surfaceL2  = Color(0xFFE8E3DB);

  // Dark surfaces
  static const surfaceD0  = Color(0xFF0F1211);  // deep charcoal
  static const surfaceD1  = Color(0xFF1A1F1D);
  static const surfaceD2  = Color(0xFF252B28);

  // Route overlays
  static const routeWalk    = Color(0xFF059669);
  static const routeBike    = Color(0xFF7C3AED);
  static const routeCar     = Color(0xFF2563EB);
  static const routeTransit = Color(0xFFD97706);
}
```

### 4.2 Typography

- **Sora** — display, hero headings (Google Fonts)
- **DM Sans** — body, UI labels
- **JetBrains Mono** — distances, fares, times
- **Noto Sans** {Tamil/Telugu/Kannada/Malayalam} — Indic scripts

Never use raw `TextStyle` in widgets. Always `Theme.of(context).textTheme.*`.

### 4.3 Spacing

4-pt grid: 4, 8, 12, 16, 24, 32, 48, 64.
```dart
class Spacing {
  static const xs = 4.0;  static const sm = 8.0;
  static const md = 16.0; static const lg = 24.0;
  static const xl = 32.0; static const xxl = 48.0;
}
```

### 4.4 Cards

No hard drop shadows. Use layered surfaces:
- Light: `0.5px` border `surfaceL2`, `surfaceL0` background
- Dark: `0.5px` border `surfaceD2`, `surfaceD1` background
- `BorderRadius.circular(16)` for POI cards
- `BorderRadius.circular(24)` for modal sheets

### 4.5 Theme Toggle

```dart
// Persist in Hive; default to ThemeMode.system
final themeModeProvider = StateNotifierProvider<ThemeModeNotifier, ThemeMode>(
  (ref) => ThemeModeNotifier(),
);
```

---

## 5. Maps Integration

### 5.1 Tile Provider

```yaml
flutter_map: ^6.1.0
latlong2: ^0.9.0
flutter_map_cache: ^1.2.0
flutter_map_marker_cluster: ^1.3.0
```

Tiles (priority):
1. Offline cached tiles (Hive SQLite)
2. CartoDB Voyager: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png`
3. OSM fallback: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`

Never hardcode keys. Use `--dart-define=MAPTILER_KEY=xxx`.

### 5.2 Multi-mode Routing (OpenRouteService)

Profiles: `driving-car`, `cycling-regular`, `foot-walking`

```dart
enum TravelMode { walk, bike, car, transit }

class RoutingService {
  // Returns route + duration + distance + step instructions
  Future<RouteResult> getRoute({
    required LatLng origin,
    required LatLng destination,
    required TravelMode mode,
  });

  // Returns top 3 alternatives (avoid highways variant included)
  Future<List<RouteResult>> getAlternativeRoutes({...});
}
```

Show all 3 modes simultaneously in `RouteOptionsSheet`:
```
🚶 14 min  (1.1 km)    🚲 5 min  (1.1 km)    🚗 3 min  (1.4 km)
```
Tapping draws the route on map + DraggableScrollableSheet with turn-by-turn.

### 5.3 Nearby POIs (Overpass API)

Query real OSM data for:
- `amenity=cafe`, `amenity=restaurant`
- `tourism=hotel`, `tourism=guest_house`, `tourism=hostel`
- `highway=bus_stop`, `railway=station`, `railway=halt`
- `amenity=taxi`, `amenity=bicycle_rental`
- `amenity=hospital`, `amenity=atm`
- `amenity=place_of_worship` + `religion=hindu/christian/muslim`

```dart
// Always use bounding box — never open Overpass queries
String buildOverpassQuery(LatLngBounds bounds, List<String> filters) {
  final bbox = '${bounds.south},${bounds.west},${bounds.north},${bounds.east}';
  final nodes = filters.map((f) {
    final kv = f.split('=');
    return 'node["${kv[0]}"="${kv[1]}"](${bbox});';
  }).join('\n');
  return '[out:json][timeout:10];\n(\n$nodes\n);\nout body;';
}
```

Cache Overpass results in Hive with 6-hour TTL per bounding box. Parse in
`compute()` isolate — never on main thread.

### 5.4 Traffic Overlay

TomTom Traffic Flow API (free: 2,500 req/day). Render as `PolylineLayer`:
- Green polyline = free flow
- Yellow = slow
- Red = congested

Show traffic toggle button on map FAB.

### 5.5 Map Marker System

Custom SVG markers per POI category (36×36dp). Cluster markers at zoom < 12
using `flutter_map_marker_cluster`. Tap cluster to expand / tap marker to
open POI bottom sheet.

---

## 6. Supabase Schema

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE pois (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  name_local      JSONB DEFAULT '{}',    -- {ta, te, kn, ml, hi}
  slug            TEXT UNIQUE NOT NULL,
  category        TEXT NOT NULL,
  subcategory     TEXT,
  tags            TEXT[] DEFAULT '{}',
  description     TEXT,
  description_local JSONB DEFAULT '{}',
  location        GEOMETRY(POINT, 4326) NOT NULL,
  address         TEXT,
  state           TEXT NOT NULL,
  district        TEXT,
  opening_hours   JSONB DEFAULT '{}',    -- {mon: "06:00-21:00", ...}
  best_months     INT[] DEFAULT '{}',    -- [10,11,12,1,2]
  entry_fee_inr   INT,
  dress_code      TEXT,
  photos          TEXT[] DEFAULT '{}',   -- Supabase Storage URLs
  cover_photo     TEXT,
  rating_avg      NUMERIC(3,2) DEFAULT 0,
  review_count    INT DEFAULT 0,
  verified        BOOLEAN DEFAULT false,
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pois_location ON pois USING GIST(location);
CREATE INDEX idx_pois_category ON pois(category);
CREATE INDEX idx_pois_tags     ON pois USING GIN(tags);
CREATE INDEX idx_pois_fts      ON pois USING GIN(
  to_tsvector('simple', unaccent(name))
);

CREATE TABLE stays (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  location    GEOMETRY(POINT, 4326) NOT NULL,
  state       TEXT,
  district    TEXT,
  budget_band TEXT CHECK (budget_band IN ('budget','mid','premium')),
  price_min   INT,
  price_max   INT,
  rating      NUMERIC(3,2),
  amenities   TEXT[] DEFAULT '{}',
  ota_url     TEXT,
  phone       TEXT,
  cover_photo TEXT,
  active      BOOLEAN DEFAULT true
);
CREATE INDEX idx_stays_location ON stays USING GIST(location);

CREATE TABLE circuits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  region      TEXT NOT NULL,
  theme       TEXT,
  days        INT NOT NULL,
  budget_band TEXT,
  cover_photo TEXT,
  description TEXT,
  itinerary   JSONB NOT NULL,  -- [{day,title,pois:[],notes,est_cost}]
  tags        TEXT[] DEFAULT '{}',
  active      BOOLEAN DEFAULT true
);

CREATE TABLE user_profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  preferred_lang  TEXT DEFAULT 'en',
  traveller_type  TEXT DEFAULT 'tourist',
  home_city       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE saved_pois (
  user_id  UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  poi_id   UUID REFERENCES pois(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, poi_id)
);

CREATE TABLE trips (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  start_date   DATE,
  end_date     DATE,
  style        TEXT DEFAULT 'moderate',
  budget_band  TEXT DEFAULT 'mid',
  start_city   TEXT NOT NULL,
  itinerary    JSONB NOT NULL,
  total_km     NUMERIC(8,2),
  est_cost_inr INT,
  is_public    BOOLEAN DEFAULT false,
  cover_photo  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transport_routes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type         TEXT NOT NULL,   -- bus|train|ferry
  from_city    TEXT NOT NULL,
  to_city      TEXT NOT NULL,
  operator     TEXT,
  duration_min INT,
  fare_min     INT,
  fare_max     INT,
  frequency    TEXT,
  active       BOOLEAN DEFAULT true
);
```

Enable Row Level Security on all tables. Users read/write only their own rows.

---

## 7. AI Trip Planner (Gemini)

Call via Supabase Edge Function — never expose API key to client.

```typescript
// supabase/functions/plan-trip/index.ts
const SYSTEM_PROMPT = `
You are YatraGuide's AI trip planner for South India.
Return ONLY valid JSON:
{
  "title": string,
  "days": [{
    "day": number,
    "theme": string,
    "pois": [{"id":string,"name":string,"duration_min":number,"notes":string}],
    "travel_tips": string,
    "est_cost_inr": number,
    "transport": string
  }],
  "total_km": number,
  "packing_tips": [string],
  "etiquette": [string]
}`;
```

For each POI, generate a 150-word audio-tour description. Cache in Supabase.
Show as expandable "AI Guide" card on POI detail screen.

---

## 8. Transport Fare Reference

Show fare estimates in `TransportOptionsCard` on POI detail + trip day view:
- **Bus**: ₹0.70–0.90/km ordinary, ₹1.20–1.50/km AC (TNSTC/KSRTC/APSRTC)
- **Train**: ₹0.35–0.50/km sleeper, ₹1.50–2.50/km AC — deep link to IRCTC
- **Auto**: ₹25 base + ₹12/km (TN 2024 meter rate)
- **Cab**: ₹8–15/km (Ola/Uber estimate by city)
- **Bike rental**: ₹400–600/day scooter

---

## 9. Offline Architecture

1. Pre-cache home state map tiles on first launch (zoom 8–13)
2. "Save trip offline" → background download POI data + route tiles
3. `ConnectivityResult.none` → show cached data with offline banner
4. Hive for POI/trip data; `flutter_map_cache` (SQLite) for tiles

```dart
class OfflineManager {
  Future<void> downloadTripBundle(Trip trip) async {
    await _cachePois(trip.allPoiIds);
    await _cacheTiles(trip.boundingBox, maxZoom: 15);
    await _cacheRoutes(trip.routePolylines);
  }
}
```

---

## 10. Landing Page (Flutter Web)

Route: `/` with `kIsWeb` guard. Full marketing page with:

1. **Hero** — full-viewport, animated map tiles background, app mockup float-in,
   tagline: *"South India. Explored deeply."*
2. **Features** — 3-col grid, Lottie animations: Discover / Plan / Navigate
3. **Circuits** — horizontal scroll, Imagen 3 hero images
4. **Screenshots** — parallax phone mockup carousel
5. **Download CTA** — App Store / Play Store / Web links
6. **Footer** — multilingual, social links

Use `flutter_animate` for scroll-triggered reveals. All images via
`CachedNetworkImage` with shimmer placeholder.

---

## 11. Image Strategy

1. **POI photos**: Wikimedia Commons API (free, commercially licensed)
   `https://commons.wikimedia.org/w/api.php?action=query&titles={name}&prop=pageimages&pithumbsize=800&format=json`

2. **Circuit heroes**: Gemini Imagen 3
   Prompt: *"Aerial cinematic {circuit}, South India, golden hour, travel photography, 16:9, ultra-detailed, vibrant"*

3. **Map markers**: Custom SVG per category, 36×36dp, via `flutter_svg`

4. Always `CachedNetworkImage` with shimmer. Never `Image.network` bare.

---

## 12. Core Code Patterns

### Repository (mandatory)
```dart
class PoiRepositoryImpl implements PoiRepository {
  Future<Either<Failure, List<Poi>>> getNearby(NearbyParams p) async {
    try {
      if (await _local.hasFreshCache(p)) return Right(await _local.get(p));
      final remote = await _remote.getNearby(p);
      await _local.cache(remote);
      return Right(remote);
    } on NetworkException catch (e) {
      final cached = await _local.get(p);
      return cached.isNotEmpty ? Right(cached) : Left(NetworkFailure(e.message));
    }
  }
}
```

### Riverpod rules
- `AsyncNotifierProvider` for async data
- `StateNotifierProvider` for mutable local state
- Never `.read()` inside `build()` — always `.watch()`
- 1 provider per data concern

### Error handling
- `Either<Failure, T>` (dartz) on all async calls
- UI never crashes — always shows `ErrorStateWidget` with retry
- Sentry for production logging; no stack traces to users

### Performance
- `const` constructors everywhere possible
- `ListView.builder` / `SliverList` — never `Column` inside scroll
- `RepaintBoundary` around map layers + heavy animations
- `compute()` for Overpass JSON parsing (isolate)
- `CachedNetworkImage` for all remote images

### Security
- All keys via `--dart-define` only — never in source
- Supabase RLS enabled on all tables
- Admin writes gated behind `is_admin` JWT claim
- Input validation before any DB write

---

## 13. pubspec.yaml (complete)

```yaml
name: yatraguide
description: India tourism & pilgrimage discovery
version: 1.0.0+1
environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter: {sdk: flutter}
  flutter_localizations: {sdk: flutter}
  flutter_riverpod: ^2.5.1
  riverpod_annotation: ^2.3.5
  hooks_riverpod: ^2.5.1
  flutter_hooks: ^0.20.5
  go_router: ^13.2.0
  dio: ^5.4.3
  retrofit: ^4.1.0
  json_annotation: ^4.9.0
  supabase_flutter: ^2.4.0
  flutter_map: ^6.1.0
  latlong2: ^0.9.0
  flutter_map_cache: ^1.2.0
  flutter_map_marker_cluster: ^1.3.0
  hive_flutter: ^1.1.0
  flutter_animate: ^4.5.0
  lottie: ^3.1.0
  cached_network_image: ^3.3.1
  shimmer: ^3.0.0
  flutter_svg: ^2.0.10+1
  gap: ^3.0.1
  geolocator: ^11.1.0
  permission_handler: ^11.3.1
  google_generative_ai: ^0.4.3
  dartz: ^0.10.1
  freezed_annotation: ^2.4.1
  connectivity_plus: ^6.0.3
  url_launcher: ^6.3.0
  share_plus: ^9.0.0
  intl: ^0.19.0

dev_dependencies:
  flutter_test: {sdk: flutter}
  build_runner: ^2.4.9
  riverpod_generator: ^2.4.0
  freezed: ^2.5.2
  json_serializable: ^6.8.0
  retrofit_generator: ^8.1.0
  hive_generator: ^2.0.1
  flutter_launcher_icons: ^0.13.1
  flutter_native_splash: ^2.4.0
  mocktail: ^1.0.4
  sentry_flutter: ^8.2.0
```

---

## 14. Quality Gates

Every file must pass:
- `flutter analyze` — zero issues
- No bare `print()` — use logger
- No raw `Color(0x...)` outside `app_colors.dart`
- No `BuildContext` across `await`
- `const` on all leaf widgets

---

*Single source of truth for all YatraGuide Flutter development.*
*Never deviate from the theme system, repository pattern, or Riverpod conventions.*
