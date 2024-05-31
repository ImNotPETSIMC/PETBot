import Axios, { AxiosError } from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { TutorCreateRequestSchema, TutorRemoveRequestSchema, TutorSearchRequestSchema, TutorUpdateRequestSchema } from "../schemas/tutor.schemas";
import { config } from "../config";

export default class TutorService {
    public async register(tutor: Zod.infer<typeof TutorCreateRequestSchema>) {
        try {
            const { data } = await Axios.post(config.API_URL + '/tutor', { data: { ...tutor }, role: "admin" })

            return {
                data: data.data.name
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async remove(tutor: Zod.infer<typeof TutorRemoveRequestSchema>) {
        try {
            const { data } = await Axios.delete(config.API_URL + '/tutor', { data: { data: tutor, role: "admin" } })

            return {
                name: data.data.name
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err instanceof AxiosError) throw new ValidationExceptionError(err.response!.status, err.response?.data.error)
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async update(tutor: Zod.infer<typeof TutorUpdateRequestSchema>) {
        try {
            const { data } = await Axios.put(config.API_URL + '/tutor', { data: { ...tutor }, role: "admin" })

            return {
                name: data.data.name
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err instanceof AxiosError) throw new ValidationExceptionError(err.response!.status, err.response?.data.error)
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async search(tutor: Zod.infer<typeof TutorSearchRequestSchema>) {
        try {
            const { data } = await Axios.get(config.API_URL + '/tutor', { params: { ...tutor } })

            const tutors = data.data.members.map((data) => {
                if (!data.disciplines.length) data.disciplines.push("🚫")
                return { ...data };
            });

            if (!tutors.toString().length) throw new ValidationExceptionError(404, "No tutors found");


            return {
                data: tutors
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };
}