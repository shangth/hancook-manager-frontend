// 请求配置接口
interface RequestConfig extends RequestInit {
  baseURL?: string;
  timeout?: number;
  params?: Record<string, any>;
}

// 响应接口
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 默认配置
const defaultConfig: RequestConfig = {
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 请求拦截器
function requestInterceptor(config: RequestConfig): RequestConfig {
  // 可以在这里添加token等认证信息
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}

// 响应拦截器
async function responseInterceptor<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // 根据实际后端返回的数据结构处理
  if (data.code !== undefined) {
    // 如果后端有统一的错误码
    if (data.code !== 200) {
      throw new Error(data.message || '请求失败');
    }
  }

  return data;
}

// 超时控制
function fetchWithTimeout(url: string, config: RequestConfig): Promise<Response> {
  const { timeout = 10000 } = config;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...config,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId);
  });
}

// 处理URL和参数
function handleUrl(url: string, baseURL: string, params?: Record<string, any>): string {
  let fullUrl = url;

  // 拼接baseURL
  if (baseURL) {
    fullUrl = `${baseURL}${url.startsWith('/') ? url : `/${url}`}`;
  }

  // 拼接查询参数
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
    }
  }

  return fullUrl;
}

// 核心请求方法
async function request<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
  const mergedConfig = {
    ...defaultConfig,
    ...config,
  };

  // 处理URL
  const fullUrl = handleUrl(url, mergedConfig.baseURL || '', mergedConfig.params);

  // 请求拦截
  const interceptedConfig = requestInterceptor(mergedConfig);

  // 发送请求
  const response = await fetchWithTimeout(fullUrl, interceptedConfig);

  // 响应拦截
  return responseInterceptor<T>(response);
}

// GET请求
export function get<T = any>(
  url: string,
  params?: Record<string, any>,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>(url, {
    ...config,
    method: 'GET',
    params,
  });
}

// POST请求
export function post<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>(url, {
    ...config,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT请求
export function put<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>(url, {
    ...config,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE请求
export function del<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  return request<T>(url, {
    ...config,
    method: 'DELETE',
    body: JSON.stringify(data),
  });
}

// 导出默认请求方法
export default request;
