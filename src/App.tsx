/* eslint-disable react-hooks/exhaustive-deps */
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Offline } from 'react-detect-offline';
import { Alert } from 'antd';
import { WifiOutlined } from '@ant-design/icons';

import List from './components/List/List';
import Article from './components/Article/Article';
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import DefendedWrapper from './components/MyHoc/DefenedWrap';
import Header from './components/Header/Header';
import { selectIsCurentUserLoading, getCurrentUser } from './redux/store/userSlice';
import EditForm from './components/EditForm/EditForm';
import ArticleForm from './components/ArticleForm/ArticleForm';
import styles from './App.module.scss';

function App() {
    const isCurrentUserLoading = useSelector(selectIsCurentUserLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCurrentUser());
    }, []);

    if (isCurrentUserLoading) {
        return null;
    }

    return (
        <div>
            <Offline>
                <Alert
                    message="Offline"
                    description="you have to fix internet problems"
                    type="error"
                    showIcon
                    icon={<WifiOutlined />}
                    className={styles.offlineAlert}
                />
            </Offline>
            <Header />
            <Routes>
                <Route path="/" element={<List />} />
                <Route path="/articles" element={<List />} />
                <Route path="/articles/:slug" element={<Article />} />
                <Route element={<DefendedWrapper auth />}>
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                </Route>
                <Route element={<DefendedWrapper redirectPath="/sign-in" />}>
                    <Route path="/profile" element={<EditForm />} />
                    <Route path="/new-article" element={<ArticleForm />} />
                    <Route path="/articles/:slug/edit" element={<ArticleForm editMode />} />
                </Route>
                <Route path="*" element={<h2>Page doesnt exist</h2>} />
            </Routes>
        </div>
    );
}

export default App;
