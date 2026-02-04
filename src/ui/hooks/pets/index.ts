import { createPetsFacade } from '~/app/facade'
import { CreatePetDto, PetQueryDto, UpdatePetDto } from '~/business/interfaces'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'

const facade = createPetsFacade()

export function usePets(query?: PetQueryDto) {
  const { data, ...other } = useInfiniteQuery({
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

  const flatData = data?.pages?.flatMap((page) => page.content)

  return { data: flatData, ...other }
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
    mutationFn: (dto: CreatePetDto) => facade.registerPetWithPhoto(dto),
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
      queryClient.invalidateQueries(['pets', id])
    }
  })
}

type UpdatePetAndChangePhotoVariables = {
  oldPhotoId: number
  newPhoto: File
  dto: UpdatePetDto
}
export function useUpdatePetAndChangePhoto(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pet', id, 'update', 'w-photo'],
    mutationFn: async (variables: UpdatePetAndChangePhotoVariables) => {
      const { oldPhotoId, newPhoto, dto } = variables
      await facade.updatePetWithPhoto(id, dto, oldPhotoId, newPhoto)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pets', id])
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
      queryClient.invalidateQueries(['pets', id])
    }
  })
}

export function useAddPetImage(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pet', id, 'add-image'],
    mutationFn: (file: File) => facade.addPetImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries(['pets', id])
    }
  })
}

export function useRemovePetImage(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pet', id, 'remove-image'],
    mutationFn: (photoId: number) => facade.removePetImage(id, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pets', id])
    }
  })
}

export function useAddTutorToPet(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pet', id, 'add-tutor'],
    mutationFn: (petId: number) => facade.addTutorToPet(id, petId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pets', id])
    }
  })
}

export function useRemoveTutorFromPet(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pet', id, 'remove-tutor'],
    mutationFn: (petId: number) => facade.removeTutorFromPet(id, petId),
    onSuccess: () => {
      queryClient.invalidateQueries(['pets', id])
    }
  })
}
