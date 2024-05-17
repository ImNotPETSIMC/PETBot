import Zod from "zod";

export const MessageCreateRequestSchema = Zod.object({
    name: Zod
        .string({ required_error: "Field name must compose request body." })
        .min(1, { message: "Field name must not be empty." }),

    email: Zod
        .string({ required_error: "Field email must compose request body." })
        .email({ message: "Field email must be filled with valid email." }),

    content: Zod
        .string({ required_error: "Field content must compose request body." })
        .min(1, { message: "Field content must not be empty." }),
});

export const MessageSearchRequestSchema = Zod.object({
    name: Zod
        .string()
        .optional(),

    email: Zod
        .string()
        .email({ message: "Field email must be filled with valid email." })
        .optional(),

    content: Zod
        .string()
        .optional(),

    date: Zod
        .coerce
        .date({ invalid_type_error: "Field date must be filled with Date object or string." })
        .optional(),

    answered: Zod
        .coerce
        .boolean({ invalid_type_error: "Field answered must be filled with boolean or string." })
        .optional(),
});

export const MessageUpdateRequestSchema = Zod.object({
    id: Zod
        .string({ required_error: "Field id must compose request body." })
        .min(1, { message: "Field id must not be empty." }),
    
    name: Zod
        .string()
        .min(1, { message: "Field name must not be empty." })
        .optional(),

    email: Zod
        .string()
        .email({ message: "Field email must be filled with valid email." })
        .optional(),

    content: Zod
        .string()
        .min(1, { message: "Field content must not be empty." })
        .optional(),

    date: Zod
        .coerce
        .date({ invalid_type_error: "Field date must be filled with Date object or string." })
        .min(new Date("2024-01-01"), { message: "Field date must be filled with Date older than 01-01-2024" })
        .optional(),

    answered: Zod
        .coerce
        .boolean({ invalid_type_error: "Field answered must be filled with boolean or string." })
        .optional(),
});

export const MessageRemoveRequestSchema = Zod.object({
    id: Zod
        .string({ required_error: "Field id must compose request body." })
        .min(1, { message: "Field id must not be empty." })
});