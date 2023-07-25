/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Button } from 'antd';

import Input from '../Input/Input';
import { selectServerErrors, clearServerErrors, createAccount, selectIsLoading } from '../../redux/store/userSlice';
import { useAppDispatch } from '../../redux/store/store';

import styles from './SignUp.module.scss';

interface IFormValues {
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
    agree: boolean;
}

function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<IFormValues>({
        mode: 'onBlur',
    });

    const dispatch = useAppDispatch();
    const serverErrors = useSelector(selectServerErrors);
    const isLoading = useSelector(selectIsLoading);

    useEffect(
        () => () => {
            dispatch(clearServerErrors());
        },

        []
    );

    useEffect(() => {
        if (serverErrors) {
            Object.entries(serverErrors).forEach(([key, value]) => {
                if (key === 'username' || key === 'email') {
                    const field = key;
                    setError(field, { type: 'serverError', message: `${value}` });
                }
            });
        }
    }, [serverErrors]);

    const onSubmit: SubmitHandler<IFormValues> = (data) => {
        const newUser = {
            username: data.username,
            email: data.email,
            password: data.password,
        };
        dispatch(createAccount(newUser));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrap}>
            <h3 className={styles.title}>Create new account</h3>
            <Input
                autofocus
                label="Username"
                placeholder="Username"
                error={errors.username}
                options={register('username', {
                    required: 'The field must be filled in',
                    minLength: {
                        value: 3,
                        message: 'The user name needs to be at least 3 characters.',
                    },
                    maxLength: {
                        value: 20,
                        message: 'The user name must contain no more than 20 characters.',
                    },
                })}
            />
            <Input
                label="Email address"
                placeholder="Email address"
                error={errors.email}
                options={register('email', {
                    required: 'The field must be filled in',
                    pattern: {
                        value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                        message: 'The email must be valid',
                    },
                })}
            />
            <Input
                label="Password"
                placeholder="Password"
                type="password"
                error={errors.password}
                options={register('password', {
                    required: 'The field must be filled in',
                    minLength: {
                        value: 6,
                        message: 'Your password needs to be at least 6 characters.',
                    },
                    maxLength: {
                        value: 40,
                        message: 'Your password must contain no more than 40 characters.',
                    },
                })}
            />
            <Input
                label="Repeat Password"
                placeholder="Password"
                type="password"
                error={errors.repeatPassword}
                options={register('repeatPassword', {
                    required: 'The field must be filled in',
                    validate: (val, formValues) => formValues.password === val || 'Your passwords do no match',
                })}
            />
            <div className={styles['checkbox-wrap']}>
                <input
                    type="checkbox"
                    id="agree"
                    className={styles['custom-checkbox']}
                    {...register('agree', {
                        required: 'You should agree',
                    })}
                />

                <label htmlFor="agree">I agree to processing my personal information</label>
            </div>
            <div className={styles.errorAgree}>
                <>{errors.agree && errors.agree.message}</>
            </div>
            <div className={styles['button-wrap']}>
                <Button htmlType="submit" className={styles.button} loading={isLoading}>
                    Create
                </Button>
            </div>
            <div className={styles['small-text']}>
                Already have an account?{' '}
                <Link to="/sign-in" className={styles.link}>
                    Sign in
                </Link>
            </div>
        </form>
    );
}

export default SignUp;
