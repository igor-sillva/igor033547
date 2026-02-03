import React from 'react'
import { usePets } from '~/ui/hooks'
import { Button, Card } from 'flowbite-react'
import { Link } from 'react-router'
import { chunkArray } from '~/utils'

import './style.css'

const defaultImage =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM30N3zx-WuIif4TVsJ-2qy_8GTWfYWOiyTQ&s'

const PetsPage: React.FC = () => {
  const { data, isLoading, isError, isFetching, hasNextPage, fetchNextPage } =
    usePets({ page: 0, size: 10 })

  if (isLoading) {
    return <div>Carregando pets...</div>
  }

  if (isError) {
    return <div>Erro ao carregar pets...</div>
  }

  const handleNextPage = async () => {
    if (hasNextPage) {
      await fetchNextPage()
    }
  }

  const pages = data?.pages?.flatMap((page) => page.content)
  const mansory = chunkArray(pages || [], 2)

  return (
    <div className="px-16 md:px-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {mansory.map((pets, index) => (
          <div className="grid gap-4" key={`pets-${index}`}>
            {pets.map((pet) => (
              <Link key={pet.id} to={`/pets/${pet.id}`} className="card-link">
                <Card
                  className="rounded-base"
                  renderImage={() => (
                    <div
                      className="card-image rounded-base h-auto max-w-full"
                      style={{
                        backgroundImage: `url(${
                          pet.foto ? pet.foto.url : defaultImage
                        })`
                      }}
                    />
                  )}
                >
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900">
                    {pet.nome}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    <span className="block max-w-[128px] overflow-hidden text-ellipsis">
                      <b>Raça</b>: {pet.raca}
                    </span>
                    <span className="block max-w-[128px] overflow-hidden text-ellipsis">
                      <b>Idade</b>: {pet.idade}
                    </span>
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <Button disabled={isFetching} onClick={handleNextPage}>
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  )
}

export default PetsPage
