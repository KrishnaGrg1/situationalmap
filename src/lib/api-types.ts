// Re-export Prisma types
export type {
  Incident,
  IncidentUpdate,
  Resource,
  Province,
  IncidentSeverity,
  IncidentCategory,
  IncidentStatus,
  ResourceType,
  ResourceStatus,
  ProvinceStatus,
} from '@prisma/client'

// Incident Types
export interface CreateIncidentInput {
  title: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  category: 'DISASTER' | 'PROTEST' | 'TRAFFIC' | 'CRIME' | 'MEDICAL'
  district: string
  time: string
  description: string
  officers: number
  peopleAffected: number
  latitude: number
  longitude: number
}

export interface UpdateIncidentInput {
  id: number
  title: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  category: 'DISASTER' | 'PROTEST' | 'TRAFFIC' | 'CRIME' | 'MEDICAL'
  district: string
  time: string
  description: string
  officers: number
  peopleAffected: number
  latitude: number
  longitude: number
  status: 'ACTIVE' | 'MONITORING' | 'RESOLVED'
}

export interface DeleteIncidentInput {
  id: number
}

export interface GetIncidentByIdInput {
  id: number
}

// Incident with relations for detailed views
export interface IncidentWithRelations {
  id: number
  title: string
  severity: string
  category: string
  district: string
  time: string
  description: string
  officers: number
  peopleAffected: number
  latitude: number
  longitude: number
  status: string
  createdAt: Date
  updatedAt: Date
  updates: Array<{
    id: number
    user: string
    text: string
    time: string
    createdAt: Date
  }>
  resources: Array<{
    id: number
    name: string
    type: string
    officers: number
    vehicle: string
    status: string
  }>
}

// Incident Update Types
export interface CreateIncidentUpdateInput {
  incidentId: number
  user: string
  text: string
  time: string
}

export interface DeleteIncidentUpdateInput {
  id: number
}

// Resource Types
export interface CreateResourceInput {
  name: string
  type: 'UNIT' | 'VEHICLE' | 'PERSONNEL'
  officers: number
  vehicle: string
  status?: 'DEPLOYED' | 'STANDBY' | 'AVAILABLE' | 'UNAVAILABLE'
  assignedTo?: number | null
}

export interface UpdateResourceInput {
  id: number
  name: string
  type: 'UNIT' | 'VEHICLE' | 'PERSONNEL'
  officers: number
  vehicle: string
  status: 'DEPLOYED' | 'STANDBY' | 'AVAILABLE' | 'UNAVAILABLE'
  assignedTo?: number | null
}

export interface AssignResourceInput {
  resourceId: number
  incidentId: number
}

export interface ReleaseResourceInput {
  resourceId: number
}

// Province Types
export interface CreateProvinceInput {
  name: string
  status?: 'ACTIVE' | 'MONITORING' | 'NORMAL'
  count?: number
}

export interface UpdateProvinceInput {
  id: number
  name: string
  status: 'ACTIVE' | 'MONITORING' | 'NORMAL'
  count: number
}
