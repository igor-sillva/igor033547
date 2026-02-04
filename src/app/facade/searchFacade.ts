import { PetService, TutorService } from '~/business/services'
import { PetDto, TutorDto } from '~/business/interfaces'

export interface GlobalSearchResult {
  pets: PetDto[]
  tutors: TutorDto[]
}

export const createGlobalSearchFacade = (
  petService = PetService,
  tutorService = TutorService
) => ({
  async globalSearch(value: string) {
    const query = { nome: value, size: 30 }

    const results = await Promise.allSettled([
      petService.getPets(query),
      tutorService.getTutors(query)
    ])
    const [petsResult, tutorsResult] = results
    const pets =
      petsResult.status === 'fulfilled' ? petsResult.value.content : []
    const tutors =
      tutorsResult.status === 'fulfilled' ? tutorsResult.value.content : []

    return {
      pets,
      tutors
    }
  }
})
