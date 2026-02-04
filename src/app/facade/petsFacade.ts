import {
  CreatePetDto,
  PaginationQueryDto,
  PetQueryDto,
  UpdatePetDto
} from '~/business/interfaces'
import { PetService } from '~/business/services'

export const createPetsFacade = (service = PetService) => ({
  async getAllPets(query?: PetQueryDto) {
    return service.getPets(query)
  },

  async getPetsWithName(name: string, pagination?: PaginationQueryDto) {
    return service.getPets({ nome: name, ...pagination })
  },

  async getPetWithId(id: number) {
    return service.getPet(id)
  },

  async registerPetWithPhoto(dto: CreatePetDto) {
    const { foto, ...data } = dto
    const pet = await service.createPet(data)
    if (foto) await service.addPhoto(pet.id, foto)
    return pet
  },

  async updatePet(id: number, dto: UpdatePetDto) {
    return service.updatePet(id, dto)
  },

  async updatePetWithPhoto(
    id: number,
    dto: UpdatePetDto,
    oldPhotoId?: number,
    newPhoto?: File
  ) {
    const petUpdated = await service.updatePet(id, dto)
    if (newPhoto) {
      if (oldPhotoId) await service.removePhoto(id, oldPhotoId)
      await service.addPhoto(id, newPhoto)
    }
    return petUpdated
  },

  async removePetWithId(id: number) {
    return service.removePet(id)
  },

  async addPetImage(id: number, file: File) {
    return service.addPhoto(id, file)
  },

  async removePetImage(id: number, photoId: number) {
    return service.removePhoto(id, photoId)
  }
})
