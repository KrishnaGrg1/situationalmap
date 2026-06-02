import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../prisma'
import {
  createResourceSchema,
  updateResourceSchema,
  assignResourceSchema,
  releaseResourceSchema,
} from '../schema/resource.schema'

export const getResources = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await prisma.resource.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        incident: true,
      },
    })
  },
)

export const createResource = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createResourceSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.resource.create({
      data,
    })
  })

export const updateResource = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateResourceSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...payload } = data

    return await prisma.resource.update({
      where: {
        id,
      },
      data: payload,
    })
  })

export const assignResourceToIncident = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => assignResourceSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.resource.update({
      where: {
        id: data.resourceId,
      },
      data: {
        assignedTo: data.incidentId,
        status: 'DEPLOYED',
      },
    })
  })

export const releaseResource = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => releaseResourceSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.resource.update({
      where: {
        id: data.resourceId,
      },
      data: {
        assignedTo: null,
        status: 'AVAILABLE',
      },
    })
  })
