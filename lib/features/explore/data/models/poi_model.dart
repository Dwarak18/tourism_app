import 'package:freezed_annotation/freezed_annotation.dart';

import '../../domain/entities/poi.dart';

part 'poi_model.freezed.dart';
part 'poi_model.g.dart';

@freezed
class PoiModel with _$PoiModel {
  const PoiModel._();

  const factory PoiModel({
    required String id,
    required String name,
    required String category,
    required double latitude,
    required double longitude,
    @JsonKey(name: 'distance_m') required double distanceMeters,
    String? address,
    @JsonKey(name: 'cover_photo') String? coverPhoto,
    @Default([]) List<String> tags,
    @JsonKey(name: 'rating_avg') double? ratingAvg,
    @JsonKey(name: 'entry_fee_inr') int? entryFeeInr,
    @JsonKey(name: 'opening_hours') Map<String, dynamic>? openingHours,
  }) = _PoiModel;

  factory PoiModel.fromJson(Map<String, dynamic> json) => _$PoiModelFromJson(json);

  Poi toEntity() {
    return Poi(
      id: id,
      name: name,
      category: category,
      latitude: latitude,
      longitude: longitude,
      distanceMeters: distanceMeters,
      address: address,
      coverPhoto: coverPhoto,
      tags: tags,
      ratingAvg: ratingAvg,
      entryFeeInr: entryFeeInr,
      openingHours: openingHours,
    );
  }
}
