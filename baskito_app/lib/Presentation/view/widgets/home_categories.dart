import 'package:baskito_app/Data/models/category%20model/category.dart';
import 'package:baskito_app/Data/models/pagination%20model/pagination.dart';
import 'package:baskito_app/Presentation/manager/category_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class HomeCategories extends ConsumerWidget {
  const HomeCategories({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      children: [
        const Padding(
            padding: EdgeInsetsDirectional.all(8.0),
            child: Text(
              'Our Categories',
              style: TextStyle(
                fontSize: 18.0,
                fontWeight: FontWeight.bold,
              ),
            )),
        Padding(
            padding: const EdgeInsetsDirectional.all(8.0),
            child: _categoryList(ref)),
      ],
    );
  }

  Widget _categoryList(WidgetRef ref) {
    final categories =
        ref.watch(categoriesProvider(Pagination(page: 1, pageSize: 10)));

    return categories.when(
      data: (list) => _buildCategoryList(list!),
      error: (_, __) => const Center(
        child: Text("ERROR"),
      ),
      loading: () => const Center(
        child: CircularProgressIndicator(),
      ),
    );
  }

  Widget _buildCategoryList(List<Category> categories) {
    return Container(
      height: 100.0,
      alignment: AlignmentDirectional.centerStart,
      child: ListView.builder(
        shrinkWrap: true,
        physics: const ClampingScrollPhysics(),
        scrollDirection: Axis.horizontal,
        itemCount: categories.length,
        itemBuilder: (context, index) {
          var data = categories[index];
          return GestureDetector(
            onTap: () {},
            child: Padding(
              padding: const EdgeInsetsDirectional.all(8.0),
              child: Column(
                children: [
                  Container(
                    margin: const EdgeInsetsDirectional.all(8.0),
                    width: 50,
                    height: 50,
                    alignment: AlignmentDirectional.center,
                    child: Image.network(
                      data.fullImagePath,
                      height: 50.0,
                    ),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        data.categoryName,
                        style: const TextStyle(
                          fontSize: 12.0,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Icon(
                        Icons.keyboard_arrow_right,
                        size: 13.0,
                      )
                    ],
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
