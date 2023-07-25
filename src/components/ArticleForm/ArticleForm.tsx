/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Button } from 'antd';

import { selectUser } from '../../redux/store/userSlice';
import {
    selectArticle,
    createArticle,
    fetchArticle,
    updateArticle,
    selectIsLoading,
} from '../../redux/store/articleSlice';
import { useAppDispatch } from '../../redux/store/store';
import Input from '../Input/Input';

import styles from './ArticleForm.module.scss';

interface IFormValues {
    title: string;
    description: string;
    text: string;
    tags: {
        tag: string;
    }[];
}

interface IProps {
    editMode?: boolean;
}

function ArticleForm({ editMode }: IProps) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            text: '',
            tags: [{ tag: '' }],
        },
        mode: 'onBlur',
    });

    const { slug: slugParam } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const currentUser = useSelector(selectUser);
    const article = useSelector(selectArticle);
    const isLoading = useSelector(selectIsLoading);
    const { title, description, body, tagList, author, slug } = article;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tags',
    });

    useEffect(() => {
        if (slugParam) {
            dispatch(fetchArticle(slugParam));
        }
        return () => {
            if (editMode) {
                reset({}, { keepDefaultValues: true });
            }
        };
    }, [slugParam]);

    useEffect(() => {
        if (author.username && author.username !== currentUser.username && slugParam) {
            navigate(`/articles/${slugParam}`);
        }
    }, [author.username]);

    useEffect(() => {
        if (editMode) {
            setValue('title', title);
            setValue('description', description);
            setValue('text', body);
            remove();
            tagList.forEach((tag) => {
                append({ tag });
            });
            append({ tag: '' });
        }
    }, [editMode, title, description, body, tagList]);

    const onSubmit: SubmitHandler<IFormValues> = (data) => {
        const newArticle = {
            title: data.title,
            description: data.description,
            body: data.text,
            tagList: [] as string[],
        };
        data.tags.forEach((item) => {
            const { tag } = item;
            if (tag.trim()) {
                newArticle.tagList.push(tag.trim());
            }
        });

        if (editMode) {
            dispatch(updateArticle({ newArticle, slug, navigate }));
        } else {
            dispatch(createArticle({ newArticle, navigate }));
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.title}>{editMode ? 'Edit article' : 'Create new article'}</h2>
            <Input
                autofocus
                label="Title"
                placeholder="Title"
                error={errors.title}
                options={register('title', {
                    required: 'The field must be filled in',
                    maxLength: {
                        value: 50,
                        message: 'The title must contain no more than 50 characters.',
                    },
                })}
            />
            <Input
                label="Short description"
                placeholder="Short description"
                error={errors.description}
                options={register('description', {
                    required: 'The field must be filled in',
                    maxLength: {
                        value: 100,
                        message: 'The description must contain no more than 100 characters.',
                    },
                })}
            />
            <Input
                modeTextarea
                label="Text"
                placeholder="Text"
                error={errors.text}
                options={register('text', {
                    required: 'The field must be filled in',
                })}
            />
            <fieldset className={styles.tags}>
                <legend className={styles.tagsTitle}>Tags</legend>
                {fields.map((tag, index, arr) => (
                    <div className={styles.tagWrapp} key={tag.id}>
                        <Input
                            placeholder="Tag"
                            error={errors?.tags?.[index]?.tag}
                            options={register(`tags.${index}.tag`, {
                                maxLength: {
                                    value: 20,
                                    message: 'The tag must contain no more than 20 characters.',
                                },
                            })}
                        />

                        {arr.length - 1 === index ? (
                            <Button
                                className={styles.tagButton}
                                type="primary"
                                ghost
                                onClick={() => append({ tag: '' })}
                            >
                                Add tag
                            </Button>
                        ) : (
                            <Button
                                className={styles.tagButton}
                                type="primary"
                                danger
                                ghost
                                onClick={() => remove(index)}
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                ))}
            </fieldset>
            <Button className={styles.submit} htmlType="submit" loading={isLoading} type="primary">
                Send
            </Button>
        </form>
    );
}

export default ArticleForm;
