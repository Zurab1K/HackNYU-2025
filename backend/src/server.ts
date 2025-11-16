import 'dotenv/config'
import app from './app'

const PORT = Number(process.env.PORT) || 8000

app().listen(PORT, () => {
  console.log(`[server] running on http://localhost:${PORT}`)
})
