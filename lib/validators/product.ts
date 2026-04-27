import { z } from "zod";

const nonEmptyTrimmedString = z.string().trim().min(1);

export const productPayloadSchema = z.object({
  name: nonEmptyTrimmedString,
  description: nonEmptyTrimmedString,
  price: z.number().finite().min(0),
  images: z
    .array(z.string().trim().url("Image must be a valid URL"))
    .default([]),
  category: nonEmptyTrimmedString,
  stock: z.number().int().min(0),
  isActive: z.boolean().default(true),
  tags: z.array(nonEmptyTrimmedString).default([]),
  attributes: z.record(nonEmptyTrimmedString, nonEmptyTrimmedString).default({}),
});

export type ProductPayload = z.infer<typeof productPayloadSchema>;
