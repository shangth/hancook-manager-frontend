import { createFileRoute } from '@tanstack/react-router';
import { Button, Form, Input, Modal, message, Select, Space, Table } from 'antd';
import { useState } from 'react';
import type { AddIngredientDto, Ingredient, UpdateIngredientDto } from '../../../api/ingredients';
import {
  useAddIngredient,
  useDeleteIngredient,
  useIngredientsList,
  useUpdateIngredient,
} from '../../../api/ingredients';
import { useIngredientsCategoriesList } from '../../../api/ingredientsCategories';

export const Route = createFileRoute('/cook/ingredients/')({
  component: IngredientsComponent,
});

function IngredientsComponent() {
  const { data, isLoading } = useIngredientsList();
  const { data: categoriesData } = useIngredientsCategoriesList();
  const { mutate: createMutate } = useAddIngredient();
  const { mutate: updateMutate } = useUpdateIngredient();
  const { mutate: deleteMutate } = useDeleteIngredient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Ingredient | null>(null);
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
      dataIndex: 'ingredientName',
      key: 'ingredientName',
    },
    {
      title: '分类',
      key: 'typeName',
      render: (_: unknown, record: Ingredient) => {
        return record.ingredientType?.typeName || '-';
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: Ingredient) => (
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
  const handleOpenModal = (record?: Ingredient) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue({
        ingredientName: record.ingredientName,
        typeId: record.typeId,
      });
    } else {
      setEditingRecord(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // 编辑
  const handleEdit = (record: Ingredient) => {
    handleOpenModal(record);
  };

  // 删除
  const handleDelete = (record: Ingredient) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除"${record.ingredientName}"吗？`,
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
        updateMutate({ ...values, id: editingRecord.id } as UpdateIngredientDto, {
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
        createMutate(values as AddIngredientDto, {
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
          添加原材料
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
        title={editingRecord ? '编辑原材料' : '添加原材料'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="ingredientName"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="typeId" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="请选择分类">
              {categoriesData?.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.typeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
