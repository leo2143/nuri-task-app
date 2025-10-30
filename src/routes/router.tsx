import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import TaskList from '../pages/tasks/TaskList';
import TaskDetail from '../pages/tasks/TaskDetail';
import NotFound from '../pages/status/NotFound';
import Login from '../pages/user/Login';
import Register from '../pages/user/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'tasks',
        element: <TaskList />
      },
      {
        path: 'tasks/:id',
        element: <TaskDetail />
      }
    ]
  }
]);