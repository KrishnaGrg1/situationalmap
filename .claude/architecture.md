# TanStack Start + Prisma API Architecture Documentation

This document explains how the application is structured when using **TanStack Start**, **TanStack Form**, **TanStack Query**, **Zod**, and **Prisma** directly through server functions.

This architecture does not use Express, REST controllers, or a separate backend API server. Instead, TanStack Start server functions act as the backend layer, and Prisma is used inside those server functions to communicate with PostgreSQL.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Important Concept](#important-concept)
3. [Prisma Configuration](#prisma-configuration)
4. [Prisma Client Setup](#prisma-client-setup)
5. [Type System](#type-system)
6. [Schema Validation](#schema-validation)
7. [Service Layer](#service-layer)
8. [Custom Hooks](#custom-hooks)
9. [TanStack Form Integration](#tanstack-form-integration)
10. [Real-time Updates](#real-time-updates)
11. [Error Handling](#error-handling)
12. [Best Practices](#best-practices)
13. [Quick Reference](#quick-reference)

---

## Architecture Overview

The application follows a full-stack TanStack architecture.

```txt
┌─────────────────────────────────────────┐
│        UI Components / Pages            │
│        TanStack Form                    │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│        Custom Hooks Layer               │
│        TanStack Query                   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│        Server Function Layer            │
│        TanStack Start createServerFn    │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│        Prisma Client                    │
│        Database Access Layer            │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│        PostgreSQL Database              │
└─────────────────────────────────────────┘
```

---

## Important Concept

Even though the frontend calls the function directly, Prisma is not running in the browser.

Wrong idea:

```txt
React Component → Prisma → Database
```

Correct idea:

```txt
React Component → Server Function → Prisma → Database
```

TanStack Start server functions allow frontend code to call backend logic safely. The function can be imported and used in frontend code, but the actual Prisma query runs on the server.

---

## Prisma Configuration

### Prisma Schema

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../src/generated/prisma"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}
```

### Purpose

This configuration tells Prisma to generate the Prisma Client into:

```txt
src/generated/prisma
```

The database provider is:

```txt
PostgreSQL
```

---

## Prisma Client Setup

Create one reusable Prisma client instance.

### File: `src/lib/prisma.ts`

```typescript
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({
  adapter,
})
```

### Why This File Is Needed

This prevents creating a new Prisma Client instance again and again during development.

Without this pattern, hot reload can create too many database connections.

---

## Type System

Types are used to define what data the frontend sends and what data the server function returns.

### File: `src/lib/api-types.ts`

```typescript
import type {
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
} from '../generated/prisma'

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
}
```

---

## Incident Types

```typescript
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
}

export interface UpdateIncidentInput {
  id: number
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
  status: IncidentStatus
}

export interface DeleteIncidentInput {
  id: number
}

export interface GetIncidentByIdInput {
  id: number
}

export interface IncidentWithRelations extends Incident {
  updates: IncidentUpdate[]
  resources: Resource[]
}
```

---

## Incident Update Types

```typescript
export interface CreateIncidentUpdateInput {
  incidentId: number
  user: string
  text: string
  time: string
}

export interface DeleteIncidentUpdateInput {
  id: number
}
```

---

## Resource Types

```typescript
export interface CreateResourceInput {
  name: string
  type: ResourceType
  officers: number
  vehicle: string
  status?: ResourceStatus
  assignedTo?: number | null
}

export interface UpdateResourceInput {
  id: number
  name: string
  type: ResourceType
  officers: number
  vehicle: string
  status: ResourceStatus
  assignedTo?: number | null
}

export interface AssignResourceInput {
  resourceId: number
  incidentId: number
}

export interface ReleaseResourceInput {
  resourceId: number
}
```

---

## Province Types

```typescript
export interface CreateProvinceInput {
  name: string
  status?: ProvinceStatus
  count?: number
}

export interface UpdateProvinceInput {
  id: number
  name: string
  status: ProvinceStatus
  count: number
}
```

---

## Schema Validation

Zod schemas validate data before Prisma receives it.

This is important because Prisma should not receive invalid form data directly.

---

## Incident Schema

### File: `src/lib/schema/incident.schema.ts`

```typescript
import { z } from 'zod'

export const createIncidentSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  category: z.enum(['DISASTER', 'PROTEST', 'TRAFFIC', 'CRIME', 'MEDICAL']),
  district: z.string().min(2, 'District is required'),
  time: z.string().min(1, 'Time is required'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  officers: z.number().int().nonnegative(),
  peopleAffected: z.number().int().nonnegative(),
  latitude: z.number(),
  longitude: z.number(),
})

export const updateIncidentSchema = createIncidentSchema.extend({
  id: z.number().int().positive(),
  status: z.enum(['ACTIVE', 'MONITORING', 'RESOLVED']),
})

export const deleteIncidentSchema = z.object({
  id: z.number().int().positive(),
})

export const getIncidentByIdSchema = z.object({
  id: z.number().int().positive(),
})
```

---

## Incident Update Schema

### File: `src/lib/schema/incident-update.schema.ts`

```typescript
import { z } from 'zod'

export const createIncidentUpdateSchema = z.object({
  incidentId: z.number().int().positive(),
  user: z.string().min(2, 'User is required'),
  text: z.string().min(2, 'Update text is required'),
  time: z.string().min(1, 'Time is required'),
})

export const deleteIncidentUpdateSchema = z.object({
  id: z.number().int().positive(),
})
```

---

## Resource Schema

### File: `src/lib/schema/resource.schema.ts`

```typescript
import { z } from 'zod'

export const createResourceSchema = z.object({
  name: z.string().min(2, 'Resource name is required'),
  type: z.enum(['UNIT', 'VEHICLE', 'PERSONNEL']),
  officers: z.number().int().nonnegative(),
  vehicle: z.string().min(1, 'Vehicle information is required'),
  status: z
    .enum(['DEPLOYED', 'STANDBY', 'AVAILABLE', 'UNAVAILABLE'])
    .optional(),
  assignedTo: z.number().int().positive().nullable().optional(),
})

export const updateResourceSchema = createResourceSchema.extend({
  id: z.number().int().positive(),
  status: z.enum(['DEPLOYED', 'STANDBY', 'AVAILABLE', 'UNAVAILABLE']),
})

export const assignResourceSchema = z.object({
  resourceId: z.number().int().positive(),
  incidentId: z.number().int().positive(),
})

export const releaseResourceSchema = z.object({
  resourceId: z.number().int().positive(),
})
```

---

## Province Schema

### File: `src/lib/schema/province.schema.ts`

```typescript
import { z } from 'zod'

export const createProvinceSchema = z.object({
  name: z.string().min(2, 'Province name is required'),
  status: z.enum(['ACTIVE', 'MONITORING', 'NORMAL']).optional(),
  count: z.number().int().nonnegative().optional(),
})

export const updateProvinceSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2, 'Province name is required'),
  status: z.enum(['ACTIVE', 'MONITORING', 'NORMAL']),
  count: z.number().int().nonnegative(),
})
```

---

# Service Layer

The service layer uses TanStack Start server functions.

These functions replace Express controllers/routes.

---

## Incident Services

### File: `src/lib/services/incident.services.ts`

```typescript
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
        updates: true,
        resources: true,
      },
    })
  },
)

export const getIncidentById = createServerFn({ method: 'GET' })
  .inputValidator((data) => getIncidentByIdSchema.parse(data))
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
  .inputValidator((data) => createIncidentSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.incident.create({
      data,
    })
  })

