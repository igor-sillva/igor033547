import { apiClient } from '~/business/services/apiClient'
import {
  CreatePetDto,
  PagedResponseDto,
  PetDto,
  PetQueryDto,
  PhotoDto,
  UpdatePetDto
} from '~/business/interfaces'

async function getPets(query?: PetQueryDto): Promise<PagedResponseDto<PetDto>> {
  const { data } = await apiClient.get('/v1/pets', { params: query })
  return data
}

async function getPet(petId: number): Promise<PetDto> {
  const { data } = await apiClient.get(`/v1/pets/${petId}`)
  return data
}

async function createPet(petDto: CreatePetDto): Promise<PetDto> {
  const { data } = await apiClient.post('/v1/pets', petDto)
  return data
}

async function updatePet(petId: number, petDto: UpdatePetDto): Promise<PetDto> {
  const { data } = await apiClient.put(`/v1/pets/${petId}`, petDto)
  return data
}

async function removePet(petId: number): Promise<null> {
  await apiClient.delete(`/v1/pets/${petId}`)
  return null
}

async function addPhoto(petId: number, file: Blob): Promise<PhotoDto> {
  const formData = new FormData()
  formData.set('foto', file)

  const { data } = await apiClient.post(`/v1/pets/${petId}/fotos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return data
}

async function removePhoto(petId: number, photoId: number): Promise<null> {
  await apiClient.delete(`/v1/pets/${petId}/fotos/${photoId}`)
  return null
}

export const PetService = {
  getPets,
  getPet,
  createPet,
  updatePet,
  removePet,
  addPhoto,
  removePhoto
}
