import React from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import {
  Button,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle
} from 'flowbite-react'
import { HiOutlineSearch } from 'react-icons/hi'

const DefaultLayout: React.FC = () => {
  const location = useLocation()

  return (
    <div>
      <Navbar fluid>
        <div className="flex gap-2 md:order-2">
          <Button color="alternative">
            <HiOutlineSearch className="mr-2 size-5" />
            Pesquisar
          </Button>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink
            as={Link}
            to="/pets"
            active={location.pathname.includes('pets')}
          >
            Pets
          </NavbarLink>
          <NavbarLink
            as={Link}
            to="/tutores"
            active={location.pathname.includes('tutores')}
          >
            Tutores
          </NavbarLink>

          <NavbarLink
            as={Link}
            to="/pets/registrar"
            active={location.pathname.includes('pets/registrar')}
          >
            Registrar Pets
          </NavbarLink>

          <NavbarLink
            as={Link}
            to="/tutores/registrar"
            active={location.pathname.includes('tutores/registrar')}
          >
            Registrar Tutores
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>

      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default DefaultLayout
