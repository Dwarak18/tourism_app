# YatraGuide — Full Product, Architecture, and Implementation Walkthrough

This repository contains a **production-oriented blueprint** for building **YatraGuide**: a tourism + pilgrimage discovery platform that starts with **South India** and scales to all India.

---

## 1) Product Scope and Positioning

### Recommended launch scope (Phase 1)
- Geography: **Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana, Goa**.
- Themes:
  - Pilgrimage circuits (temples, churches, mosques, sacred trails).
  - Heritage circuits (UNESCO/ASI monuments, old towns, museum clusters).
  - Nature/weekend circuits (hill stations, beaches, waterfalls, eco zones).

### Positioning
Build as:
- **India trips + nearby explorer + booking helper**, not a full OTA on day one.

### Why this scope
- Easier POI curation and validation.
- Better route consistency due to dense transport connectivity.
- Faster launch, then horizontal scaling with same backend model.

---

## 2) User Personas and Core Jobs-to-be-Done

### Persona A — Foreign tourist
Needs: curated, safe, easy navigation + etiquette context.

### Persona B — Domestic pilgrim
Needs: darshan timings, ritual/dress rules, nearby stays, easy transport.

### Persona C — Weekend traveler / student
Needs: options by distance/time from city + rough budget planning.

### Primary product promise
> “Show meaningful places nearby, tell me how to reach them, and help me plan + book with confidence.”

---

## 3) System Modules (Functional Tree)

- Onboarding
- Home / Explore
- Place Detail
- Trip Planner
- Stays and Booking Links
- Food and Local Services
- Profile / Offline / Settings
- Admin / CMS
- Data Ingestion + Scoring Jobs

---

## 4) Recommended Tech Stack

## Mobile App
- **Flutter** (Android + iOS now, web later if required).
- State management: Riverpod (or Bloc if team preference).
- Networking: Dio.
- Local cache/offline: Hive + sqlite.

## Backend
- **FastAPI (Python)**.
- SQLAlchemy (async) + Alembic.
- Pydantic settings + response schemas.

## Data + Infra
- **PostgreSQL + PostGIS** for geo queries.
- Redis for response cache + queues.
- Celery for async ingestion jobs.
- Optional Elasticsearch (or `pg_trgm`) for search.

## Admin Panel
- React + Vite + Tailwind.

## Integrations
- Places + routes: Geoapify (MVP), optionally Google for higher quality coverage.
- OGD India datasets ingestion pipeline.
- OTA deep links initially, inventory APIs later.

---

## 5) End-to-End Folder Structure

```text
/yatraguide
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── pois.py
│   │   │       ├── trips.py
│   │   │       ├── stays.py
│   │   │       ├── users.py
│   │   │       └── admin.py
│   │   ├── services/
│   │   │   ├── poi_service.py
│   │   │   ├── planner_service.py
│   │   │   ├── places_client.py
│   │   │   ├── pricing_service.py
│   │   │   └── cache_service.py
│   │   ├── models/
│   │   │   ├── poi.py
│   │   │   ├── stay.py
│   │   │   ├── trip.py
│   │   │   ├── circuit.py
│   │   │   └── user.py
│   │   ├── schemas/
│   │   │   ├── poi.py
│   │   │   ├── trip.py
│   │   │   ├── stay.py
│   │   │   └── user.py
│   │   └── workers/
│   │       ├── celery_app.py
│   │       └── ingestion_tasks.py
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── mobile/
│   ├── lib/
│   │   ├── main.dart
│   │   ├── core/
│   │   │   ├── api_client.dart
│   │   │   ├── router.dart
│   │   │   ├── localization/
│   │   │   └── theme/
│   │   ├── features/
│   │   │   ├── onboarding/
│   │   │   ├── explore/
│   │   │   ├── poi_detail/
│   │   │   ├── trip_planner/
│   │   │   ├── stays/
│   │   │   ├── food_services/
│   │   │   └── profile/
│   │   └── shared/
│   │       ├── models/
│   │       ├── widgets/
│   │       └── constants/
│   └── pubspec.yaml
├── admin/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── POIManager.tsx
│   │   │   ├── CircuitEditor.tsx
│   │   │   ├── PartnersManager.tsx
│   │   │   └── UsersModeration.tsx
│   │   ├── components/
│   │   └── api/
│   └── package.json
├── infra/
│   ├── docker-compose.yml
│   ├── k8s/
│   └── nginx.conf
└── docs/
    ├── architecture.md
    ├── api-contracts.md
    ├── data-ingestion.md
    └── rollout-plan.md
```

---

## 6) Database Design (Postgres + PostGIS)

### Core entities
- `pois`: canonical curated points of interest.
- `stays`: curated accommodation entities + OTA links.
- `trips`: user generated itineraries.
- `circuits`: curated ready-to-use itineraries.
- `users`: profile + traveler preferences.
- `saved_pois`: bookmarks.

