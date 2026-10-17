import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'route_names.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: RouteNames.explore, // Update to '/' after landing built
    debugLogDiagnostics: true,
    routes: [
      // Landing route guarded for web
      GoRoute(
        path: RouteNames.landing,
        builder: (context, state) {
          if (kIsWeb) {
            return const Scaffold(body: Center(child: Text('Web Landing Page')));
          }
          return const Scaffold(body: Center(child: Text('Mobile Landing Redirect...')));
        },
      ),
      GoRoute(
        path: RouteNames.explore,
        builder: (context, state) => const Scaffold(body: Center(child: Text('Explore Nearby POIs'))),
        routes: [
          GoRoute(
            path: '${RouteNames.poiDetail}/:id',
            builder: (context, state) => Scaffold(
              appBar: AppBar(title: const Text('POI Details')),
              body: Center(child: Text('Detail for ${state.pathParameters['id']}')),
            ),
          ),
        ],
      ),
      GoRoute(
        path: RouteNames.map,
        builder: (context, state) => const Scaffold(body: Center(child: Text('Map View'))),
      ),
      GoRoute(
        path: RouteNames.tripPlanner,
        builder: (context, state) => const Scaffold(body: Center(child: Text('Trip Planner'))),
      ),
      GoRoute(
        path: RouteNames.profile,
        builder: (context, state) => const Scaffold(body: Center(child: Text('Profile & Settings'))),
      ),
    ],
    // Optional: Add redirect logic, e.g., if unauthenticated
    // redirect: (context, state) => null,
  );
});
