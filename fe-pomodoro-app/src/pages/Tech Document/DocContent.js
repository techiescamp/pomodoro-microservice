import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import axios from 'axios'
import PropTypes from 'prop-types'

const CodeBlock = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const DocContent = () => {
  const { slug } = useParams();
  const [selectedDoc, setSelectedDoc] = useState(null)

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = slug ? await axios.get(`http://localhost:7000/doc/${slug}`) : setSelectedDoc({ content: 'None of the data is written for this topic.' })
        setSelectedDoc(res.data)
      } catch(err) {
        setSelectedDoc({ content: 'Oops server is not connected. Please wait for sometime' })
      }
      
    }
    fetchDoc()
  }, [slug])

  return (
    <>
      {slug ?
      (<ReactMarkdown
        components={{
          code: CodeBlock,
        }}
      >
        {selectedDoc && selectedDoc.content}
      </ReactMarkdown>)
    :
    <div>
      <h2>Welcome to the Documentation</h2>
      <p>
        This is the starting point for exploring our comprehensive documentation.
      </p>
      <p>
        Here, you'll find all the information you need to get started, understand the system, and make the most of its features.
      </p>
      <p>
        Whether you're a beginner or an advanced user, this documentation is designed to guide you through every step of the process.
      </p>
      <p>
        Use the sidebar on the left to navigate through different sections, such as the introduction, API details, or troubleshooting guides.
      </p>
      <p>
        We’ve structured this resource to be clear, concise, and easy to follow, ensuring you can quickly find what you’re looking for.
      </p>
      <p>
        If you have any questions or need further assistance, feel free to reach out through the support channels listed in the settings section.
      </p>
    </div>
  }
  </>
  )
}

CodeBlock.propTypes = {
  inline: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};


export default DocContent