export const updateIncident = createServerFn({ method: 'POST' })
  .inputValidator((data) => updateIncidentSchema.parse(data))
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
  .inputValidator((data) => deleteIncidentSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.incident.delete({
      where: {
        id: data.id,
      },
    })
  })
```

---

## Incident Update Services

### File: `src/lib/services/incident-update.services.ts`

```typescript
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../prisma'
import {
  createIncidentUpdateSchema,
  deleteIncidentUpdateSchema,
} from '../schema/incident-update.schema'

export const createIncidentUpdate = createServerFn({ method: 'POST' })
  .inputValidator((data) => createIncidentUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.incidentUpdate.create({
      data,
    })
  })

export const deleteIncidentUpdate = createServerFn({ method: 'POST' })
  .inputValidator((data) => deleteIncidentUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.incidentUpdate.delete({
      where: {
        id: data.id,
      },
    })
  })
```

---

## Resource Services

### File: `src/lib/services/resource.services.ts`

```typescript
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
  .inputValidator((data) => createResourceSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.resource.create({
      data,
    })
  })

export const updateResource = createServerFn({ method: 'POST' })
  .inputValidator((data) => updateResourceSchema.parse(data))
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
  .inputValidator((data) => assignResourceSchema.parse(data))
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
  .inputValidator((data) => releaseResourceSchema.parse(data))
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
```

---

## Province Services

### File: `src/lib/services/province.services.ts`

```typescript
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
  .inputValidator((data) => createProvinceSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.province.create({
      data,
    })
  })

