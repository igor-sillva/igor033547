import {
  CreateTutorDto,
  TutorQueryDto,
  UpdatePetDto
} from '~/business/interfaces'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query'
import { createTutorFacade } from '~/app/facade'

const facade = createTutorFacade()

export function useTutors(query?: TutorQueryDto) {
  const { data, ...other } = useInfiniteQuery({
    queryKey: ['tutors', query?.page, query],
    queryFn: ({ pageParam }) =>
      facade.getAllTutors({
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

export function useTutor(id: number) {
  return useQuery({
    queryKey: ['tutors', id],
    queryFn: () => facade.getTutorWithId(id),
    enabled: Boolean(id)
  })
}

export function useCreateTutor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tutors', 'create'],
    mutationFn: (dto: CreateTutorDto) => facade.registerTutorWithPhoto(dto),
    onSuccess: () => {
      queryClient.invalidateQueries(['tutors'])
    }
  })
}

export function useUpdateTutor(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['pet', id, 'update'],
    mutationFn: (dto: UpdatePetDto) => facade.updateTutor(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries(['tutors', id])
    }
  })
}

export function useRemoveTutor(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tutors', id, 'remove'],
    mutationFn: () => facade.removeTutorWithId(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tutors'])
      queryClient.invalidateQueries(['tutors', id])
    }
  })
}

export function useAddTutorImage(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tutors', id, 'add-image'],
    mutationFn: (file: File) => facade.addTutorImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries(['tutors', id])
    }
  })
}

export function useRemoveTutorImage(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tutors', id, 'remove-image'],
    mutationFn: (photoId: number) => facade.removeTutorImage(id, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tutors', id])
    }
  })
}
