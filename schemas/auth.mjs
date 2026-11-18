import { z } from 'zod';

export const registerSchema= z.object({
    email: z.email('Email must be a valid email address.'),
    password: z.string('Password is required.')
        .min(8, 'Password must be at least 8 characters.')
});

export const loginSchema = z.object({
    email: z.string('Email is required.'),
    password: z.string('Password is required.')
});