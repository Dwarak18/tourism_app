import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  static TextTheme buildTextTheme({required bool isDark}) {
    final color = isDark ? AppColors.textDarkHigh : AppColors.textHigh;
    final colorMed = isDark ? AppColors.textDarkMed : AppColors.textMed;
    final colorLow = isDark ? AppColors.textDarkLow : AppColors.textLow;
    
    return TextTheme(
      displayLarge:  GoogleFonts.sora(fontSize: 48, fontWeight: FontWeight.w700, color: color),
      displayMedium: GoogleFonts.sora(fontSize: 40, fontWeight: FontWeight.w700, color: color),
      displaySmall:  GoogleFonts.sora(fontSize: 32, fontWeight: FontWeight.w700, color: color),
      headlineLarge: GoogleFonts.sora(fontSize: 28, fontWeight: FontWeight.w600, color: color),
      headlineMedium:GoogleFonts.sora(fontSize: 24, fontWeight: FontWeight.w600, color: color),
      headlineSmall: GoogleFonts.sora(fontSize: 20, fontWeight: FontWeight.w600, color: color),
      titleLarge:    GoogleFonts.sora(fontSize: 18, fontWeight: FontWeight.w600, color: color),
      titleMedium:   GoogleFonts.sora(fontSize: 16, fontWeight: FontWeight.w600, color: color),
      titleSmall:    GoogleFonts.sora(fontSize: 14, fontWeight: FontWeight.w600, color: colorMed),
      bodyLarge:     GoogleFonts.dmSans(fontSize: 16, fontWeight: FontWeight.w400, color: color),
      bodyMedium:    GoogleFonts.dmSans(fontSize: 14, fontWeight: FontWeight.w400, color: color),
      bodySmall:     GoogleFonts.dmSans(fontSize: 12, fontWeight: FontWeight.w400, color: colorMed),
      labelLarge:    GoogleFonts.jetBrainsMono(fontSize: 14, fontWeight: FontWeight.w500, color: colorMed),
      labelMedium:   GoogleFonts.jetBrainsMono(fontSize: 12, fontWeight: FontWeight.w500, color: colorMed),
      labelSmall:    GoogleFonts.jetBrainsMono(fontSize: 11, fontWeight: FontWeight.w500, color: colorMed),
    );
  }
}
