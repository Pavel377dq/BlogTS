/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-children-prop */
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Popconfirm, Button } from 'antd';

import ListElement from '../ListElement/ListElement';
import {
    fetchArticle,
    selectArticle,
    selectStatus,
    deleteArticle,
    selectIsLoading,
} from '../../redux/store/articleSlice';
import { selectIsLogin } from '../../redux/store/userSlice';
import { useAppDispatch } from '../../redux/store/store';

import styles from './Article.module.scss';

function Article() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const dispatch = useAppDispatch();
    const article = useSelector(selectArticle);

    const status = useSelector(selectStatus);
    const isLogin = useSelector(selectIsLogin);
    const isLoading = useSelector(selectIsLoading);
    const { body } = article;

    useEffect(() => {
        if (slug) {
            dispatch(fetchArticle(slug));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, isLogin]);

    const onDelete = () => {
        dispatch(deleteArticle({ slug: article.slug, navigate }));
    };
    const onEdit = () => {
        navigate(`/articles/${slug}/edit`);
    };

    if (status === 'pending') {
        return (
            <div className={styles.spin}>
                <Spin size="large" />
            </div>
        );
    }

    if (status === 'rejected') {
        return <Alert message="Error"  type="error" showIcon />;
    }

    return (
        <div className={styles.wrap}>
            <ListElement article={article} />

            <ReactMarkdown
                className={styles.markdown}
                children={body?.length > 2300 ? `${body.slice(0, 2300)}...` : body}
            />
            <>
                <div className={styles.buttonWrap}>
                    <Popconfirm
                        placement="leftTop"
                        title="Deleting the article"
                        description="Are you sure to delete this article?"
                        onConfirm={onDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className={styles.buttonDelete} loading={isLoading}>
                            Delete
                        </Button>
                    </Popconfirm>
                    <Button className={styles.buttonEdit} onClick={onEdit}>
                        Edit
                    </Button>
                </div>
            </>
        </div>
    );
}

export default Article;
