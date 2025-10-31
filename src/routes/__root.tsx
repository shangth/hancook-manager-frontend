import { createRootRoute, Link, Outlet, useNavigate } from '@tanstack/react-router';
import './root.scss';
import { QueryClientProvider } from '@tanstack/react-query';
import { Button, Result } from 'antd';
import { queryClient } from '../api/client';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div className="h-full flex items-center justify-center">
        <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在"
          extra={
            <Link to="/cook/index">
              <Button type="primary">回到首页</Button>
            </Link>
          }
        />
      </div>
    );
  },
});

function RootComponent() {
  const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="wrap">
        <div className="menu">
          <Button type="primary" onClick={() => navigate({ to: '/cook/ingredientsType' })}>
            原材料分类
          </Button>
          <Button type="primary" onClick={() => navigate({ to: '/cook/ingredients' })}>
            原材料
          </Button>
          <Button type="primary" onClick={() => navigate({ to: '/cook/dishesType' })}>
            菜品分类
          </Button>
          <Button type="primary" onClick={() => navigate({ to: '/cook/dishes' })}>
            菜品
          </Button>
        </div>
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}
