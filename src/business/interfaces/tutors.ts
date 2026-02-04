import { PaginationQueryDto, PetDto, PhotoDto } from '~/business/interfaces'

export interface TutorDto {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: string
  foto: PhotoDto
  pets?: PetDto[]
}

export interface TutorQueryDto extends PaginationQueryDto {
  nome?: string
}

export interface CreateTutorDto {
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: string
  foto?: File
}

export interface UpdateTutorDto extends Partial<CreateTutorDto> {}
