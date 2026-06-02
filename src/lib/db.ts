import { prisma } from './prisma'
import type {
  Incident,
  IncidentUpdate,
  Resource,
  Province,
  IncidentSeverity,
  IncidentCategory,
  IncidentStatus,
  ResourceStatus,
  ResourceType,
} from '@prisma/client'

export type { Incident, IncidentUpdate, Resource, Province }

export type IncidentWithUpdates = Incident & {
  updates: IncidentUpdate[]
}

export type ResourceWithIncident = Resource & {
  incident: Incident | null
}

// Incident queries
export async function getAllIncidents(): Promise<IncidentWithUpdates[]> {
  return prisma.incident.findMany({
    include: {
      updates: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getIncidentById(
  id: number,
): Promise<IncidentWithUpdates | null> {
  return prisma.incident.findUnique({
    where: { id },
    include: {
      updates: {
        orderBy: { createdAt: 'desc' },
      },
      resources: true,
    },
  })
}

export async function getActiveIncidents(): Promise<IncidentWithUpdates[]> {
  return prisma.incident.findMany({
    where: { status: 'ACTIVE' },
    include: {
      updates: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getIncidentsByDistrict(
  district: string,
): Promise<IncidentWithUpdates[]> {
  return prisma.incident.findMany({
    where: { district },
    include: {
      updates: {
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export interface CreateIncidentInput {
  title: string
  severity: IncidentSeverity
  category: IncidentCategory
  district: string
  time: string
  description: string
  officers: number
  peopleAffected: number
  latitude: number
  longitude: number
  status?: IncidentStatus
}

export async function createIncident(
  data: CreateIncidentInput,
): Promise<Incident> {
  return prisma.incident.create({
    data,
  })
}

export async function updateIncidentStatus(
  id: number,
  status: IncidentStatus,
): Promise<Incident> {
  return prisma.incident.update({
    where: { id },
    data: { status },
  })
}

// Incident Update queries
export async function addIncidentUpdate(
  incidentId: number,
  user: string,
  text: string,
  time: string,
): Promise<IncidentUpdate> {
  return prisma.incidentUpdate.create({
    data: {
      incidentId,
      user,
      text,
      time,
    },
  })
}

// Resource queries
export async function getAllResources(): Promise<ResourceWithIncident[]> {
  return prisma.resource.findMany({
    include: {
      incident: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getAvailableResources(): Promise<Resource[]> {
  return prisma.resource.findMany({
    where: {
      status: {
        in: ['AVAILABLE', 'STANDBY'],
      },
    },
  })
}

export async function getResourceById(
  id: number,
): Promise<ResourceWithIncident | null> {
  return prisma.resource.findUnique({
    where: { id },
    include: {
      incident: true,
    },
  })
}

export interface CreateResourceInput {
  name: string
  type: ResourceType
  officers: number
  vehicle: string
  status?: ResourceStatus
  assignedTo?: number
}

export async function createResource(
  data: CreateResourceInput,
): Promise<Resource> {
  return prisma.resource.create({
    data,
  })
}

export async function assignResourceToIncident(
  resourceId: number,
  incidentId: number,
): Promise<Resource> {
  return prisma.resource.update({
    where: { id: resourceId },
    data: {
      assignedTo: incidentId,
      status: 'DEPLOYED',
    },
  })
}

export async function unassignResource(resourceId: number): Promise<Resource> {
  return prisma.resource.update({
    where: { id: resourceId },
    data: {
      assignedTo: null,
      status: 'AVAILABLE',
    },
  })
}

export async function updateResourceStatus(
  id: number,
  status: ResourceStatus,
): Promise<Resource> {
  return prisma.resource.update({
    where: { id },
    data: { status },
  })
}

// Province queries
export async function getAllProvinces(): Promise<Province[]> {
  return prisma.province.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function updateProvinceStatus(
  name: string,
  status: 'ACTIVE' | 'MONITORING' | 'NORMAL',
  count: number,
): Promise<Province> {
  return prisma.province.upsert({
    where: { name },
    update: { status, count },
    create: { name, status, count },
  })
}

// Statistics and aggregations
export async function getIncidentStats() {
  const [total, active, monitoring, resolved, bySeverity, byCategory] =
    await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({ where: { status: 'ACTIVE' } }),
      prisma.incident.count({ where: { status: 'MONITORING' } }),
      prisma.incident.count({ where: { status: 'RESOLVED' } }),
      prisma.incident.groupBy({
        by: ['severity'],
        _count: true,
      }),
      prisma.incident.groupBy({
        by: ['category'],
        _count: true,
      }),
    ])

  return {
    total,
    active,
    monitoring,
    resolved,
    bySeverity,
    byCategory,
  }
}

export async function getResourceStats() {
  const [total, deployed, available, standby, unavailable] = await Promise.all([
    prisma.resource.count(),
    prisma.resource.count({ where: { status: 'DEPLOYED' } }),
    prisma.resource.count({ where: { status: 'AVAILABLE' } }),
    prisma.resource.count({ where: { status: 'STANDBY' } }),
    prisma.resource.count({ where: { status: 'UNAVAILABLE' } }),
  ])

  return {
    total,
    deployed,
    available,
    standby,
    unavailable,
  }
}
