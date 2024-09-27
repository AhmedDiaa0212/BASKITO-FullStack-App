import 'dart:convert';
import 'package:baskito_app/Data/models/category%20model/category.dart';
import 'package:baskito_app/core/config.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;

final apiService = Provider((ref) => ApiServices());

class ApiServices {
  static var client = http.Client();

  Future<List<Category>> getCategories(int page, int pageSize) async {
    Map<String, String> requestHeader = {'Content-Type': 'application/json'};

    Map<String, String> queryString = {
      'page': page.toString(),
      'pageSize': pageSize.toString(),
    };
    var url = Uri.http(Config.apiUrl, Config.categoryApi, queryString);

    try {
      var response = await client.get(url, headers: requestHeader);

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        debugPrint('Categories fetched successfully: $data');
        return categoriesFromJson(data["data"]);
      } else {
        throw Exception('Failed to load categories: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error fetching categories: $e');
      throw Exception('Failed to load categories: $e');
    }
  }
}
