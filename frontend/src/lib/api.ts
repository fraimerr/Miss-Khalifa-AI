import axios from 'axios'

const getSessions = async (sessionId: string) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/sessions/${sessionId}`
    )
    return response.data.sessions
  } catch (error) {
    console.error('Error fetching sessions:', error)
  }
}
