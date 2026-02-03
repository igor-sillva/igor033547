import { CreatePetDto, PetQueryDto, UpdatePetDto } from '~/business/interfaces'
import { PetService } from '~/business/services'

export const createPetsFacade = (service = PetService) => ({
  async getAllPets(query?: PetQueryDto) {
    return service.getPets(query)
  },

  async getPetsWithRaca(race: string) {
    return service.getPets({ raca: race })
  },

  async getPetsWithName(name: string) {
    return service.getPets({ nome: name })
  },

  async getPetWithId(id: number) {
    return service.getPet(id)
  },

  async registerPetWithPhoto(dto: CreatePetDto, photo?: Blob) {
    const pet = await service.createPet(dto)
    if (photo) await service.addPhoto(pet.id, photo)
    return pet
  },

  async updatePet(id: number, dto: UpdatePetDto) {
    return service.updatePet(id, dto)
  },

  async updatePetName(id: number, newName: string) {
    return service.updatePet(id, { nome: newName })
  },

  async updatePetRace(id: number, newRace: string) {
    return service.updatePet(id, { raca: newRace })
  },

  async updatePetAge(id: number, newAge: number) {
    return service.updatePet(id, { idade: newAge })
  },

  async removePetWithId(id: number) {
    return service.removePet(id)
  },

  async removePetImage(id: number, photoId: number) {
    return service.removePhoto(id, photoId)
  }
})
