import React from 'react'
import { Link } from 'react-router-dom' 


const FooterSocialMedia = () => {
    return (
        <div className='f3 col-12 col-lg-2 m-0'>
            <ul className='list-unstyled d-flex justify-content-center justify-content-lg-evenly'>
                <li className='me-4'>
                    <Link to='https://discord.gg/XmTKMYnq' target='_blank' data-bs-toggle="tooltip" data-bs-title="Discord">
                        <i className="bi bi-discord"></i>
                    </Link>
                </li>
                <li className='me-4'>
                    <Link to='https://github.com/techiescamp/pomodoro-microservice' target='_blank' data-bs-toggle="tooltip" data-bs-title="GitHub">
                        <i className="bi bi-github"></i>
                    </Link>
                </li>
                <li className='me-4'>
                    <Link to='https://www.linkedin.com/company/crunchops/' target='_blank' data-bs-toggle="tooltip" data-bs-title="LinkedIn">
                        <i className="bi bi-linkedin"></i>
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default FooterSocialMedia