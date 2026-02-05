import { PaginationQueryDto, PhotoDto, TutorDto } from '~/business/interfaces'

export interface PetDto {
  id: number
  nome: string
  raca: string
  idade: number
  foto: PhotoDto | null
  tutores?: TutorDto[]
}

export interface PetQueryDto extends PaginationQueryDto {
  nome?: string
  raca?: string
}

export interface CreatePetDto {
  nome: string
  raca: string
  idade: number
  foto?: File
}

export interface UpdatePetDto extends Partial<CreatePetDto> {}
