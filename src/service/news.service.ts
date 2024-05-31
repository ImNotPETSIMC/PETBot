import Axios, { AxiosError } from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { NewsCreateRequestSchema, NewsRemoveRequestSchema, NewsSearchRequestSchema, NewsUpdateRequestSchema } from "../schemas/news.schemas";
import { config } from "../config";

export default class NewsService {
    public async register(news: Zod.infer<typeof NewsCreateRequestSchema>) {
        try {
            const { data } = await Axios.post(config.API_URL + '/news', { data: { ...news }, role: "admin" })

            return {
                data: data.data.name,
                id: data.data.id
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async remove(news: Zod.infer<typeof NewsRemoveRequestSchema>) {
        try {
            const { data } = await Axios.delete(config.API_URL + '/news', { data: { data: news, role: "admin" } })

            return {
                name: data.data.name,
                id: data.data.id
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err instanceof AxiosError) throw new ValidationExceptionError(err.response!.status, err.response?.data.error)
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async update(news: Zod.infer<typeof NewsUpdateRequestSchema>) {
        try {
            const { data } = await Axios.put(config.API_URL + '/news', { data: { ...news }, role: "admin" })

            return {
                name: data.data.name,
                id: data.data.id
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err instanceof AxiosError) throw new ValidationExceptionError(err.response!.status, err.response?.data.error)
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async search(news: Zod.infer<typeof NewsSearchRequestSchema>) {
        try {
            const { data } = await Axios.get(config.API_URL + '/news', { params: { ...news } })

            const newsCollection = data.data.news.map((data) => {
                return { ...data };
            });

            if (!news.toString().length) throw new ValidationExceptionError(404, "No news found");

            return {
                data: newsCollection
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };
}