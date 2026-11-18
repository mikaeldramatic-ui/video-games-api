import { z } from 'zod';

export const createGameSchema = z.object({
    title: z.string('Title is required.'),
    developer: z.string('Developer is required.'),
    platform: z.string('Platform is required.'),
    genre: z.string('Genre is required.'),
    year: z.number('Year must be a number.').int('Year must be a whole number YYYY.')
        .min(1950, 'Must be above year 1950.')
        .max(2100, 'Must be under year 2100'),
    rating: z.number('Rating must be a number.')
        .min(1, 'Rating must be between 1 and 10.')
        .max(10, 'Rating must be between 1 and 10.')
});