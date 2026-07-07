import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { DailyNutritionLog } from '../backend/models/Nutrition';

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  includeMeals: boolean;
  includeTotals: boolean;
  includeCharts: boolean;
}

export class ExportService {
  /**
   * Export nutrition data to CSV format
   */
  static async exportToCSV(
    nutritionData: DailyNutritionLog[],
    options: ExportOptions
  ): Promise<string> {
    let csvContent = 'Date,Meal,Food,Quantity (g),Calories,Protein (g),Carbs (g),Fat (g),Fiber (g),Sugar (g)\n';
    
    nutritionData.forEach(day => {
      const meals = [
        { name: 'Breakfast', meal: day.meals.breakfast },
        { name: 'Lunch', meal: day.meals.lunch },
        { name: 'Dinner', meal: day.meals.dinner },
        ...day.meals.snacks.map((snack, index) => ({ name: `Snack ${index + 1}`, meal: snack }))
      ];

      meals.forEach(mealData => {
        if (mealData.meal) {
          mealData.meal.items.forEach(item => {
            csvContent += `${day.date},${mealData.name},"${item.foodName}",${item.quantity},${item.nutrition.calories},${item.nutrition.protein},${item.nutrition.carbohydrates},${item.nutrition.fat},${item.nutrition.fiber},${item.nutrition.sugar}\n`;
          });
        }
      });

      // Add daily totals if requested
      if (options.includeTotals) {
        csvContent += `${day.date},TOTAL,,${day.totals.calories},${day.totals.protein},${day.totals.carbohydrates},${day.totals.fat},${day.totals.fiber},${day.totals.sugar}\n`;
      }
    });

    return csvContent;
  }

