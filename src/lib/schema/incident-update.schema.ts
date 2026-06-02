import { z } from 'zod'

export const createIncidentUpdateSchema = z.object({
  incidentId: z.number().int().positive('Invalid incident ID'),
  user: z.string().min(2, 'User name is required'),
  text: z.string().min(2, 'Update text is required'),
  time: z.string().min(1, 'Time is required'),
})

export const deleteIncidentUpdateSchema = z.object({
  id: z.number().int().positive('Invalid update ID'),
})
