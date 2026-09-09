import apiClient from "../config/openai.js";
import { ITicket } from "../types/ticket.js";

const AiService = {
    generateReply: async (data: ITicket) => {
        try {
            const messages = data.messages.map((message) => {
                return `${message.sender.name} : ${message.content}`;
            }).join("\n");

            const prompt = 
            `Kamu adalah AI assistant untuk Agent IT HelpDesk Internal Service.

            Bantu Agent membuat draft balasan kepada Employee berdasarkan ticket dan riwayat percakapan berikut.

            Ticket:
            Judul: ${data.title}
            Deskripsi: ${data.description}

            Riwayat percakapan:
            ${messages}

            Buat balasan yang:
            - sopan
            - profesional
            - mudah dipahami
            - sesuai konteks percakapan
            - jangan mengarang informasi teknis yang tidak tersedia
            - jangan menyebut bahwa balasan dibuat oleh AI

            Hanya berikan isi balasan yang siap dikirim kepada Employee.`;

            const result = await apiClient.responses.create({
                model: "gpt-5-mini",
                input: prompt
            })

            return {
                reply: result.output_text
            };
        } catch(error) {
            throw error
        }
    }
}

export default AiService;