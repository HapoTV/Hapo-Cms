import {z} from 'zod';
import {screenSettingsSchema} from '../../types/settings';

const metadataEntrySchema = z.object({
    label: z.string().min(1, 'Label is required'),
    value: z.string().min(1, 'Value is required'),
});

const uniqueLabel = (message: string) => (arr: { label: string }[]) => {
    const labels = arr.map(item => item.label.toLowerCase());
    return labels.length === new Set(labels).size;
};

export const screenFormSchema = z.object({
    screenCode: z.string().optional(),
    name: z.string().min(3, 'Screen name must be at least 3 characters long.'),
    location: z.object({
        name: z.string().min(1, 'Location name is required.'),
        latitude: z.number(),
        longitude: z.number(),
    }),
    metadata: z.array(metadataEntrySchema)
        .refine(uniqueLabel('Metadata labels must be unique.'), {
            message: 'Metadata labels must be unique.',
        })
        .optional(),
    screenSettingsDTO: screenSettingsSchema,
}).superRefine((data, ctx) => {
    // Dynamically require screenCode only if it exists on the object (i.e., in create mode)
    if (data.screenCode !== undefined && !/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(data.screenCode)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['screenCode'],
            message: 'Screen code must be in the format XXXX-XXXX-XXXX.',
        });
    }
});


// This helper function transforms the raw form output into the final backend payload
export const transformToPayload = (data: z.infer<typeof screenFormSchema>): {
    location: { latitude: number; longitude: number; name: string };
    metadata: {};
    name: string;
    screenCode: string | undefined;
    screenSettingsDTO: { cacheMedia: boolean; fallbackToCache: boolean; loop: boolean; settingsMetadata: {} }
} => {
    const toObject = (arr?: { label: string, value: string }[]) =>
        arr?.reduce((acc, item) => (item.label ? {...acc, [item.label]: item.value} : acc), {}) || {};

    return {
        screenCode: data.screenCode,
        name: data.name,
        location: data.location,
        metadata: toObject(data.metadata),
        // The data for screenSettingsDTO is already in the correct format from the form,
        // so we just pass it through. The backend expects `settingsMetadata` for the metadata object.
        screenSettingsDTO: {
            loop: data.screenSettingsDTO.loop,
            cacheMedia: data.screenSettingsDTO.cacheMedia,
            fallbackToCache: data.screenSettingsDTO.fallbackToCache,
            settingsMetadata: toObject(data.screenSettingsDTO.metadata),
        }
    };
};