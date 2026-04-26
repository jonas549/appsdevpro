import "dotenv/config"
import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth"
import contentRoutes from "./routes/content"
import blogRoutes from "./routes/blog"

const app = express()
const PORT = parseInt(process.env.API_PORT || "3001")

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173"],
  credentials: true,
}))
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/content", contentRoutes)
app.use("/api/blog", blogRoutes)

app.listen(PORT, () => {
  console.log(`API server → http://localhost:${PORT}`)
})
