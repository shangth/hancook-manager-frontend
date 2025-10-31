import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { del, get, post, put } from '../utils/request';

// 原材料分类数据类型
export interface IngredientsCategory {
  id: number;
  typeName: string;
  createdAt?: string;
  updatedAt?: string;
}

// 添加类型
export type CreateIngredientsCategory = Pick<IngredientsCategory, 'typeName'>;
export type DeleteIngredientsCategory = Pick<IngredientsCategory, 'id'>;
export type UpdateIngredientsCategory = Pick<IngredientsCategory, 'id' | 'typeName'>;

// 获取原材料分类列表的请求函数
export async function getIngredientsCategoriesList(): Promise<IngredientsCategory[]> {
  const response = await get<IngredientsCategory[]>('/ingredientsCategories/getList');
  console.log(response);
  return response.data;
}
// 获取原材料分类列表的请求函数
export async function createIngredientsCategory(
  data: CreateIngredientsCategory,
): Promise<CreateIngredientsCategory> {
  const response = await post<CreateIngredientsCategory>('/ingredientsCategories/add', data);
  return response.data;
}
// 获取原材料分类列表的请求函数
export async function updateIngredientsCategory(
  data: UpdateIngredientsCategory,
): Promise<UpdateIngredientsCategory> {
  const response = await put<UpdateIngredientsCategory>('/ingredientsCategories/update', data);
  return response.data;
}
// 获取原材料分类列表的请求函数
export async function deleteIngredientsCategory(
  data: DeleteIngredientsCategory,
): Promise<DeleteIngredientsCategory> {
  const response = await del<DeleteIngredientsCategory>('/ingredientsCategories/delete', data);
  return response.data;
}

// 使用 TanStack Query 获取原材料分类列表的 Hook
export function useIngredientsCategoriesList() {
  return useQuery({
    queryKey: ['getIngredientsCategories'],
    queryFn: () => getIngredientsCategoriesList(),
  });
}

// 使用 TanStack Query 创建原材料分类的 Hook
export function useCreateIngredientsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIngredientsCategory) => createIngredientsCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getIngredientsCategories'] });
    },
  });
}

// 使用 TanStack Query 更新原材料分类的 Hook
export function useUpdateIngredientsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateIngredientsCategory) => updateIngredientsCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getIngredientsCategories'] });
    },
  });
}

// 使用 TanStack Query 删除原材料分类的 Hook
export function useDeleteIngredientsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteIngredientsCategory) => deleteIngredientsCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getIngredientsCategories'] });
    },
  });
}
