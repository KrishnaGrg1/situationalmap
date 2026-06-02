import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createIncidentUpdate,
  deleteIncidentUpdate,
} from '../lib/services/incident-update.services'
import { toast } from 'sonner'

export function useCreateIncidentUpdate(incidentId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof createIncidentUpdate>[0]) =>
      createIncidentUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] })
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      toast.success('Update added successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add update')
    },
  })
}

export function useDeleteIncidentUpdate(incidentId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof deleteIncidentUpdate>[0]) =>
      deleteIncidentUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident', incidentId] })
      toast.success('Update deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete update')
    },
  })
}
