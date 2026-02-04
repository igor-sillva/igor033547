import React, { useEffect, useState } from 'react'
import { useTutors } from '~/ui/hooks'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Avatar, Card } from 'flowbite-react'
import { Link, useMatch, useNavigate } from 'react-router'
import { HiChevronRight } from 'react-icons/hi'
import Edit from '~/ui/pages/tutors/Edit'

const defaultImage =
  'https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png?20170228190511'

const Tutors: React.FC = () => {
  const match = useMatch('/tutores/:tutorId')
  const [openEdit, setOpenEdit] = useState<boolean>(!!match)

  const navigate = useNavigate()

  const { data, isLoading, isError, hasNextPage, fetchNextPage } = useTutors({
    page: 0,
    size: 10
  })

  useEffect(() => {
    setOpenEdit(!!match)
  }, [match])

  if (isLoading) {
    return <div>Carregando tutores...</div>
  }

  if (isError) {
    return <div>Erro ao carregar tutores...</div>
  }

  if (!data) {
    return <div>Nenhum dado carregado.</div>
  }

  const handleLoadMoreData = async () => {
    await fetchNextPage()
  }

  const goHome = () => {
    navigate('/tutores')
  }

  return (
    <div className="p-4">
      <Card className="md:col-span-2">
        <InfiniteScroll
          dataLength={data.length}
          next={handleLoadMoreData}
          hasMore={hasNextPage!}
          loader={<p>Carregando...</p>}
        >
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {data!.map((tutor) => (
                <li className="py-3 sm:py-4" key={`tutor-${tutor.id}`}>
                  <Link to={`/tutores/${tutor.id}`}>
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0">
                        <Avatar
                          img={tutor.foto?.url}
                          placeholderInitials={
                            !tutor.foto ? tutor.nome.charAt(0) : undefined
                          }
                          bordered
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {tutor.nome}
                        </p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {tutor.email}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        <HiChevronRight />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </InfiniteScroll>
      </Card>

      {match?.params?.tutorId && (
        <Edit
          tutorId={Number(match.params.tutorId)}
          show={openEdit}
          onClose={goHome}
        />
      )}
    </div>
  )
}

export default Tutors
