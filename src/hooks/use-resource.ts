import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getResources,
  createResource,
  updateResource,
  assignResourceToIncident,
  releaseResource,
} from '../lib/services/resource.services'
import { transformResource } from '../lib/transformers'
import { toast } from 'sonner'

export function useGetResources() {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const resources = await getResources()
      return resources.map(transformResource)
    },
    refetchInterval: 30000,
  })
}

export function useCreateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof createResource>[0]) =>
      createResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      toast.success('Resource created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create resource')
    },
  })
}

export function useUpdateResource() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof updateResource>[0]) =>
      updateResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Resource updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update resource')
    },
  })
}

export function useAssignResourceToIncident(incidentId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof assignResourceToIncident>[0]) =>
      assignResourceToIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] })
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Resource assigned successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign resource')
    },
  })
}

export function useReleaseResource(incidentId?: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof releaseResource>[0]) =>
      releaseResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })

      if (incidentId) {
        queryClient.invalidateQueries({ queryKey: ['incident', incidentId] })
      }

      toast.success('Resource released successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to release resource')
    },
  })
}
