import {useState} from "react";

export function useForm<T extends object>(initial: T) {
    const [values, setValues] = useState<T>(initial);
    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setValues(v => ({ ...v, [e.target.name]: e.target.value } as T));
    }
    return {values, setValues, onChange};
}