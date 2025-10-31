import { createFileRoute } from '@tanstack/react-router';
import { Button, Form, Input, Modal, message, Space, Table } from 'antd';
import { useState } from 'react';
import type {
  AddDishCategoryDto,
  DishCategory,
  UpdateDishCategoryDto,
} from '../../../api/dishCategories';
import {
  useAddDishCategory,
  useDeleteDishCategory,
  useDishCategoriesList,
  useUpdateDishCategory,
} from '../../../api/dishCategories';

export const Route = createFileRoute('/cook/dishesType/')({
  component: DishesTypeComponent,
});

function DishesTypeComponent() {
  const { data, isLoading } = useDishCategoriesList();
  const { mutate: createMutate } = useAddDishCategory();
  const { mutate: updateMutate } = useUpdateDishCategory();
  const { mutate: deleteMutate } = useDeleteDishCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DishCategory | null>(null);
  const [form] = Form.useForm();

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: DishCategory) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 打开添加/编辑弹窗
  const handleOpenModal = (record?: DishCategory) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue(record);
    } else {
      setEditingRecord(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // 编辑
  const handleEdit = (record: DishCategory) => {
    handleOpenModal(record);
  };

  // 删除
  const handleDelete = (record: DishCategory) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除"${record.name}"吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteMutate(
          { id: record.id },
          {
            onSuccess: () => {
              message.success('删除成功');
            },
            onError: () => {
              message.error('删除失败');
            },
          },
        );
      },
    });
  };

  // 提交表单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingRecord) {
        // 更新
        updateMutate({ ...values, id: editingRecord.id } as UpdateDishCategoryDto, {
          onSuccess: () => {
            message.success('更新成功');
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: () => {
            message.error('更新失败');
          },
        });
      } else {
        // 创建
        createMutate(values as AddDishCategoryDto, {
          onSuccess: () => {
            message.success('创建成功');
            setIsModalOpen(false);
            form.resetFields();
          },
          onError: () => {
            message.error('创建失败');
          },
        });
      }
    });
  };

  // 关闭弹窗
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingRecord(null);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Button type="primary" onClick={() => handleOpenModal()}>
          添加分类
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title={editingRecord ? '编辑分类' : '添加分类'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
