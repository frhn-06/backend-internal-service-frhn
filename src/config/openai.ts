import OpenAi from 'openai'
import { OPENAI_API_KEY } from '../utils/env.js'


const apiClient = new OpenAi({
    apiKey: OPENAI_API_KEY
})


export default apiClient