import Zod from "zod";

export const NewsCreateRequestSchema = Zod.object({
    id: Zod
        .string({ required_error: "Field id must compose request body." })
        .min(1, { message: "Field id must not be empty." }),

    name: Zod
        .string({ required_error: "Field name must compose request body." })
        .min(1, { message: "Field name must not be empty." }),

    date: Zod
        .coerce
        .date({ invalid_type_error: "Field date must be filled with Date object or string."})
        .min(new Date("2024-01-01"), { message: "Field date must be filled with Date older than 01-01-2024"})
        .optional(),

    content: Zod
        .string({ required_error: "Field content must compose request body." })
        .min(1, { message: "Field content must not be empty." }),

    photo: Zod
        .string({ required_error: "Field photo must compose request body." })
        .url({ message: "Field photo must be filled with valid url." })
});

export const NewsSearchRequestSchema = Zod.object({
    id: Zod
        .string()
        .optional(),

    name: Zod
        .string()
        .optional(),

    date: Zod
        .coerce
        .date({ invalid_type_error: "Field date must be filled with Date object or string."})
        .optional(),

    content: Zod
        .string()
        .optional(),
});

export const NewsUpdateRequestSchema = Zod.object({
    id: Zod
        .string({ required_error: "Field id must compose request body." })
        .min(1, { message: "Field id must not be empty." }),

    name: Zod
        .string()
        .min(1, { message: "Field name must not be empty." })
        .optional(),

    content: Zod
        .string()
        .min(1, { message: "Field content must not be empty." })
        .optional(),

    photo: Zod
        .string()
        .url({ message: "Field photo must be filled with valid url." })
        .optional()
});

export const NewsRemoveRequestSchema = Zod.object({
    id: Zod
        .string({ required_error: "Field id must compose request body." })
        .min(1, { message: "Field id must not be empty." }),
});