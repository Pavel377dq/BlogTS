import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { selectIsLogin } from '../../redux/store/userSlice';

function DefendedWrapper({ redirectPath = '/', auth = false }) {
    const isLogin = useSelector(selectIsLogin);

    if (auth) {
        return !isLogin ? <Outlet /> : <Navigate to={redirectPath} />;
    }
    return isLogin ? <Outlet /> : <Navigate to={redirectPath} />;
}

export default DefendedWrapper;
