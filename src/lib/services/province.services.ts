import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../prisma'
import {
  createProvinceSchema,
  updateProvinceSchema,
} from '../schema/province.schema'

export const getProvinces = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await prisma.province.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  },
)

export const createProvince = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => createProvinceSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.province.create({
      data,
    })
  })

export const updateProvince = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => updateProvinceSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...payload } = data

    return await prisma.province.update({
      where: {
        id,
      },
      data: payload,
    })
  })
