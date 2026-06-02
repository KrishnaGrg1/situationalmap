import { z } from 'zod'

export const createProvinceSchema = z.object({
  name: z.string().min(2, 'Province name is required'),
  status: z.enum(['ACTIVE', 'MONITORING', 'NORMAL']).optional(),
  count: z.number().int().nonnegative('Count must be non-negative').optional(),
})

export const updateProvinceSchema = z.object({
  id: z.number().int().positive('Invalid province ID'),
  name: z.string().min(2, 'Province name is required'),
  status: z.enum(['ACTIVE', 'MONITORING', 'NORMAL']),
  count: z.number().int().nonnegative('Count must be non-negative'),
})
