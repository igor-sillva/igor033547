import React from 'react'
import { Card, CardProps } from 'flowbite-react'

import './style.css'
import { Link, LinkProps } from 'react-router'

type CardLinkProps = LinkProps & CardProps

const CardLink: React.FC<CardLinkProps> = ({
  to,
  imgSrc,
  horizontal,
  onClick,
  children
}) => {
  return (
    <Link className="card-link" to={to}>
      <Card
        className="card-with-image rounded-base"
        horizontal={horizontal}
        renderImage={() => (
          <div
            className="card-image rounded-base h-auto max-w-full"
            style={{
              backgroundImage: `url(${imgSrc})`
            }}
          />
        )}
        onClick={onClick}
      >
        {children}
      </Card>
    </Link>
  )
}

export default CardLink
