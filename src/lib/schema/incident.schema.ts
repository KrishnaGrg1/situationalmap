import { z } from 'zod'

export const createIncidentSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  category: z.enum(['DISASTER', 'PROTEST', 'TRAFFIC', 'CRIME', 'MEDICAL']),
  district: z.string().min(2, 'District is required'),
  time: z.string().min(1, 'Time is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  officers: z.number().int().nonnegative('Officers must be non-negative'),
  peopleAffected: z
    .number()
    .int()
    .nonnegative('People affected must be non-negative'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
})

export const updateIncidentSchema = createIncidentSchema.extend({
  id: z.number().int().positive('Invalid incident ID'),
  status: z.enum(['ACTIVE', 'MONITORING', 'RESOLVED']),
})

export const deleteIncidentSchema = z.object({
  id: z.number().int().positive('Invalid incident ID'),
})

export const getIncidentByIdSchema = z.object({
  id: z.number().int().positive('Invalid incident ID'),
})
