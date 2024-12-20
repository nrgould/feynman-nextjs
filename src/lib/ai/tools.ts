import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
	description: 'Display the weather for a location',
	parameters: z.object({
		location: z.string(),
	}),
	execute: async function ({ location }) {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return { weather: 'Sunny', temperature: 75, location };
	},
});

export const stockTool = createTool({
  description: 'Get price for a stock',
  parameters: z.object({
    symbol: z.string(),
  }),
  execute: async function ({ symbol }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { symbol, price: 100 };
  },
});

export const tools = {
  displayWeather: weatherTool,
  getStockPrice: stockTool,
};