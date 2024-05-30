import Axios, { AxiosError } from "axios";
import { ValidationExceptionError } from "../exceptions/ValidationExceptionError";
import { ProjectCreateRequestSchema, ProjectRemoveRequestSchema, ProjectSearchRequestSchema, ProjectUpdateRequestSchema } from "../schemas/project.schemas";
import { config } from "../config";

export default class ProjectService {
    public async register(project: Zod.infer<typeof ProjectCreateRequestSchema>) {
        try {
            const { data } = await Axios.post(config.API_URL + '/project', { data: { ...project }, role: "admin" })

            return {
                data: data.name,
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async remove(project: Zod.infer<typeof ProjectRemoveRequestSchema>) {
        try {
            const { data } = await Axios.delete(config.API_URL + '/project', { data: { data: project, role: "admin" } })

            return {
                name: data.data.name,
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err instanceof AxiosError) throw new ValidationExceptionError(err.response!.status, err.response?.data.error)
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };

    public async update(project: Zod.infer<typeof ProjectUpdateRequestSchema>) {
        try {
            const { data } = await Axios.put(config.API_URL + '/project', { data: { ...project }, role: "admin" })

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

    public async search(project: Zod.infer<typeof ProjectSearchRequestSchema>) {
        try {
            const { data } = await Axios.get(config.API_URL + '/project', { params: { ...project } })

            const projects = data.data.projects.map((data) => {
                return { ...data };
            });

            if (!projects.toString().length) throw new ValidationExceptionError(404, "No projects found");

            return {
                data: projects
            };
        } catch (err) {
            if (err instanceof ValidationExceptionError) throw err;
            if (err.toString()) throw new ValidationExceptionError(400, err.toString());

            throw new ValidationExceptionError(400, err);
        }
    };
}