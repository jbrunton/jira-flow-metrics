import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DomainsDropdown } from './components/domains-dropdown'
import { Col, Layout, Row } from 'antd'
import { DomainsPage } from './domains/domains-page';
import { DataSetsIndexPage } from './data-sets/data-sets-index-page';

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout>
      <Header>
        <Row>
          <Col flex="auto">
            <span>Jira Flow Metrics</span>
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <DomainsDropdown />
          </Col>
        </Row>
      </Header>
      <Content style={{ margin: '0 50px' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/domains/:domainId" element={<DataSetsIndexPage />} />
            <Route path="*" element={<Navigate to="/domains" replace={true} />} />
          </Routes>
        </BrowserRouter>
      </Content>
    </Layout>
  )
}

export default App;

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Root />,
//   }
// ]);

// const App = <RouterProvider router={router} />

// export default App;
