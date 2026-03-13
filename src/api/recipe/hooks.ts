import { useMutation } from "@tanstack/react-query";
import { analyzeRecipe } from "./service";

export function useAnalyzeRecipe() {
  return useMutation({
    mutationFn: analyzeRecipe,
  });
}
