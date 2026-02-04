import { TutorService } from '~/business/services'
import {
  CreateTutorDto,
  TutorQueryDto,
  UpdateTutorDto
} from '~/business/interfaces'

export const createTutorFacade = (service = TutorService) => ({
  async getAllTutors(query?: TutorQueryDto) {
    return service.getTutors(query)
  },

  async getTutorWithId(id: number) {
    return service.getTutor(id)
  },

  async registerTutorWithPhoto(dto: CreateTutorDto) {
    const { foto, ...data } = dto
    const tutor = await service.createTutor(data)
    if (foto) await service.addPhoto(tutor.id, foto)
    return tutor
  },

  async updateTutor(id: number, dto: UpdateTutorDto) {
    return service.updateTutor(id, dto)
  },

  async removeTutorWithId(id: number) {
    return service.removeTutor(id)
  },

  async addTutorImage(id: number, file: File) {
    return service.addPhoto(id, file)
  },

  async removeTutorImage(id: number, photoId: number) {
    return service.removePhoto(id, photoId)
  },

  async addPetToTutor(id: number, petId: number) {
    return service.addPet(id, petId)
  },

  async removePetFromTutor(id: number, petId: number) {
    return service.removePet(id, petId)
  }
})