export const updateProvince = createServerFn({ method: 'POST' })
  .inputValidator((data) => updateProvinceSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...payload } = data

    return await prisma.province.update({
      where: {
        id,
      },
      data: payload,
    })
  })
```

---

# Custom Hooks

Custom hooks wrap server functions with TanStack Query.

This gives the app:

- Loading state
- Error state
- Caching
- Refetching
- Mutation handling
- Query invalidation

---

## Incident Hooks

### File: `src/hooks/use-incident.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
} from '../lib/services/incident.services'
import { toast } from 'sonner'

export function useGetIncidents() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: getIncidents,
    refetchInterval: 30000,
  })
}

export function useGetIncidentById(id: number) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: () => getIncidentById({ data: { id } }),
    enabled: Boolean(id),
    refetchInterval: 30000,
  })
}

export function useCreateIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['provinces'] })
      toast.success('Incident created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateIncident,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['incident', data.id] })
      toast.success('Incident updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['provinces'] })
      toast.success('Incident deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
```

---

## Incident Update Hooks

### File: `src/hooks/use-incident-update.ts`

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createIncidentUpdate,
  deleteIncidentUpdate,
} from '../lib/services/incident-update.services'
import { toast } from 'sonner'

export function useCreateIncidentUpdate(incidentId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIncidentUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] })
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Incident update added successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useDeleteIncidentUpdate(incidentId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteIncidentUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] })
      toast.success('Incident update deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
```

---

## Resource Hooks

### File: `src/hooks/use-resource.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getResources,
  createResource,
  updateResource,
  assignResourceToIncident,
  releaseResource,
} from '../lib/services/resource.services'
import { toast } from 'sonner'

export function useGetResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: getResources,
    refetchInterval: 30000,
  })
}

export function useCreateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      toast.success('Resource created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Resource updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useAssignResourceToIncident(incidentId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: assignResourceToIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] })
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Resource assigned successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useReleaseResource(incidentId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: releaseResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })

      if (incidentId) {
        queryClient.invalidateQueries({ queryKey: ['incident', incidentId] })
      }

      toast.success('Resource released successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
```

---

## Province Hooks

### File: `src/hooks/use-province.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProvinces,
  createProvince,
  updateProvince,
} from '../lib/services/province.services'
import { toast } from 'sonner'

export function useGetProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces,
    refetchInterval: 30000,
  })
}