### Required DB features
- `postgis` extension for `ST_DWithin` and distance sorting.
- `pg_trgm` for typo tolerant fuzzy search.
- GIST indexes for all geometry columns.

### Key schema ideas
- Store coordinates as `GEOMETRY(POINT, 4326)`.
- Maintain both source IDs (OGD, Google, OSM) and internal UUID.
- Keep multilingual fields in JSONB: `name_local`, `description_local`.
- Use soft delete / `is_active` flags for operational safety.

---

## 7) API Surface (MVP)

## POIs
- `GET /v1/pois/nearby?lat=&lng=&radius_km=&category=&tags=&limit=`
- `GET /v1/pois/{poi_id}`
- `GET /v1/pois/search?q=&state=&category=`

## Trips
- `POST /v1/trips/plan` (suggest itinerary)
- `POST /v1/trips` (save)
- `GET /v1/trips/{trip_id}`
- `PATCH /v1/trips/{trip_id}`
- `DELETE /v1/trips/{trip_id}`

## Stays
- `GET /v1/stays?poi_id=&radius_km=&budget_band=`
- `GET /v1/stays/{stay_id}`

## User
- `GET /v1/users/me`
- `PATCH /v1/users/me`
- `POST /v1/users/saved-pois/{poi_id}`
- `DELETE /v1/users/saved-pois/{poi_id}`

## Admin
- `POST /v1/admin/pois/import/ogd`
- `POST /v1/admin/pois`
- `PATCH /v1/admin/pois/{id}`
- `POST /v1/admin/circuits`

---

## 8) Trip Planning Logic (MVP)

1. Collect selected POIs and trip days.
2. Cluster by spatial proximity (greedy nearest-neighbor or k-means).
3. Apply per-day cap by style:
   - slow: 2
   - moderate: 3
   - packed: 5
4. Reject jumps above threshold (e.g., >120km between sequential POIs unless forced).
5. Estimate cost range by distance + travel mode baseline.
6. Return editable itinerary for user refinement.

---

## 9) Data Ingestion Pipeline (OGD + Manual Curation)

1. Pull raw dataset files/API payloads.
2. Normalize fields to internal schema.
3. Geocode missing coordinates.
4. De-duplicate by fuzzy name + district + distance threshold.
5. Run quality checks (`state`, `category`, coordinate validity).
6. Send uncertain records to admin review queue.
7. Publish verified records to production POI table.

### Validation checks
- Coordinate range validity.
- Required fields: `name`, `state`, `category`, `location`.
- Duplicate checks: name similarity + <=500m proximity.

---

## 10) Booking Strategy and Monetization

### MVP monetization
- OTA affiliate/deep links from POI and stay cards.
- Sponsored promoted circuit cards.
- Lead generation for local guides/taxi partners.

### Later phase
- Integrate real-time inventory/pricing via travel APIs.
- Build direct booking mini-pages for local partners.
- Add commissionable add-ons (guided tours, transfers, pooja packages).

---

## 11) Security, Reliability, and Observability

- Auth: Firebase/OTP (mobile), JWT session on backend.
- Rate limiting for read-heavy endpoints.
- Request-level cache for nearby/search endpoints.
- Audit logs for admin data edits.
- Metrics: p95 latency, geo query timings, ingestion failures.
- Error tracking: Sentry.

---

## 12) Suggested Delivery Phases

### Phase 1 (4–6 weeks)
- POI schema + ingestion baseline.
- Nearby search endpoint + explore screen.
- POI detail + map deep links.

### Phase 2 (3–4 weeks)
- Trip planning API + editable itinerary UI.
- Save/share trip.

### Phase 3 (2–3 weeks)
- Authentication + favorites/profile.
- Offline trip bundle cache.

### Phase 4 (3–5 weeks)
- Admin panel and content operations flow.
- Stays listing + OTA links.

### Phase 5+
- Pricing intelligence, dynamic inventory integrations, and multilingual depth.

---

## 13) Build-vs-Buy Guidance for Maps API

### Geoapify first (MVP)
- Lower initial cost.
- Good enough for near-by discovery and category search.

### Google later (scale)
- Better photo/review richness and global tourist familiarity.
- Higher operating cost, but improved quality.

**Pragmatic strategy:** abstract provider in `places_client.py` and allow switching by config.

---

## 14) What to Build First in This Repository

1. Initialize backend FastAPI skeleton and migration setup.
2. Add PostGIS-enabled local docker-compose.
3. Create `pois` + geo index migration.
4. Implement `GET /pois/nearby` with tests.
5. Implement minimal Flutter explore screen that consumes nearby API.

---

## 15) Acceptance Criteria for MVP

- App shows nearby POIs from current location within selected radius.
- POI detail includes directions and “how to reach” hints.
- User can generate and save at least one multi-day itinerary.
- Admin can add/edit POIs and publish curated circuits.
- Stays page shows curated properties with working outbound booking links.

---

This document is intentionally implementation-ready so engineering can directly turn each section into tasks, epics, and sprint deliverables.
