import Axios, { AxiosError } from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { MessageRemoveRequestSchema, MessageSearchRequestSchema, MessageUpdateRequestSchema } from "../schemas/message.schemas";
import { config } from "../config";

export default class MessageService {
    public async remove(message: Zod.infer<typeof MessageRemoveRequestSchema>) {
        try {
            const { data } = await Axios.delete(config.API_URL + '/message', { data: { data: message, role: "admin" } })

            return {
                id: data.data.id,
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err instanceof AxiosError) throw new ValidationExceptionError(err.response!.status, err.response?.data.error)
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async update(message: Zod.infer<typeof MessageUpdateRequestSchema>) {
        try {
            const { data } = await Axios.put(config.API_URL + '/message', { data: { ...message }, role: "admin" })

            return {
                id: data.data.id,
            };
        } catch (err) {

            if (err instanceof ValidationExceptionError) throw err;
            if (err instanceof AxiosError) {
                console.log(err.response)
                if(err.response) throw new ValidationExceptionError(err.response.status, err.response.data.error) 
            }
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async search(message: Zod.infer<typeof MessageSearchRequestSchema>) {
        try {
            const { data } = await Axios.get(config.API_URL + '/message', { params: message, data: { role: "admin" }});

            const messages = data.data.messages.map((data) => {
                return { ...data };
            });

            if (!messages.toString().length) throw new ValidationExceptionError(404, "No messages found");

            return {
                data: messages
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };
}