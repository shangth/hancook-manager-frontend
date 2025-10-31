import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { del, get, post, put } from '../utils/request';
import type { IngredientsCategory } from './ingredientsCategories';

// 原材料数据类型
export interface Ingredient {
  id: number;
  ingredientName: string;
  typeId: number;
  ingredientType?: IngredientsCategory;
}

// 添加类型
export type AddIngredientDto = Omit<Ingredient, 'id'>;
export type DeleteIngredientDto = Pick<Ingredient, 'id'>;
export type UpdateIngredientDto = Ingredient;

// 获取原材料列表的请求函数
export async function getIngredientsList(): Promise<Ingredient[]> {
  const response = await get<Ingredient[]>('/ingredients/getList');
  console.log(response);
  return response.data;
}

// 添加原材料的请求函数
export async function addIngredient(data: AddIngredientDto): Promise<AddIngredientDto> {
  const response = await post<AddIngredientDto>('/ingredients/add', data);
  return response.data;
}

// 更新原材料的请求函数
export async function updateIngredient(data: UpdateIngredientDto): Promise<UpdateIngredientDto> {
  const response = await put<UpdateIngredientDto>('/ingredients/update', data);
  return response.data;
}

// 删除原材料的请求函数
export async function deleteIngredient(data: DeleteIngredientDto): Promise<DeleteIngredientDto> {
  const response = await del<DeleteIngredientDto>('/ingredients/delete', data);
  return response.data;
}

// 使用 TanStack Query 获取原材料列表的 Hook
export function useIngredientsList() {
  return useQuery({
    queryKey: ['getIngredients'],
    queryFn: () => getIngredientsList(),
  });
}

// 使用 TanStack Query 添加原材料的 Hook
export function useAddIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddIngredientDto) => addIngredient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getIngredients'] });
    },
  });
}

// 使用 TanStack Query 更新原材料的 Hook
export function useUpdateIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateIngredientDto) => updateIngredient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getIngredients'] });
    },
  });
}

// 使用 TanStack Query 删除原材料的 Hook
export function useDeleteIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteIngredientDto) => deleteIngredient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getIngredients'] });
    },
  });
}
