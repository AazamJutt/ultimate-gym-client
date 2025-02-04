import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLazyVerifyTokenQuery } from '../services/user.service';
import { loginUser, logout } from '../redux/slices/auth.slice';

const useRestoreSession = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [verifyToken] = useLazyVerifyTokenQuery();

  const restoreSession = useCallback(async () => {
    const token = localStorage.getItem('auth_token') as string;
    if (token) {
      try {
        dispatch(loginUser(token));
        const response = await verifyToken();
        if (!response.error) {
          navigate('/');
        } else {
          if (response.error) {
            localStorage.removeItem('auth_token');
            toast.error(response?.data?.message || 'Failed to verify token');
            dispatch(logout());
            navigate('/auth/signin');
          }
        }
      } catch (e) {
        toast.error(e?.data?.message || 'Failed to verify token');
        localStorage.removeItem('auth_token');
        dispatch(logout());
        navigate('/auth/signin');
      }
    } else if (pathname !== '/auth/signin' && pathname !== '/auth/signup') {
      dispatch(logout());
      navigate('/auth/signin');
    }
  }, [pathname]);

  return restoreSession;
};

export default useRestoreSession;
