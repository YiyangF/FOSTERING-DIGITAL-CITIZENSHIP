import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv';

dotenv.config();
const app = express()
const port = process.env.PORT || 3000

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

app.use(cors())
app.use(express.json())

app.post('/generate-report', async (req, res) => {
  try {
    const { recipient, platform, date, incidentTypes, notes } = req.body

    if (!recipient || !platform || !date) {
      return res.status(400).json({ error: 'Missing required fields: recipient, platform, or date.' })
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-pro' })

    const prompt = `
Please generate a professional and empathetic incident report notification based on the following details:

- Recipient: ${recipient}
- Platform Involved: ${platform}
- Type(s) of Incident: ${incidentTypes?.join(', ') || 'N/A'}
- Date of Incident: ${date}
- Additional Notes: ${notes || 'None'}

Format it as a short report suitable for sending to a school or authority figure and keep the response brief (max 100 words), concise, and emotionally supportive.
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return res.json({ result: text })
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
