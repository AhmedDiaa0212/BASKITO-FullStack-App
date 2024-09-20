import 'package:freezed_annotation/freezed_annotation.dart';

part 'pagination.freezed.dart';

@freezed
abstract class Pagination with _$Pagination {
  factory Pagination({
    required int page,
    required int pageSize,
  }) = _Pagination;
}
