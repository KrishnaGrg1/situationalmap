import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../prisma'
import {
  createIncidentSchema,
  updateIncidentSchema,
  deleteIncidentSchema,
  getIncidentByIdSchema,
} from '../schema/incident.schema'

export const getIncidents = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await prisma.incident.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        updates: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        resources: true,
      },
    })
  },
)

export const getIncidentById = createServerFn({ method: 'GET' })
  .inputValidator((data: unknown) => getIncidentByIdSchema.parse(data))
  .handler(async ({ data }) => {
    const incident = await prisma.incident.findUnique({
      where: {
        id: data.id,
      },
      include: {
        updates: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        resources: true,
      },
    })

    if (!incident) {
      throw new Error('Incident not found')
    }

    return incident
  })

export const createIncident = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createIncidentSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.incident.create({
      data,
    })
  })

export const updateIncident = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateIncidentSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...payload } = data

    return await prisma.incident.update({
      where: {
        id,
      },
      data: payload,
    })
  })

export const deleteIncident = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => deleteIncidentSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.incident.delete({
      where: {
        id: data.id,
      },
    })
  })
