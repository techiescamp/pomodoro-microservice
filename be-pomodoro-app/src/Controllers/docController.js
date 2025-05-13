const fs = require('fs').promises
const metrics = require('../Observability/metrics')
const path = require('path')

const docsDirectory = path.join(__dirname, '../docs')

const getSidebarTitles = async (req, res) => {
    try {
        const files = await fs.readdir(docsDirectory) // gets file names in 'docs/' folder
        const docs = files.map(file => ({
            title: file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            slug: file.replace('.md', ' ')
        }))
        res.json(docs)
    } 
    catch(err) {
        res.status(500).json({error: 'server error'})
    }
}

// get specific doc by slug
const getDoc = async(req, res) => {
    const { slug } = req.params
    try {
        const filePath = path.join(docsDirectory, `${slug}.md`)
        const content = await fs.readFile(filePath, 'utf8')
        metrics.httpRequestCounter.inc()
        metrics.documentPageClick.inc()
        return res.json({title: req.params.slug, content})
    } catch(err) {
        res.status(500).json({error: "doc not found"})
    }
}


module.exports = {
    getSidebarTitles,
    getDoc
}
