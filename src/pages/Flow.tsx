import React from 'react';
import { Flex, Layout } from 'antd';
import Canvas from './canvas/Index';

const { Header, Footer, Sider, Content } = Layout;

export default function Flow() {
  return (
    <Layout className="h-screen">
      <Sider width="4%" className="!bg-cyan-400">
        Sider
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content className="flex-1">
          <Canvas />
        </Content>
      </Layout>
    </Layout>
  );
}
