import React from 'react'

const Disclaimer = () => {
  return (
    <div className='container-fluid w-75 my-3 mx-auto px-5 py-2'>
      <h1 className='page-ttile'>Disclaimer for Pomodoro App - TechiesCamp</h1>
      <h6 className='small mb-4'>&copy; Techiescamp 2025</h6>

      <h4 className='mb-2'><b>Effective Date::</b> [1 Feb 2025]</h4>

      <ol>
        <li className='ordered-list'>
          <h4>General Information</h4>
          <p>The Pomodoro App by TechiesCamp is designed to enhance productivity and time management. While we strive to provide accurate and effective tools, we do not guarantee specific results from using the app.   </p>
        </li>

        <li className='ordered-list'>
          <h4>No Professional Advice</h4>
          <p>The app is intended for general productivity purposes and does not constitute medical, psychological, or professional advice. Users should consult qualified professionals for specific concerns.</p>
        </li>

        <li className='ordered-list'>
          <h4>Limitation of Liability</h4>
          <p>TechiesCamp is not responsible for any direct, indirect, incidental, or consequential damages arising from the use of the Pomodoro App. Users assume all risks associated with using the app.</p>
        </li>

        <li className='ordered-list'>
          <h4>No Warranties</h4>
          <p>The app is provided "as is" without any warranties, express or implied. We do not guarantee uninterrupted, error-free service or that the app will meet all user expectations.          </p>
        </li>

        <li className='ordered-list'>
          <h4>User Responsibility</h4>
          <p>
          Users are responsible for their own time management, productivity, and well-being. The app is a tool to assist users but does not replace personal accountability.
          </p>
        </li>

        <li className='ordered-list'>
          <h4>External Links & Third-Party Services</h4>
          <p>
          The app may contain links to third-party services. We do not endorse or take responsibility for the content, policies, or practices of external sites.
          </p>
        </li>
        
        <li className='ordered-list'>
          <h4>Changes to Disclaimer</h4>
          <p>
          We reserve the right to modify this disclaimer at any time. Updates will be posted within the app.
          </p>
        </li>
        
      </ol>
    </div>
  )
}

export default Disclaimer