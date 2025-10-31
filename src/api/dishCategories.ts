import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { del, get, post, put } from '../utils/request';

// 菜品分类数据类型
export interface DishCategory {
  id: number;
  name: string;
}

// 添加类型
export type AddDishCategoryDto = Omit<DishCategory, 'id'>;
export type DeleteDishCategoryDto = Pick<DishCategory, 'id'>;
export type UpdateDishCategoryDto = DishCategory;

// 获取菜品分类列表的请求函数
export async function getDishCategoriesList(): Promise<DishCategory[]> {
  const response = await get<DishCategory[]>('/dishCategories/getList');
  console.log(response);
  return response.data;
}

// 添加菜品分类的请求函数
export async function addDishCategory(data: AddDishCategoryDto): Promise<AddDishCategoryDto> {
  const response = await post<AddDishCategoryDto>('/dishCategories/add', data);
  return response.data;
}

// 更新菜品分类的请求函数
export async function updateDishCategory(
  data: UpdateDishCategoryDto,
): Promise<UpdateDishCategoryDto> {
  const response = await put<UpdateDishCategoryDto>('/dishCategories/update', data);
  return response.data;
}

// 删除菜品分类的请求函数
export async function deleteDishCategory(
  data: DeleteDishCategoryDto,
): Promise<DeleteDishCategoryDto> {
  const response = await del<DeleteDishCategoryDto>('/dishCategories/delete', data);
  return response.data;
}

// 使用 TanStack Query 获取菜品分类列表的 Hook
export function useDishCategoriesList() {
  return useQuery({
    queryKey: ['getDishCategories'],
    queryFn: () => getDishCategoriesList(),
  });
}

// 使用 TanStack Query 添加菜品分类的 Hook
export function useAddDishCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddDishCategoryDto) => addDishCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDishCategories'] });
    },
  });
}

// 使用 TanStack Query 更新菜品分类的 Hook
export function useUpdateDishCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateDishCategoryDto) => updateDishCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDishCategories'] });
    },
  });
}

// 使用 TanStack Query 删除菜品分类的 Hook
export function useDeleteDishCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteDishCategoryDto) => deleteDishCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getDishCategories'] });
    },
  });
}
