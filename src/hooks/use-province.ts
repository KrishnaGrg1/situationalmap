import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProvinces,
  createProvince,
  updateProvince,
} from '../lib/services/province.services'
import { transformProvince } from '../lib/transformers'
import { toast } from 'sonner'

export function useGetProvinces() {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const provinces = await getProvinces()
      return provinces.map(transformProvince)
    },
    refetchInterval: 30000,
  })
}

export function useCreateProvince() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof createProvince>[0]) =>
      createProvince(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provinces'] })
      toast.success('Province created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create province')
    },
  })
}

export function useUpdateProvince() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof updateProvince>[0]) =>
      updateProvince(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provinces'] })
      toast.success('Province updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update province')
    },
  })
}
