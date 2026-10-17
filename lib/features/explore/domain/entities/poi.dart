import 'package:freezed_annotation/freezed_annotation.dart';

part 'poi.freezed.dart';

@freezed
class Poi with _$Poi {
  const factory Poi({
    required String id,
    required String name,
    required String category,
    required double latitude,
    required double longitude,
    required double distanceMeters,
    String? address,
    String? coverPhoto,
    @Default([]) List<String> tags,
    double? ratingAvg,
    int? entryFeeInr,
    Map<String, dynamic>? openingHours,
  }) = _Poi;
}
