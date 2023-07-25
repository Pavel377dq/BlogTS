/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import s from './Input.module.scss';

interface IProps {
    placeholder: string;
    options: UseFormRegisterReturn<any>;
    error: FieldError | undefined;
    label?: string;
    type?: string;
    modeTextarea?: boolean;
    autofocus?: boolean;
}

function Input({ label, placeholder, options, error, type = 'text', modeTextarea = false }: IProps) {
    const inputClass = error ? `${s.input} ${s.inputError}` : s.input;

    return (
        <div className={s.wrapp}>
            {label && (
                <label className={s.label} htmlFor={label}>
                    {label}
                </label>
            )}
            {modeTextarea ? (
                <textarea className={`${inputClass} ${s.textarea}`} id={label} placeholder={placeholder} {...options} />
            ) : (
                <input className={inputClass} id={label} placeholder={placeholder} type={type} {...options} />
            )}
            <div className={s.error}>{error ? error.message || 'Error' : ''}</div>
        </div>
    );
}

Input.defaultProps = {
    type: 'text',
    modeTextarea: false,
    label: '',
    autofocus: false,
};

export default Input;
