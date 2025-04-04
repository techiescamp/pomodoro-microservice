import React from 'react'
import { NavLink } from 'react-router-dom'
import Title from '../../assets/data/sidebar.json'

const Sidebar = () => {
    const { data } = Title

    return (
        <ul>
            {data && data.map((section, index) => {
                const sectionTitle = Object.keys(section)[0]
                const sectionLinks = section[sectionTitle]

                return (
                    <li key={sectionTitle} className='mb-3 list-style-none'>
                        <strong>{sectionTitle}</strong>
                        <ul className='nav flex-column mt-1'>
                            {sectionLinks.map(link => (
                                <li key={link.slug} className='nav-item'>
                                    <NavLink to={`/doc/${link.slug}`} className="nav-link text-dark">
                                        {link.title}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </li>
                )
            }
            )}
        </ul>
    )
}

export default Sidebar