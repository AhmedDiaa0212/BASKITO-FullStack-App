import 'package:baskito_app/Data/Services/api_services.dart';
import 'package:baskito_app/Data/models/category%20model/category.dart';
import 'package:baskito_app/Data/models/pagination%20model/pagination.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final categoriesProvider = FutureProvider.family<List<Category>?, Pagination>(
  (ref, pagination) {
    final apiRepository = ref.watch(apiService);
    return apiRepository.getCategories(pagination.page, pagination.pageSize);
  },
);
