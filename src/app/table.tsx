"use client";

import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type FoodKey = 'apple' | 'orange' | 'banana' | 'chicken';

type FoodData = {
  name: string;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
};

const foods: Record<FoodKey, FoodData> = {
  apple: { name: 'Apple', protein: 0.3, fat: 0.2, carbs: 13.8, fiber: 2.4 },
  orange: { name: 'Orange', protein: 0.9, fat: 0.1, carbs: 11.8, fiber: 2.4 },
  banana: { name: 'Banana', protein: 1.1, fat: 0.3, carbs: 22.8, fiber: 2.6 },
  chicken: { name: 'Chicken Breast', protein: 31, fat: 3.6, carbs: 0, fiber: 0 },
};

const MacroComparisonTable = () => {
  const [food1, setFood1] = useState<FoodKey>('apple');
  const [food2, setFood2] = useState<FoodKey>('orange');

  const macros = ['Protein', 'Fat', 'Carbs', 'Fiber'];

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">{foods[food1].name} vs {foods[food2].name}</h1>
      <div className="flex justify-between mb-4">
        {[food1, food2].map((food, index) => (
          <Select key={index} value={food} onValueChange={(value: FoodKey) => (index === 0 ? setFood1(value) : setFood2(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Select food ${index + 1}`} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(foods).map(([key, { name }]) => (
                <SelectItem key={key} value={key}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Macro</TableHead>
            <TableHead>{foods[food1].name}</TableHead>
            <TableHead>{foods[food2].name}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {macros.map((macro) => (
            <TableRow key={macro}>
              <TableCell>{macro}</TableCell>
              {[food1, food2].map((food, index) => (
                <TableCell key={index}>
                  {((foods[food][macro.toLowerCase() as keyof FoodData] as number).toFixed(1))}g
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MacroComparisonTable;