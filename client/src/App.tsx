import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Col, Layout, Row } from 'antd'
import { DomainsPage } from './domains/domains-page';
import { DataSetsIndexPage } from './data-sets/data-sets-index-page';
import { IssuesIndexPage } from './data-sets/issues-index-page';
import { DomainsDropdown } from './components/domains-dropdown';
import { DomainProvider } from './domains/context/provider';
import { configureDefaults } from './data/config';

const { Header, Content } = Layout;

const App = () => {
  configureDefaults();
  return (
    <DomainProvider>
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
                <Route path="/datasets" element={<DataSetsIndexPage />} />
                <Route path="/datasets/:dataSetId/issues" element={<IssuesIndexPage />} />
                <Route path="*" element={<Navigate to="/domains" replace={true} />} />
              </Routes>
            </BrowserRouter>
        </Content>
      </Layout>
    </DomainProvider>
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
