import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 4173)
const REGRESSION = process.env.LENSQA_REGRESSION === '1'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`)
  let filePath = url.pathname === '/' ? '/index.html' : url.pathname
  if (filePath === '/cart') filePath = '/cart.html'
  if (filePath === '/checkout') filePath = '/checkout.html'
  if (filePath === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, regression: REGRESSION }))
    return
  }

  const abs = path.join(__dirname, 'public', filePath)
  if (!abs.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  fs.readFile(abs, (err, data) => {
    if (err) {
      res.writeHead(404)
      res.end('Not found')
      return
    }
    const ext = path.extname(abs)
    let body = data
    if (ext === '.html' || ext === '.css') {
      let text = data.toString('utf8')
      if (REGRESSION) text = text.replaceAll('data-lensqa-ok', 'data-lensqa-broken')
      body = Buffer.from(text, 'utf8')
    }
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream' })
    res.end(body)
  })
})

server.listen(PORT, () => {
  console.log(`demo-store http://localhost:${PORT} regression=${REGRESSION}`)
})
