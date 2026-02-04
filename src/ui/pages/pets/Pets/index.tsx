import React, { useEffect, useState } from 'react'
import { usePets } from '~/ui/hooks'
import InfiniteScroll from 'react-infinite-scroll-component'
import CardLink from '~/ui/components/CardLink'
import { Modal, ModalBody, ModalHeader } from 'flowbite-react'
import { useMatch, useNavigate } from 'react-router'
import Edit from '~/ui/pages/pets/Edit'

const defaultImage =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM30N3zx-WuIif4TVsJ-2qy_8GTWfYWOiyTQ&s'

const PetsPage: React.FC = () => {
  const match = useMatch('/pets/:petId')
  const [openEdit, setOpenEdit] = useState<boolean>(!!match)

  const { data, isLoading, isError, hasNextPage, fetchNextPage } = usePets({
    page: 0,
    size: 10
  })

  const navigate = useNavigate()

  useEffect(() => {
    setOpenEdit(!!match)
  }, [match])

  if (isLoading) {
    return <div>Carregando pets...</div>
  }

  if (isError) {
    return <div>Erro ao carregar pets...</div>
  }

  if (!data) {
    return <div>Nenhum dado carregado.</div>
  }

  const handleLoadMoreData = async () => {
    await fetchNextPage()
  }

  const goHome = () => {
    navigate('/pets')
  }

  return (
    <div className="p-4">
      <InfiniteScroll
        dataLength={data.length}
        next={handleLoadMoreData}
        hasMore={hasNextPage!}
        loader={<p>Carregando...</p>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {data!.map((pet) => (
            <CardLink
              key={pet.id}
              to={`/pets/${pet.id}`}
              imgSrc={pet.foto ? pet.foto.url : defaultImage}
            >
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
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
            </CardLink>
          ))}
        </div>
      </InfiniteScroll>

      {match?.params.petId && (
        <Edit
          petId={Number(match?.params.petId)}
          show={openEdit}
          onClose={goHome}
        />
      )}
    </div>
  )
}

export default PetsPage
