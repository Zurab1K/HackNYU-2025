import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/layout/Header';

import Home from './pages/Home';
import About from './pages/About'

const Layout = () => (
  <div>
    <Header />
    <main>
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;