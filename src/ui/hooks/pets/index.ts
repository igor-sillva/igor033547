import { createPetsFacade } from '~/app/facade/petsFacade'
import { CreatePetDto, PetQueryDto, UpdatePetDto } from '~/business/interfaces'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'

const facade = createPetsFacade()

export function usePets(query?: PetQueryDto) {
  return useInfiniteQuery({
    queryKey: ['pets', query?.page, query],
    queryFn: ({ pageParam }) =>
      facade.getAllPets({
        ...query,
        page: pageParam
      }),
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.flatMap((page) => page.content).length

      if (totalLoaded === lastPage.total) return undefined

      return lastPage.page + 1
    }
  })
}

export function usePet(id: number) {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: () => facade.getPetWithId(id),
    enabled: Boolean(id)
  })
}

export function useCreatePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pets', 'create'],
    mutationFn: (dto: CreatePetDto, photo?: Blob) =>
      facade.registerPetWithPhoto(dto, photo),
    onSuccess: () => {
      queryClient.invalidateQueries(['pets'])
    }
  })
}

export function useUpdatePet(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pet', id, 'update'],
    mutationFn: (dto: UpdatePetDto) => facade.updatePet(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries(['pets'])
    }
  })
}

export function useRemovePet(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pet', id, 'remove'],
    mutationFn: () => facade.removePetWithId(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['pets'])
    }
  })
}

export function useRemovePetImage(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pet', id, 'remove-image'],
    mutationFn: (photoId: number) => facade.removePetImage(id, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pets'])
    }
  })
}
