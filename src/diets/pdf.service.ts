import * as PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { DietPlan, MealChoice } from './diets.service';

@Injectable()
export class PdfService {
  async createPdf(diet: DietPlan) {
    const doc = new PDFDocument();
    doc.pipe(createWriteStream(`diets/diet-${Date.now()}.pdf`));
    doc.fontSize(25).text('Meals:');

    this.printMealTypeText(doc, 'Breakfastes', diet.meals.breakfastes);
    this.printMealTypeText(doc, 'Eleveneses', diet.meals.elevenses);
    this.printMealTypeText(doc, 'Lunches', diet.meals.lunches);
    this.printMealTypeText(doc, 'Dinners', diet.meals.dinners);

    doc.moveDown();
    doc.fontSize(20).text('Shopping list:');
    doc.moveDown();
    diet.shoppingList.forEach((ingredient) =>
      doc.fontSize(15).text(ingredient),
    );
    doc.end();
  }

  private printMealTypeText(
    doc: PDFKit.PDFDocument,
    mealType: string,
    meals: MealChoice[],
  ) {
    doc.moveDown();
    doc.fontSize(20).text(`${mealType}:`);
    meals.forEach((meal) => {
      doc.moveDown();
      doc
        .fontSize(15)
        .text(
          `Name: ${meal.name}\nOwner: ${meal.owner}\nFile: ${
            meal.file
          }\nTimes: ${meal.times}\nIngredients: ${meal.ingredients.map(
            (ingredient) => `\n${ingredient}`,
          )}`,
        );
    });
  }
}
