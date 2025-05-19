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
    As a concerned parent, please generate a brief, empathetic incident report (under 200 words) based on the following:

    Recipient: ${recipient}
    
    Platform: ${platform}
    
    Type(s) of Incident: ${incidentTypes?.join(', ') || 'N/A'}
    
    Date: ${date}
    
    Notes: ${notes || 'None'}
    
    The tone should be respectful, emotionally supportive, and suitable for reporting to a school, police, or social platform moderation team.
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
