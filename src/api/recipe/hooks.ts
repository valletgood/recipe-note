import { useMutation } from "@tanstack/react-query";
import {
  analyzeRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "./service";

export function useAnalyzeRecipe() {
  return useMutation({
    mutationFn: analyzeRecipe,
  });
}

export function useCreateRecipe() {
  return useMutation({
    mutationFn: createRecipe,
  });
}

export function useUpdateRecipe() {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateRecipe>[1];
    }) => updateRecipe(id, data),
  });
}

export function useDeleteRecipe() {
  return useMutation({
    mutationFn: deleteRecipe,
  });
}
