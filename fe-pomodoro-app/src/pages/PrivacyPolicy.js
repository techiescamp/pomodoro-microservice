import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className='container-fluid w-75 my-3 mx-auto px-5 py-2'>
        <h1 className='page-title'>Privacy Policy for Pomodoro App</h1>
        <h6 className='small mb-4'>&copy;Techiescamp 2025 </h6>

        <h4 className='mb-2'><b>Effective Date:</b> [1 Feb 2025]</h4>

        <ol>
            <li className='ordered-list'>
                <h4>Introduction</h4>
                <p>Welcome to the Pomodoro App by TechiesCamp. Your privacy is important to us. This Privacy Policy outlines the types of personal information we collect, how we use and protect it, and your rights regarding your data.</p>
            </li>

            <li className='ordered-list'>
                <h4>Information We Collect</h4>
                <p>We collect the following types of information:</p>
                <ul>
                    <li className='ordered-list'>
                        <b>Personal Information:</b> When you sign up, we may collect your name, email address, and other relevant details.
                    </li>
                    <li className='ordered-list'>
                        <b>Usage Data:</b> Information on how you use the app, such as session duration, task completion rates, and preferences.
                    </li>
                    <li className='ordered-list'>
                        <b>Device Information:</b> We may collect details such as IP address, browser type, operating system, and device identifiers.
                    </li>
                </ul>
            </li>

            <li className='ordered-list'>
                <h4>How We Use Your Information</h4>
                <p>We use your information to:</p>
                <ul>
                    <li className='ordered-list'>
                        <b>To improve customer service: </b> Information you provide helps us respond to your customer service requests and support needs more efficiently.
                    </li>
                    <li className='ordered-list'>
                        <b>To personalize user experience: </b> We may use information in the aggregate to understand how our users as a group use the services and resources provided in our application.
                    </li>
                    <li className='ordered-list'>
                        <b>To send periodic emails: </b> We may use your email addresses to send users information and updates pertaining to their order. User email addresses may also be used to respond to customer inquiries, questions, or other requests.
                    </li>
                </ul>
            </li>

            <li className='ordered-list'>
                <h4>Data Sharing & Third-Party Services</h4>
                <p>
                    We do not sell your personal data. However, we may share your information with: 
                    <p><i>Service Providers:</i> Third-party tools for analytics, hosting, and communication </p> 
                    <p><i>Legal Compliance:</i> If required by law or to protect our rights and users. </p>
                </p>
            </li>

            <li className='ordered-list'>
                <h4>Data Security</h4>
                <p>
                    We implement industry-standard security measures to protect your information. 
                    However, no online service can guarantee absolute security
                </p>
            </li>

            <li className='ordered-list'>
                <h4>Your Rights & Choices</h4>
                <ul>
                    <li className='ordered-list'>
                        <b>Access & Update:</b> You can review and update your personal information in the app settings.
                    </li>
                    <li className='ordered-list'>
                        <b>Data Deletion:</b> You may request the deletion of your data by contacting us.
                    </li>
                    <li className='ordered-list'>
                        <b>Opt-Out:</b> You can unsubscribe from promotional emails at any time.
                    </li>
                </ul>
            </li>

            <li className='ordered-list'>
                <h4>Third-Party Links</h4>
                <p>Our app may contain links to third-party websites. We are not responsible for their privacy policies or practices.</p>
            </li>

            <li className='ordered-list'>
                <h4>Changes to This Policy</h4>
                <p>We may update this Privacy Policy from time to time. Changes will be posted in the app with an updated effective date.</p>
            </li>

            <li className='ordered-list'>
                <h4>Your acceptance of these terms</h4>
                <p>
                    By enrolling in the School, you signify your acceptance of this Privacy Policy. 
                    If you do not agree to this Privacy Policy, please do not login or subscribe to our application. 
                    Your continued subscription or login in the application following the posting of changes to this Privacy Policy will be deemed your acceptance of those changes.
                </p>
            </li>
        </ol>
    </div>
  )
}

export default PrivacyPolicy