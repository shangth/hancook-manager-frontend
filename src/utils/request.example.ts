// 公共请求方法使用示例

import { del, get, patch, post, put } from './request';

// 定义数据类型
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserListResponse {
  list: User[];
  total: number;
}

// GET 请求示例
async function fetchUsers(page: number, size: number) {
  try {
    const response = await get<UserListResponse>('/api/users', {
      page,
      size,
    });
    console.log('用户列表:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
}

// POST 请求示例
async function createUser(userData: Omit<User, 'id'>) {
  try {
    const response = await post<User>('/api/users', userData);
    console.log('创建的用户:', response.data);
    return response.data;
  } catch (error) {
    console.error('创建用户失败:', error);
    throw error;
  }
}

// PUT 请求示例
async function updateUser(id: number, userData: Partial<User>) {
  try {
    const response = await put<User>(`/api/users/${id}`, userData);
    console.log('更新的用户:', response.data);
    return response.data;
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
}

// DELETE 请求示例
async function deleteUser(id: number) {
  try {
    const response = await del<{ success: boolean }>(`/api/users/${id}`);
    console.log('删除结果:', response.data);
    return response.data;
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
}

// PATCH 请求示例
async function updateUserStatus(id: number, status: string) {
  try {
    const response = await patch<User>(`/api/users/${id}`, { status });
    console.log('更新的用户:', response.data);
    return response.data;
  } catch (error) {
    console.error('更新用户状态失败:', error);
    throw error;
  }
}

// 导出示例函数（仅用于演示）
export { fetchUsers, createUser, updateUser, deleteUser, updateUserStatus };
