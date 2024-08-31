"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const NUTRITIONIX_APP_ID = process.env.NEXT_PUBLIC_NUTRITIONIX_APP_ID || '';
const NUTRITIONIX_API_KEY = process.env.NEXT_PUBLIC_NUTRITIONIX_API_KEY || '';
const CALORIENINJA_API_KEY = process.env.NEXT_PUBLIC_CALORIE_NINJAS_API || '';

if (!NUTRITIONIX_APP_ID || !NUTRITIONIX_API_KEY || !CALORIENINJA_API_KEY) {
  console.error('Missing API keys. Please check your .env.local file.');
}

interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
}

const MacroComparisonTable = () => {
  const [food1, setFood1] = useState<string>('');
  const [food2, setFood2] = useState<string>('');
  const [food1Data, setFood1Data] = useState<NutritionData | null>(null);
  const [food2Data, setFood2Data] = useState<NutritionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNutritionixData = async (query: string): Promise<NutritionData | null> => {
    try {
      const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': NUTRITIONIX_APP_ID,
          'x-app-key': NUTRITIONIX_API_KEY,
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      console.log('Using Nutritionix');
      return {
        calories: data.foods[0].nf_calories,
        protein: data.foods[0].nf_protein,
        fat: data.foods[0].nf_total_fat,
        carbs: data.foods[0].nf_total_carbohydrate,
        fiber: data.foods[0].nf_dietary_fiber
      };
    } catch (error) {
      console.error('Error fetching Nutritionix data:', error);
      return null;
    }
  };

  const fetchCalorieNinjasData = async (query: string): Promise<NutritionData | null> => {
    try {
      console.log('The query', query)
      const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
        method: 'GET',
        headers: {
          'X-Api-Key': CALORIENINJA_API_KEY,
        },
      });
      const data = await response.json();
      console.log('Using CalorieNinjas');
      return {
        calories: data.items[0].calories,
        protein: data.items[0].protein_g,
        fat: data.items[0].fat_total_g,
        carbs: data.items[0].carbohydrates_total_g,
        fiber: data.items[0].fiber_g
      };
    } catch (error) {
      console.error('Error fetching CalorieNinjas data:', error);
      return null;
    }
  };

  const fetchNutritionData = async (query: string): Promise<NutritionData | null> => {
    // const nutritionixData = await fetchNutritionixData(query);
    // if (nutritionixData) return nutritionixData;
    
    console.log('Nutritionix API failed, trying CalorieNinjas API');
    return await fetchCalorieNinjasData(query);
  };

  const handleCreateTable = async () => {
    setIsLoading(true);
    if (food1) {
      const data = await fetchNutritionData(food1);
      setFood1Data(data);
    }
    if (food2) {
      const data = await fetchNutritionData(food2);
      setFood2Data(data);
    }
    setIsLoading(false);
  };

  // useEffect(() => {
  //   if (food1) {
  //     fetchNutritionData(food1).then(setFood1Data);
  //   }
  // }, [food1]);

  // useEffect(() => {
  //   if (food2) {
  //     fetchNutritionData(food2).then(setFood2Data);
  //   }
  // }, [food2]);

  const macros = [
    { name: 'Calories', key: 'calories' },
    { name: 'Protein', key: 'protein' },
    { name: 'Fat', key: 'fat' },
    { name: 'Carbs', key: 'carbs' },
    { name: 'Fiber', key: 'fiber' }
  ] as const;

  const getComparisonColor = (macro: string, value1: number | undefined, value2: number | undefined) => {
    if (!value1 || !value2) return '';
    if (macro === 'Protein') {
      return value1 > value2 ? 'bg-green-200' : value2 > value1 ? 'bg-red-200' : '';
    }
    return '';
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Food Macro Comparison</h1>
      <p className="font-medium mb-4 text-center">Describe the food in Natural Language</p>
      <div className="flex flex-col space-y-4 mb-4">
        <div className='flex flex-row gap-6'>
        <input
          type="text"
          placeholder="Enter food 1"
          value={food1}
          onChange={(e) => setFood1(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Enter food 2"
          value={food2}
          onChange={(e) => setFood2(e.target.value)}
          className="border p-2 rounded"
        />
        </div>
        <button
          onClick={handleCreateTable}
          disabled={isLoading || (!food1 && !food2)}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
        >
          {isLoading ? 'Loading...' : 'Create Table'}
        </button>
      </div>
      {(true) && (
        <Table>
          <TableHeader>
            <TableRow className='bg-[#DA95DE]'>
              <TableHead className='font-medium text-[1.1rem]'>Macro</TableHead>
              <TableHead>{food1}</TableHead>
              <TableHead>{food2}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {macros.map((macro) => (
              <TableRow key={macro.name}>
                <TableCell className='font-medium text-[1.1rem]'>{macro.name}</TableCell>
                <TableCell className={getComparisonColor(macro.name, food1Data?.[macro.key], food2Data?.[macro.key])}>
                  {food1Data ? `${food1Data[macro.key].toFixed(1)}${macro.name === 'Calories' ? '' : 'g'}` : '-'}
                </TableCell>
                <TableCell className={getComparisonColor(macro.name, food2Data?.[macro.key], food1Data?.[macro.key])}>
                  {food2Data ? `${food2Data[macro.key].toFixed(1)}${macro.name === 'Calories' ? '' : 'g'}` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MacroComparisonTable;