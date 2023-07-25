/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Button } from 'antd';

import Input from '../Input/Input';
import { loginAccount, clearServerErrors, selectServerErrors, selectIsLoading } from '../../redux/store/userSlice';
import { useAppDispatch } from '../../redux/store/store';

import styles from './SignIn.module.scss';

interface IFormValues {
    email: string;
    password: string;
}

function SignIn() {
    const dispatch = useAppDispatch();
    const serverErrors = useSelector(selectServerErrors);
    const isLoading = useSelector(selectIsLoading);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormValues>({
        mode: 'onBlur',
    });

    useEffect(
        () => () => {
            dispatch(clearServerErrors());
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const onSubmit: SubmitHandler<IFormValues> = (data) => {
        dispatch(loginAccount(data));
    };

    return (
        <div className={styles.signIn}>
            <>
                {' '}
                {serverErrors && (
                    <Alert
                        className={styles.serverError}
                        message="Error: email or password is invalid"
                        type="error"
                        showIcon
                    />
                )}
            </>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.wrap}>
                <h3 className={styles.title}>Sign In</h3>
                <Input
                    autofocus
                    label="Email address"
                    placeholder="Email address"
                    type="email"
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
                    })}
                />
                <div className={styles['button-wrap']}>
                    <Button htmlType="submit" className={styles.button} loading={isLoading}>
                        Login
                    </Button>
                </div>
                <div className={styles['small-text']}>
                    Dont have an account?{' '}
                    <Link to="/sign-up" className={styles.link}>
                        Sign Up
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default SignIn;
