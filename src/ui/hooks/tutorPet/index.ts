import { useMutation, useQueryClient } from 'react-query'
import { createLinkTutorPetFacade } from '~/app/facade/linkTutorPetFacade'

const facade = createLinkTutorPetFacade()

export function useCreateLinkTutorToPet(tutorId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tutors', tutorId, 'add-pet'],
    mutationFn: (petId: number) => facade.createLinkTutorToPet(tutorId, petId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tutors', tutorId])
    }
  })
}

export function useRemoveLinkTutorAndPet(tutorId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['tutors', tutorId, 'remove-pet'],
    mutationFn: (petId: number) => facade.removeLinkTutorAndPet(tutorId, petId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tutors', tutorId])
    }
  })
}
