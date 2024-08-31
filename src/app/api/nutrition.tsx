import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body;
  const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': process.env.NUTRITIONIX_APP_ID as string,
      'x-app-key': process.env.NUTRITIONIX_API_KEY as string,
    },
    body: JSON.stringify({ query })
  });
  const data = await response.json();
  res.status(200).json(data);
}