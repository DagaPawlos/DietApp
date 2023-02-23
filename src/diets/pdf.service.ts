import * as PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { DietPlan, MealChoice } from './diets.service';

@Injectable()
export class PdfService {
  async createPdf(diet: DietPlan) {
    const doc = new PDFDocument();
    const path = `diets/diet-${Date.now()}.pdf`;
    doc.pipe(createWriteStream(path));
    doc.fontSize(25).text('Meals:');

    Object.entries(diet.meals).forEach(([mealType, meals]) =>
      this.printMealTypeText(doc, this.capitalizeFirstLetter(mealType), meals),
    );

    doc.moveDown();
    doc.fontSize(20).text('Shopping list:');
    doc.moveDown();
    diet.shoppingList.forEach((ingredient) =>
      doc.fontSize(15).text(ingredient),
    );
    doc.end();

    return path;
  }

  private capitalizeFirstLetter(mealType: string): string {
    return mealType.charAt(0).toUpperCase() + mealType.slice(1);
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
      doc.fontSize(15).text(`Name: ${meal.name}`);
      doc.moveDown();
      doc.image(meal.imagePath, {
        fit: [250, 300],
        align: 'center',
      });
      doc.moveDown();
      doc
        .fontSize(15)
        .text(
          `\nOwner: ${meal.owner}\nFile: ${meal.file}\nTimes: ${
            meal.times
          }\nIngredients: ${meal.ingredients.map(
            (ingredient) => `\n${ingredient}`,
          )}`,
        );
    });
  }
}
