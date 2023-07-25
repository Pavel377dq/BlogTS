import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Pagination, Spin, Alert } from 'antd';

import ListElement from '../ListElement/ListElement';
import {
    fetchArticles,
    selectAllArticles,
    selectCurrentPage,
    setCurrentPage,
    selectStatus,
    selectError,
} from '../../redux/store/articleListSlice';
import { selectIsLogin } from '../../redux/store/userSlice';
import { useAppDispatch } from '../../redux/store/store';

import styles from './List.module.scss';

function List() {
    const articles = useSelector(selectAllArticles);
    const page = useSelector(selectCurrentPage);
    const status = useSelector(selectStatus);
    const error = useSelector(selectError);
    const isLogin = useSelector(selectIsLogin);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchArticles(page));
    }, [page, isLogin]);

    if (status === 'pending') {
        return (
            <div className={styles.spin}>
                <Spin size="large" />
            </div>
        );
    }

    if (status === 'rejected') {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    const handlerOnChangePage = (currentPage: number) => {
        dispatch(setCurrentPage(currentPage));

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const list = articles
        ? articles.map((item) => (
              <div className={styles.element} key={`${item.slug}${item.author}${item.description}`}>
                  <ListElement article={item} />
              </div>
          ))
        : null;

    return (
        <div className={styles.list}>
            {list}
            <Pagination
                className={styles.pagination}
                current={page}
                onChange={handlerOnChangePage}
                defaultPageSize={20}
                showSizeChanger={false}
                total={1000}
            />
        </div>
    );
}

export default List;
