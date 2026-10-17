import 'package:flutter/material.dart';

abstract class AppColors {
  // Brand identity
  static const Color primary    = Color(0xFFD96C2B); // warm saffron
  static const Color secondary  = Color(0xFF1A6B5C); // deep teal
  static const Color accent     = Color(0xFFF5C842); // heritage gold

  // Light mode surfaces
  static const Color lightBg        = Color(0xFFFAF8F4); // warm off-white
  static const Color lightSurface   = Color(0xFFF2EFE9);
  static const Color lightSurface2  = Color(0xFFE8E3DB);
  static const Color lightBorder    = Color(0xFFD4CFC7);

  // Dark mode surfaces
  static const Color darkBg        = Color(0xFF0F1211);
  static const Color darkSurface   = Color(0xFF1A1F1D);
  static const Color darkSurface2  = Color(0xFF252B28);
  static const Color darkBorder    = Color(0xFF353B38);

  // Text
  static const Color textHigh      = Color(0xFF1C1917);
  static const Color textMed       = Color(0xFF57534E);
  static const Color textLow       = Color(0xFFA8A29E);
  static const Color textDarkHigh  = Color(0xFFF5F0EC);
  static const Color textDarkMed   = Color(0xFFB3ADA6);
  static const Color textDarkLow   = Color(0xFF6E6862);

  // Route mode colors
  static const Color routeWalk     = Color(0xFF059669); // emerald
  static const Color routeBike     = Color(0xFF7C3AED); // violet
  static const Color routeCar      = Color(0xFF2563EB); // blue
  static const Color routeTransit  = Color(0xFFD97706); // amber

  // Semantic
  static const Color success = Color(0xFF16A34A);
  static const Color warning = Color(0xFFD97706);
  static const Color error   = Color(0xFFDC2626);
  static const Color info    = Color(0xFF2563EB);
}
