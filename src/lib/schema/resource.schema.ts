import { z } from 'zod'

export const createResourceSchema = z.object({
  name: z.string().min(2, 'Resource name is required'),
  type: z.enum(['UNIT', 'VEHICLE', 'PERSONNEL']),
  officers: z.number().int().nonnegative('Officers must be non-negative'),
  vehicle: z.string().min(1, 'Vehicle information is required'),
  status: z.enum(['DEPLOYED', 'STANDBY', 'AVAILABLE', 'UNAVAILABLE']).optional(),
  assignedTo: z.number().int().positive().nullable().optional(),
})

export const updateResourceSchema = createResourceSchema.extend({
  id: z.number().int().positive('Invalid resource ID'),
  status: z.enum(['DEPLOYED', 'STANDBY', 'AVAILABLE', 'UNAVAILABLE']),
})

export const assignResourceSchema = z.object({
  resourceId: z.number().int().positive('Invalid resource ID'),
  incidentId: z.number().int().positive('Invalid incident ID'),
})

export const releaseResourceSchema = z.object({
  resourceId: z.number().int().positive('Invalid resource ID'),
})
