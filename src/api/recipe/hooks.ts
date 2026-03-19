import { useMutation } from "@tanstack/react-query";
import {
  uploadRecipeImages,
  analyzeRecipe,
  analyzeRecipeFromImage,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "./service";

export function useUploadRecipeImages() {
  return useMutation({
    mutationFn: uploadRecipeImages,
  });
}

export function useAnalyzeRecipe() {
  return useMutation({
    mutationFn: analyzeRecipe,
  });
}

export function useAnalyzeRecipeFromImage() {
  return useMutation({
    mutationFn: analyzeRecipeFromImage,
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
