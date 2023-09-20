import { RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { configureDefaults } from './data/config';
import { appRoutes } from './app-routes';

const App = () => {
  configureDefaults();

  const router = createBrowserRouter(
    createRoutesFromElements(appRoutes)
  );
  return (
    <RouterProvider router={router} />
  )
}

export default App;
