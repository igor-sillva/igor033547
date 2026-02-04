import React, { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import {
  Button,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle
} from 'flowbite-react'
import { HiOutlineSearch } from 'react-icons/hi'
import GlobalSearchModal from '~/ui/pages/search/GlobalSearchModal'

const DefaultLayout: React.FC = () => {
  const location = useLocation()

  const [openGlobalSearch, setOpenGlobalSearch] = useState<boolean>(false)

  return (
    <div>
      <Navbar fluid>
        <div className="flex gap-2 md:order-2">
          <Button color="alternative" onClick={() => setOpenGlobalSearch(true)}>
            <HiOutlineSearch className="mr-2 size-5" />
            Pesquisar
          </Button>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink active={location.pathname.includes('pets')}>
            <Link to="/pets">Pets</Link>
          </NavbarLink>
          <NavbarLink active={location.pathname.includes('tutores')}>
            <Link to="/tutores">Tutores</Link>
          </NavbarLink>

          <NavbarLink active={location.pathname.includes('pets/registrar')}>
            <Link to="/pets/registrar">Registrar Pet</Link>
          </NavbarLink>

          <NavbarLink active={location.pathname.includes('tutores/registrar')}>
            <Link to="/tutores/registrar">Registrar Tutor</Link>
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <div>
        <Outlet />
      </div>

      <GlobalSearchModal
        show={openGlobalSearch}
        onClose={() => setOpenGlobalSearch(false)}
      />
    </div>
  )
}

export default DefaultLayout
