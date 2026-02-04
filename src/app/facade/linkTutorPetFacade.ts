import { TutorPetService } from '~/business/services/tutorPetService'

export const createLinkTutorPetFacade = (service = TutorPetService) => ({
  async createLinkTutorToPet(tutorId: number, petId: number) {
    return service.createLinkTutorToPet(tutorId, petId)
  },

  async removeLinkTutorAndPet(tutorId: number, petId: number) {
    return service.removeLinkTutorAndPet(tutorId, petId)
  }
})