  /**
   * Export nutrition data to JSON format
   */
  static async exportToJSON(
    nutritionData: DailyNutritionLog[],
    options: ExportOptions
  ): Promise<string> {
    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange: options.dateRange,
      nutritionData: nutritionData.map(day => ({
        date: day.date,
        meals: {
          breakfast: day.meals.breakfast ? {
            items: day.meals.breakfast.items.map(item => ({
              foodName: item.foodName,
              quantity: item.quantity,
              nutrition: item.nutrition
            })),
            totalNutrition: day.meals.breakfast.totalNutrition
          } : null,
          lunch: day.meals.lunch ? {
            items: day.meals.lunch.items.map(item => ({
              foodName: item.foodName,
              quantity: item.quantity,
              nutrition: item.nutrition
            })),
            totalNutrition: day.meals.lunch.totalNutrition
          } : null,
          dinner: day.meals.dinner ? {
            items: day.meals.dinner.items.map(item => ({
              foodName: item.foodName,
              quantity: item.quantity,
              nutrition: item.nutrition
            })),
            totalNutrition: day.meals.dinner.totalNutrition
          } : null,
          snacks: day.meals.snacks.map(snack => ({
            items: snack.items.map(item => ({
              foodName: item.foodName,
              quantity: item.quantity,
              nutrition: item.nutrition
            })),
            totalNutrition: snack.totalNutrition
          }))
        },
        totals: day.totals
      })),
      summary: {
        totalDays: nutritionData.length,
        averageCalories: nutritionData.reduce((sum, day) => sum + day.totals.calories, 0) / nutritionData.length,
        averageProtein: nutritionData.reduce((sum, day) => sum + day.totals.protein, 0) / nutritionData.length,
        averageCarbs: nutritionData.reduce((sum, day) => sum + day.totals.carbohydrates, 0) / nutritionData.length,
        averageFat: nutritionData.reduce((sum, day) => sum + day.totals.fat, 0) / nutritionData.length
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Generate a simple HTML report
   */
  static async generateHTMLReport(
    nutritionData: DailyNutritionLog[],
    options: ExportOptions
  ): Promise<string> {
    const startDate = new Date(options.dateRange.startDate).toLocaleDateString();
    const endDate = new Date(options.dateRange.endDate).toLocaleDateString();
    
    let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Nutrition Report - ${startDate} to ${endDate}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .day-section { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
        .meal-section { margin-bottom: 15px; }
        .meal-title { font-weight: bold; color: #007AFF; margin-bottom: 10px; }
        .food-item { margin-left: 20px; margin-bottom: 5px; }
        .totals { background: #e9ecef; padding: 10px; border-radius: 5px; margin-top: 10px; }
        .summary { background: #d4edda; padding: 15px; border-radius: 8px; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🍎 Nutrition Report</h1>
        <p><strong>Period:</strong> ${startDate} - ${endDate}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
    </div>
`;

    nutritionData.forEach(day => {
      html += `
    <div class="day-section">
        <h2>📅 ${new Date(day.date).toLocaleDateString()}</h2>
        
        <div class="meal-section">
            <div class="meal-title">🌅 Breakfast</div>
            ${day.meals.breakfast ? day.meals.breakfast.items.map(item => 
              `<div class="food-item">• ${item.foodName} (${item.quantity}g) - ${item.nutrition.calories} cal</div>`
            ).join('') : '<div class="food-item">No breakfast recorded</div>'}
        </div>
        
        <div class="meal-section">
            <div class="meal-title">☀️ Lunch</div>
            ${day.meals.lunch ? day.meals.lunch.items.map(item => 
              `<div class="food-item">• ${item.foodName} (${item.quantity}g) - ${item.nutrition.calories} cal</div>`
            ).join('') : '<div class="food-item">No lunch recorded</div>'}
        </div>
        
        <div class="meal-section">
            <div class="meal-title">🌙 Dinner</div>
            ${day.meals.dinner ? day.meals.dinner.items.map(item => 
              `<div class="food-item">• ${item.foodName} (${item.quantity}g) - ${item.nutrition.calories} cal</div>`
            ).join('') : '<div class="food-item">No dinner recorded</div>'}
        </div>
        
        ${day.meals.snacks.length > 0 ? `
        <div class="meal-section">
            <div class="meal-title">🍿 Snacks</div>
            ${day.meals.snacks.map(snack => 
              snack.items.map(item => 
                `<div class="food-item">• ${item.foodName} (${item.quantity}g) - ${item.nutrition.calories} cal</div>`
              ).join('')
            ).join('')}
        </div>
        ` : ''}
        
        <div class="totals">
            <h3>📊 Daily Totals</h3>
            <table>
                <tr><th>Nutrient</th><th>Amount</th></tr>
                <tr><td>Calories</td><td>${Math.round(day.totals.calories)} kcal</td></tr>
                <tr><td>Protein</td><td>${Math.round(day.totals.protein)}g</td></tr>
                <tr><td>Carbohydrates</td><td>${Math.round(day.totals.carbohydrates)}g</td></tr>
                <tr><td>Fat</td><td>${Math.round(day.totals.fat)}g</td></tr>
                <tr><td>Fiber</td><td>${Math.round(day.totals.fiber)}g</td></tr>
                <tr><td>Sugar</td><td>${Math.round(day.totals.sugar)}g</td></tr>
            </table>
        </div>
    </div>
`;
    });

    // Add summary
    const totalDays = nutritionData.length;
    const avgCalories = nutritionData.reduce((sum, day) => sum + day.totals.calories, 0) / totalDays;
    const avgProtein = nutritionData.reduce((sum, day) => sum + day.totals.protein, 0) / totalDays;
    const avgCarbs = nutritionData.reduce((sum, day) => sum + day.totals.carbohydrates, 0) / totalDays;
    const avgFat = nutritionData.reduce((sum, day) => sum + day.totals.fat, 0) / totalDays;

    html += `
    <div class="summary">
        <h2>📈 Summary (${totalDays} days)</h2>
        <table>
            <tr><th>Metric</th><th>Average</th></tr>
            <tr><td>Daily Calories</td><td>${Math.round(avgCalories)} kcal</td></tr>
            <tr><td>Daily Protein</td><td>${Math.round(avgProtein)}g</td></tr>
            <tr><td>Daily Carbs</td><td>${Math.round(avgCarbs)}g</td></tr>
            <tr><td>Daily Fat</td><td>${Math.round(avgFat)}g</td></tr>
        </table>
    </div>
</body>
</html>
`;

    return html;
  }

  /**
   * Save file to device and share
   */
  static async saveAndShare(
    content: string,
    filename: string,
    mimeType: string
  ): Promise<void> {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
      
      // Write file
      await RNFS.writeFile(filePath, content, 'utf8');
      
      // Share file
      const shareOptions = {
        title: 'Nutrition Report',
        message: 'Check out my nutrition report!',
        url: `file://${filePath}`,
        type: mimeType,
      };
      
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error saving and sharing file:', error);
      throw new Error('Failed to save and share file');
    }
  }

  /**
   * Export nutrition data with specified options
   */
  static async exportNutritionData(
    nutritionData: DailyNutritionLog[],
    options: ExportOptions
  ): Promise<void> {
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      const dateRange = `${options.dateRange.startDate}_to_${options.dateRange.endDate}`;

      switch (options.format) {
        case 'csv':
          content = await this.exportToCSV(nutritionData, options);
          filename = `nutrition_report_${dateRange}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = await this.exportToJSON(nutritionData, options);
          filename = `nutrition_report_${dateRange}.json`;
          mimeType = 'application/json';
          break;
        case 'pdf':
          content = await this.generateHTMLReport(nutritionData, options);
          filename = `nutrition_report_${dateRange}.html`;
          mimeType = 'text/html';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      await this.saveAndShare(content, filename, mimeType);
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }
}

