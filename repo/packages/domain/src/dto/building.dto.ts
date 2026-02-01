import z from "zod";
import { buildingSchema } from "../entities/building.entity.js";

export const createBuildingSchema = buildingSchema.omit({
    id: true,
    created_at: true
});

export const updateBuildingSchema = createBuildingSchema.partial();

export type CreateBuildingDto = z.infer<typeof createBuildingSchema>;
export type UpdateBuildingDto = z.infer<typeof updateBuildingSchema>;
