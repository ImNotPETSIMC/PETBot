import Zod from "zod";

export const ProjectCreateRequestSchema = Zod.object({
    name: Zod
        .string({ required_error: "Field name must compose request body." })
        .min(1, { message: "Field name must not be empty." }),

    subtitle: Zod
        .string({ required_error: "Field subtitle must compose request body." })
        .min(1, { message: "Field subtitle must not be empty." }),

    description: Zod
        .string({ required_error: "Field description must compose request body." })
        .min(1, { message: "Field description must not be empty." }),

    status: Zod
        .string({ required_error: "Field status must compose request body." })
        .refine((str => (str == "Em Andamento" || str == "Concluido")), { message: "Status must be Em Andamento or Concluido" }),

    type: Zod
        .string({ required_error: "Field type must compose request body." })
        .refine((str => (str == "Extensão" || str == "Ensino" || str == "Pesquisa" || str == "Outros")), { message: "Status must be Extensão, Ensino, Pesquisa or Outros." }),

    photo: Zod
        .string({ required_error: "Field photo must compose request body." })
        .url({ message: "Field photo must be filled with valid url." })
});

export const ProjectSearchRequestSchema = Zod.object({
    name: Zod
        .string()
        .optional(),

    subtitle: Zod
        .string()
        .optional(),

    description: Zod
        .string()
        .optional(),

    status: Zod
        .string()
        .refine((str => (str == "Em Andamento" || str == "Concluido")), { message: "Status must be Em Andamento or Concluido" })
        .optional(),

    type: Zod
        .string()
        .refine((str => (str == "Extensão" || str == "Ensino" || str == "Pesquisa" || str == "Outros")), { message: "Status must be Extensão, Ensino, Pesquisa or Outros." })
        .optional(),
});

export const ProjectUpdateRequestSchema = Zod.object({
    name: Zod
        .string({ required_error: "Field name must compose request body." })
        .min(1, { message: "Field name must not be empty." }),

    subtitle: Zod
        .string()
        .min(1, { message: "Field subtitle must not be empty." })
        .optional(),

    description: Zod
        .string({ required_error: "Field description must compose request body." })
        .min(1, { message: "Field description must not be empty." })
        .optional(),

    status: Zod
        .string({ required_error: "Field status must compose request body." })
        .refine((str => (str == "Em Andamento" || str == "Concluido")), { message: "Status must be Em Andamento or Concluido" })
        .optional(),

    type: Zod
        .string({ required_error: "Field type must compose request body." })
        .refine((str => (str == "Extensão" || str == "Ensino" || str == "Pesquisa" || str == "Outros")), { message: "Status must be Extensão, Ensino, Pesquisa or Outros." })
        .optional(),

    photo: Zod
        .string({ required_error: "Field photo must compose request body." })
        .url({ message: "Field photo must be filled with valid url." })
        .optional()
});

export const ProjectRemoveRequestSchema = Zod.object({
    name: Zod
        .string({ required_error: "Field name must compose request body." })
        .min(1, { message: "Field name must not be empty." })
});