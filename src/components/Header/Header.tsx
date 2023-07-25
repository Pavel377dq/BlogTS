import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Img } from 'react-image';
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { logout, selectIsCurentUserLoading, selectIsLogin, selectUser } from '../../redux/store/userSlice';
import { useAppDispatch } from '../../redux/store/store';
import avatar from '../../assets/images/defaultAvatar.svg';

import styles from './Header.module.scss';

function Header() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLogin = useSelector(selectIsLogin);
    const user = useSelector(selectUser);
    const isCurentUserLoading = useSelector(selectIsCurentUserLoading);

    return (
        <div className={styles.header}>
            <div className={styles.wrap}>
                <h3 className={styles.title}>
                    <Link to="/" className={styles['logo-link']}>
                        Realworld Blog
                    </Link>
                </h3>
                {!isCurentUserLoading &&
                    (isLogin ? (
                        <div className={styles['logged-info']}>
                            <button
                                className={`${styles.button} ${styles.buttonCreateArticle}`}
                                onClick={() => navigate('/new-article')}
                                type="button"
                            >
                                Create article
                            </button>
                            <div className={styles.userInfo}>
                                <Link to="/profile" className={styles.userName}>
                                    {user.username}
                                </Link>
                                <Img
                                    className={styles.userAvatar}
                                    src={[user.image, avatar]}
                                    loader={
                                        <Spin
                                            className={styles.avatar}
                                            indicator={
                                                <LoadingOutlined style={{ fontSize: 47, color: 'black' }} spin />
                                            }
                                        />
                                    }
                                />
                            </div>
                            <Button
                                className={`${styles.button} ${styles.buttonLogout}`}
                                onClick={() => dispatch(logout())}
                                htmlType="button"
                            >
                                Log Out
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <button type="button" onClick={() => navigate('/sign-in')} className={styles.in}>
                                Sign In
                            </button>
                            <button type="button" onClick={() => navigate('/sign-up')} className={styles.up}>
                                Sign Up
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Header;
