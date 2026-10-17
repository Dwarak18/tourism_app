import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';

class AppTheme {
  static ThemeData light() => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: const ColorScheme.light(
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      surface: AppColors.lightSurface,
      error: AppColors.error,
    ).copyWith(background: AppColors.lightBg),
    textTheme: AppTypography.buildTextTheme(isDark: false),
    scaffoldBackgroundColor: AppColors.lightBg,
    cardTheme: const CardTheme(
      elevation: 0,
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
        side: BorderSide(color: AppColors.lightBorder, width: 0.5),
      ),
      color: AppColors.lightSurface,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.lightBg,
      centerTitle: true,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: AppColors.lightSurface,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.textLow,
      elevation: 0,
    ),
  );

  static ThemeData dark() => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: const ColorScheme.dark(
      primary: AppColors.primary,
      secondary: AppColors.secondary,
      surface: AppColors.darkSurface,
      error: AppColors.error,
    ).copyWith(background: AppColors.darkBg),
    textTheme: AppTypography.buildTextTheme(isDark: true),
    scaffoldBackgroundColor: AppColors.darkBg,
    cardTheme: const CardTheme(
      elevation: 0,
      margin: EdgeInsets.zero,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.all(Radius.circular(16)),
        side: BorderSide(color: AppColors.darkBorder, width: 0.5),
      ),
      color: AppColors.darkSurface,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.darkBg,
      centerTitle: true,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: AppColors.darkSurface,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.textDarkLow,
      elevation: 0,
    ),
  );
}
