import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
} from '../lib/services/incident.services'
import { transformIncident } from '../lib/transformers'
import { toast } from 'sonner'

export function useGetIncidents() {
  return useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const incidents = await getIncidents()
      return incidents.map(transformIncident)
    },
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
    mutationFn: (data: Parameters<typeof createIncident>[0]) => createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['provinces'] })
      toast.success('Incident created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create incident')
    },
  })
}

export function useUpdateIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof updateIncident>[0]) => updateIncident(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['incident', data.id] })
      toast.success('Incident updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update incident')
    },
  })
}

export function useDeleteIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof deleteIncident>[0]) => deleteIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['provinces'] })
      toast.success('Incident deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete incident')
    },
  })
}
