import 'dart:convert';
import 'package:baskito_app/Data/models/category.dart';
import 'package:baskito_app/core/config.dart';
import 'package:http/http.dart' as http;

class ApiServices {
  static var client = http.Client();

  Future<List<Category>?> getCategories(page, pageSize) async {
    Map<String, String> requestHeader = {'Content-Type': 'application/json'};

    Map<String, String> queryString = {
      'page': page.toString(),
      'pageSize': pageSize.toString(),
    };
    var url = Uri.http(Config.apiUrl, Config.categoryApi, queryString);

    var response = await client.get(url, headers: requestHeader);

    if (response.statusCode == 200) {
      var data = jsonDecode(response.body);
    }
  }
}
