import { apiClient } from '~/business/services'
import {
  CreateTutorDto,
  PagedResponseDto,
  PhotoDto,
  TutorDto,
  TutorQueryDto,
  UpdateTutorDto
} from '~/business/interfaces'

async function getTutors(
  query?: TutorQueryDto
): Promise<PagedResponseDto<TutorDto>> {
  const { data } = await apiClient.get('/v1/tutores', { params: query })
  return data
}

async function getTutor(tutorId: number): Promise<TutorDto> {
  const { data } = await apiClient.get(`/v1/tutores/${tutorId}`)
  return data
}

async function createTutor(tutorDto: CreateTutorDto): Promise<TutorDto> {
  const { data } = await apiClient.post('/v1/tutores', tutorDto)
  return data
}

async function updateTutor(
  tutorId: number,
  tutorDto: UpdateTutorDto
): Promise<TutorDto> {
  const { data } = await apiClient.put(`/v1/tutores/${tutorId}`, tutorDto)
  return data
}

async function removeTutor(tutorId: number): Promise<null> {
  await apiClient.delete(`/v1/tutores/${tutorId}`)
  return null
}

async function addPhoto(tutorId: number, file: File): Promise<PhotoDto> {
  const formData = new FormData()
  formData.set('foto', file)

  const { data } = await apiClient.post(
    `/v1/tutores/${tutorId}/fotos`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )

  return data
}

async function removePhoto(tutorId: number, photoId: number): Promise<null> {
  await apiClient.delete(`/v1/tutores/${tutorId}/fotos/${photoId}`)
  return null
}

export const TutorService = {
  getTutors,
  getTutor,
  createTutor,
  updateTutor,
  removeTutor,
  addPhoto,
  removePhoto
}
