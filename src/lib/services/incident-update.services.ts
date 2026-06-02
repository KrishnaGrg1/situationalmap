import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../prisma'
import {
  createIncidentUpdateSchema,
  deleteIncidentUpdateSchema,
} from '../schema/incident-update.schema'

export const createIncidentUpdate = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createIncidentUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.incidentUpdate.create({
      data,
    })
  })

export const deleteIncidentUpdate = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => deleteIncidentUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.incidentUpdate.delete({
      where: {
        id: data.id,
      },
    })
  })