export function useCreateProvince() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProvince,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provinces'] })
      toast.success('Province created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export function useUpdateProvince() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProvince,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provinces'] })
      toast.success('Province updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
```

---

# TanStack Form Integration

TanStack Form is used for form state, input handling, validation, and submission.

The form submits data to a custom hook. The custom hook calls a TanStack Query mutation. The mutation calls a TanStack Start server function. The server function uses Prisma.

---

## Create Incident Form

### File: `src/components/forms/create-incident-form.tsx`

```tsx
import { useForm } from '@tanstack/react-form'
import { useCreateIncident } from '../../hooks/use-incident'

export function CreateIncidentForm() {
  const { mutate: createIncident, isPending } = useCreateIncident()

  const form = useForm({
    defaultValues: {
      title: '',
      severity: 'MEDIUM',
      category: 'TRAFFIC',
      district: '',
      time: '',
      description: '',
      officers: 0,
      peopleAffected: 0,
      latitude: 0,
      longitude: 0,
    },
    onSubmit: async ({ value }) => {
      createIncident({
        data: value,
      })
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'Title is required'
              : value.length < 2
                ? 'Title must be at least 2 characters'
                : undefined,
        }}
      >
        {(field) => (
          <div>
            <label>Title</label>
            <input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="severity">
        {(field) => (
          <div>
            <label>Severity</label>
            <select
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(event.target.value as any)
              }
            >
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="category">
        {(field) => (
          <div>
            <label>Category</label>
            <select
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(event.target.value as any)
              }
            >
              <option value="DISASTER">Disaster</option>
              <option value="PROTEST">Protest</option>
              <option value="TRAFFIC">Traffic</option>
              <option value="CRIME">Crime</option>
              <option value="MEDICAL">Medical</option>
            </select>
          </div>
        )}
      </form.Field>

      <form.Field
        name="district"
        validators={{
          onChange: ({ value }) =>
            !value ? 'District is required' : undefined,
        }}
      >
        {(field) => (
          <div>
            <label>District</label>
            <input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field
        name="time"
        validators={{
          onChange: ({ value }) => (!value ? 'Time is required' : undefined),
        }}
      >
        {(field) => (
          <div>
            <label>Time</label>
            <input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field
        name="description"
        validators={{
          onChange: ({ value }) =>
            !value
              ? 'Description is required'
              : value.length < 5
                ? 'Description must be at least 5 characters'
                : undefined,
        }}
      >
        {(field) => (
          <div>
            <label>Description</label>
            <textarea
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="officers">
        {(field) => (
          <div>
            <label>Officers</label>
            <input
              type="number"
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
            />
          </div>
        )}
      </form.Field>

      <form.Field name="peopleAffected">
        {(field) => (
          <div>
            <label>People Affected</label>
            <input
              type="number"
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
            />
          </div>
        )}
      </form.Field>

      <form.Field name="latitude">
        {(field) => (
          <div>
            <label>Latitude</label>
            <input
              type="number"
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
            />
          </div>
        )}
      </form.Field>

      <form.Field name="longitude">
        {(field) => (
          <div>
            <label>Longitude</label>
            <input
              type="number"
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
            />
          </div>
        )}
      </form.Field>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Incident'}
      </button>
    </form>
  )
}
```

---

## Create Resource Form

### File: `src/components/forms/create-resource-form.tsx`

```tsx
import { useForm } from '@tanstack/react-form'
import { useCreateResource } from '../../hooks/use-resource'

export function CreateResourceForm() {
  const { mutate: createResource, isPending } = useCreateResource()

  const form = useForm({
    defaultValues: {
      name: '',
      type: 'UNIT',
      officers: 0,
      vehicle: '',
      status: 'AVAILABLE',
      assignedTo: null,
    },
    onSubmit: async ({ value }) => {
      createResource({
        data: value,
      })
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Resource name is required' : undefined,
        }}
      >
        {(field) => (
          <div>
            <label>Name</label>
            <input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="type">
        {(field) => (
          <div>
            <label>Type</label>
            <select
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(event.target.value as any)
              }
            >
              <option value="UNIT">Unit</option>
              <option value="VEHICLE">Vehicle</option>
              <option value="PERSONNEL">Personnel</option>
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="officers">
        {(field) => (
          <div>
            <label>Officers</label>
            <input
              type="number"
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
            />
          </div>
        )}
      </form.Field>

      <form.Field
        name="vehicle"
        validators={{
          onChange: ({ value }) =>
            !value ? 'Vehicle information is required' : undefined,
        }}
      >
        {(field) => (
          <div>
            <label>Vehicle</label>
            <input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </form.Field>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Resource'}
      </button>
    </form>
  )
}
```

---

# Real-time Updates

Real-time updates can be handled using TanStack Query `refetchInterval`.

This is not true WebSocket real-time, but it is simple and effective for dashboards.

---

## Incident List Auto Refresh

```typescript
export function useGetIncidents() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: getIncidents,
    refetchInterval: 30000,
  })
}
```

This means incidents are automatically refetched every 30 seconds.

---

## Resource List Auto Refresh

```typescript
export function useGetResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: getResources,
    refetchInterval: 30000,
  })
}
```

This keeps resource status updated.

---

## Province Status Auto Refresh

```typescript
export function useGetProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: getProvinces,
    refetchInterval: 30000,
  })
}
```

This keeps the province-level dashboard fresh.

---

## When to Use WebSocket Instead

Use polling with `refetchInterval` when:

- Updates every 10–30 seconds are enough
- Dashboard does not need instant updates
- Project needs simple implementation

Use WebSocket or SSE when:

- Incident status must update instantly
- Multiple users are collaborating live
- Resource dispatch changes must appear immediately
- Control room dashboard must be live

---

# Error Handling

Error handling should happen in three places:

1. Schema validation
2. Server function error handling
3. Hook-level UI feedback

---

## Schema-Level Errors

```typescript
export const createIncidentSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
})
```

This catches invalid input before Prisma runs.

---

## Server Function Errors

```typescript
export const getIncidentById = createServerFn({ method: 'GET' })
  .inputValidator((data) => getIncidentByIdSchema.parse(data))
  .handler(async ({ data }) => {
    const incident = await prisma.incident.findUnique({
      where: {
        id: data.id,
      },
    })

    if (!incident) {
      throw new Error('Incident not found')
    }

    return incident
  })
```

This catches database-level or business-level errors.

---

## Hook-Level Errors

```typescript
export function useCreateIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Incident created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
```

This gives feedback to the user.

---

## Component-Level Error Display

```tsx
function IncidentPage() {
  const { data, isLoading, error } = useGetIncidents()

  if (isLoading) {
    return <p>Loading incidents...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }

  return (
    <div>
      {data?.map((incident) => (
        <div key={incident.id}>{incident.title}</div>
      ))}
    </div>
  )
}
```

---

# Best Practices

## DOs

---

## 1. Keep Prisma Only Inside Server Functions

Good:

```typescript
export const getIncidents = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await prisma.incident.findMany()
  },
)
```

Bad:

```tsx
function IncidentPage() {
  const incidents = await prisma.incident.findMany()
}
```

Prisma should not run inside browser/client components.

---

## 2. Validate Before Database Query

Good:

```typescript
.inputValidator((data) => createIncidentSchema.parse(data))
```

Bad:

```typescript
.handler(async ({ data }) => {
  return await prisma.incident.create({ data })
})
```

Always validate form input before sending it to Prisma.

---

## 3. Use TanStack Query for Fetching and Mutations

Good:

```typescript
const { data, isLoading, error } = useGetIncidents()
```

Bad:

```typescript
useEffect(() => {
  getIncidents()
}, [])
```

TanStack Query gives caching, loading state, error state, and invalidation.

---

## 4. Invalidate Queries After Mutation

Good:

```typescript
queryClient.invalidateQueries({ queryKey: ['incidents'] })
```

This makes sure the UI shows fresh data after create, update, or delete.

---

## 5. Use Consistent Query Keys

Good:

```typescript
;['incidents'][('incident', id)]['resources']['provinces']
```

Bad:

```typescript
;['incident-list']['allIncidents']['data']
```

Consistent query keys make cache invalidation easier.

---

## 6. Keep Forms Dumb

Forms should only collect data and submit it.

Good:

```typescript
onSubmit: async ({ value }) => {
  createIncident({ data: value })
}
```

Bad:

```typescript
onSubmit: async ({ value }) => {
  await prisma.incident.create({ data: value })
}
```

Do not put database logic inside forms.

---

## 7. Keep Business Logic in Server Functions

Examples of business logic:

- Assigning resource should set status to `DEPLOYED`
- Releasing resource should set status to `AVAILABLE`
- Resolving an incident may release resources
- Province count may change when incidents change

This logic belongs in server functions, not components.

---

# DON'Ts

---

## 1. Do Not Import Prisma Into Client Components

Bad:

```typescript
import { prisma } from '../lib/prisma'
```

Do not do this inside React client components.

---

## 2. Do Not Trust Frontend Data

Bad:

```typescript
await prisma.incident.create({
  data,
})
```

Good:

```typescript
.inputValidator((data) => createIncidentSchema.parse(data))
```

Frontend validation is helpful, but server-side validation is required.

---

## 3. Do Not Forget Error Handling

Bad:

```typescript
const incident = await prisma.incident.findUnique({
  where: {
    id,
  },
})

return incident
```

Good:

```typescript
if (!incident) {
  throw new Error('Incident not found')
}
```

---

## 4. Do Not Overuse Refetch Interval

Bad:

```typescript
refetchInterval: 1000
```

This refetches every 1 second and can overload the database.

Better:

```typescript
refetchInterval: 30000
```

Use 30 seconds for normal dashboard updates.

---

# Quick Reference

## Recommended File Structure

```txt
src/
├── generated/
│   └── prisma/
├── lib/
│   ├── prisma.ts
│   ├── api-types.ts
│   ├── schema/
│   │   ├── incident.schema.ts
│   │   ├── incident-update.schema.ts
│   │   ├── resource.schema.ts
│   │   └── province.schema.ts
│   └── services/
│       ├── incident.services.ts
│       ├── incident-update.services.ts
│       ├── resource.services.ts
│       └── province.services.ts
├── hooks/
│   ├── use-incident.ts
│   ├── use-incident-update.ts
│   ├── use-resource.ts
│   └── use-province.ts
├── components/
│   └── forms/
│       ├── create-incident-form.tsx
│       ├── update-incident-form.tsx
│       ├── create-resource-form.tsx
│       └── create-province-form.tsx
└── routes/
    ├── incidents/
    ├── resources/
    └── dashboard/
```

---

## Common Flow

```txt
User fills TanStack Form
        ↓
Form calls custom hook mutation
        ↓
Hook calls server function
        ↓
Server function validates with Zod
        ↓
Server function uses Prisma
        ↓
Prisma writes to PostgreSQL
        ↓
TanStack Query invalidates cache
        ↓
UI updates automatically
```

---

## Example Full Flow

### Component

```tsx
const { mutate: createIncident } = useCreateIncident()

createIncident({
  data: {
    title: 'Flood in Bardiya',
    severity: 'CRITICAL',
    category: 'DISASTER',
    district: 'Bardiya',
    time: '09:00 AM',
    description: 'Flood reported near river-side settlement.',
    officers: 12,
    peopleAffected: 80,
    latitude: 28.3,
    longitude: 81.35,
  },
})
```

### Hook

```typescript
export function useCreateIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}
```

### Server Function

```typescript
export const createIncident = createServerFn({ method: 'POST' })
  .inputValidator((data) => createIncidentSchema.parse(data))
  .handler(async ({ data }) => {
    return await prisma.incident.create({
      data,
    })
  })
```

### Prisma

```typescript
await prisma.incident.create({
  data,
})
```

### Database

```txt
PostgreSQL stores the incident record.
```

---

# Summary

This project uses TanStack Start as a full-stack framework.

There is no Express API layer.

The correct architecture is:

```txt
TanStack Form
→ Custom Hook
→ TanStack Query
→ TanStack Start Server Function
→ Prisma
→ PostgreSQL
```

Prisma should only run inside server functions. Forms and components should never directly access the database. TanStack Form handles form state, Zod validates input, TanStack Query handles cache and mutations, and Prisma handles database operations.
