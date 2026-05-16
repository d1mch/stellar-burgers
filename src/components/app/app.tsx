import { useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/slices/ingredientsSlice';

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';
import { TUser } from '../../utils/types';

import {
  checkUserAuth,
  selectIsAuthChecked,
  selectUser
} from '../../services/slices/userSlice';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: JSX.Element;
  user: TUser | null;
  isAuthChecked: boolean;
};

type TOrderInfoModalProps = {
  onClose: () => void;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
  user,
  isAuthChecked
}: TProtectedRouteProps) => {
  const location = useLocation();
  if (!isAuthChecked) {
    return null;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const OrderInfoModal = ({ onClose }: TOrderInfoModalProps) => {
  const { number } = useParams();

  const orderNumber = number ? `#${number.padStart(6, '0')}` : '';

  return (
    <Modal title={orderNumber} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const backgroundLocation = location.state?.background;

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route
          path='/'
          element={
            isIngredientsLoading ? (
              <Preloader />
            ) : ingredientsError ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {ingredientsError}
              </div>
            ) : ingredients.length > 0 ? (
              <ConstructorPage />
            ) : (
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Нет ингредиентов
              </div>
            )
          }
        />

        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute
              onlyUnAuth
              user={user}
              isAuthChecked={isAuthChecked}
            >
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute
              onlyUnAuth
              user={user}
              isAuthChecked={isAuthChecked}
            >
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute
              onlyUnAuth
              user={user}
              isAuthChecked={isAuthChecked}
            >
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute
              onlyUnAuth
              user={user}
              isAuthChecked={isAuthChecked}
            >
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute user={user} isAuthChecked={isAuthChecked}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute user={user} isAuthChecked={isAuthChecked}>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute user={user} isAuthChecked={isAuthChecked}>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/feed/:number'
            element={<OrderInfoModal onClose={closeModal} />}
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute user={user} isAuthChecked={isAuthChecked}>
                <OrderInfoModal onClose={closeModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
