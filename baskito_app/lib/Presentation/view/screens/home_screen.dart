import 'package:baskito_app/Presentation/view/widgets/home_categories.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            const Padding(
              padding: EdgeInsetsDirectional.all(8.0),
              child: Text(
                'Welcome to Baskito',
                style: TextStyle(
                  fontSize: 18.0,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsetsDirectional.all(8.0),
              child: Text(
                'Your one stop shop for all your grocery needs',
                style: TextStyle(
                  fontSize: 14.0,
                  fontWeight: FontWeight.normal,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsetsDirectional.all(8.0),
              child: SizedBox(
                height: 300.0,
                child: ListView(
                  children: const [HomeCategories()],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
