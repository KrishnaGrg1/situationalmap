// Transform database records to frontend format
import type { Incident, Resource, Province } from '@prisma/client'

export function transformIncident(incident: any) {
  return {
    id: incident.id,
    title: incident.title,
    severity: incident.severity.toLowerCase(),
    category: incident.category.toLowerCase(),
    district: incident.district,
    time: incident.time,
    desc: incident.description,
    officers: incident.officers,
    peopleAffected: incident.peopleAffected,
    coordinates: {
      lat: incident.latitude,
      lng: incident.longitude,
    },
    updates: incident.updates?.map((u: any) => ({
      user: u.user,
      text: u.text,
      time: u.time,
    })) || [],
    status: incident.status.toLowerCase(),
  }
}

export function transformResource(resource: any) {
  return {
    id: resource.id,
    name: resource.name,
    type: resource.type.toLowerCase(),
    officers: resource.officers,
    vehicle: resource.vehicle,
    status: resource.status.toLowerCase(),
    assignedTo: resource.assignedTo,
  }
}

export function transformProvince(province: any) {
  return {
    name: province.name,
    status: province.status.toLowerCase(),
    count: province.count,
  }
}
