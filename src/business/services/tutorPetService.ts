import { apiClient } from '~/business/services'

async function createLinkTutorToPet(
  tutorId: number,
  petId: number
): Promise<null> {
  await apiClient.post(`/v1/tutores/${tutorId}/pets/${petId}`)
  return null
}

async function removeLinkTutorAndPet(
  tutorId: number,
  petId: number
): Promise<null> {
  await apiClient.delete(`/v1/tutores/${tutorId}/pets/${petId}`)
  return null
}

export const TutorPetService = {
  createLinkTutorToPet,
  removeLinkTutorAndPet
}
