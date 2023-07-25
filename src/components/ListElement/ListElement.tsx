import React from 'react';
import { format } from 'date-fns';
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectIsLogin } from '../../redux/store/userSlice';
import { favoriteArticle, unfavoriteArticle, IArticle } from '../../redux/store/articleSlice';
import fullHeart from '../../assets/images/fullHeart.svg';
import emptyHeart from '../../assets/images/emptyHeart.svg';
import { useAppDispatch } from '../../redux/store/store';

import styles from './ListElement.module.scss';

interface IProps {
    article: IArticle;
}

function ListElement({ article }: IProps) {
    const { author, createdAt, description, tagList, favoritesCount, favorited, slug, title } = article;
    const dispatch = useAppDispatch();
    const isLogin = useSelector(selectIsLogin);

    const sliceString = (str: string, num: number) => {
        if (str && str.length > num) {
            const newStr = `${str.slice(0, num)}...`;
            return newStr;
        }
        return str;
    };

    const tags = tagList ? tagList.map((tag) => <Tag>{sliceString(tag, 10)}</Tag>) : null;

    const onLike = () => {
        if (!isLogin) return;
        if (favorited) {
            dispatch(unfavoriteArticle(slug));
        } else {
            dispatch(favoriteArticle(slug));
        }
    };

    const createDate = format(new Date(createdAt), 'MMMM dd, yyyy');
    return (
        <div className={styles.element}>
            <div className={styles.wrap}>
                <div className={styles.title}>
                    <Link to={`/articles/${slug}`} className={styles.link}>
                        {sliceString(title, 25)}
                    </Link>

                    {favorited ? (
                        <img src={fullHeart} alt="like" className={styles.like} onClick={onLike} role="presentation" />
                    ) : (
                        <img
                            src={emptyHeart}
                            alt="not active like"
                            className={styles.like}
                            onClick={onLike}
                            role="presentation"
                        />
                    )}

                    <span className={styles.count}>{favoritesCount}</span>
                </div>
                <div className={styles.profile}>
                    <span className={styles.name}>{sliceString(author.username, 14)}</span>
                    <span className={styles.date}>{createDate}</span>
                    <img src={author.image} className={styles.picture} alt="default" />
                </div>
            </div>
            <div className={styles.tags}>{tags}</div>

            <p className={styles.text}>{sliceString(description, 100)} </p>
        </div>
    );
}

export default ListElement;
