import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLazyVerifyTokenQuery } from '../services/user.service';
import { loginUser } from '../redux/slices/auth.slice';

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
          navigate('/auth/signin');
        }
      } catch (e) {
        console.error('Failed to verify token:', e);
        toast.error(e?.data?.message || 'Failed to verify token');
      }
    } else if (pathname !== '/auth/signin' && pathname !== '/auth/signup') {
      navigate('/auth/signin');
    }
  }, [pathname]);

  return restoreSession;
};

export default useRestoreSession;
