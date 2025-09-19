import React from "react";
import {TextField, TextFieldProps} from "@mui/material";


interface TextInputProps {
    handleShrink?: boolean;
    hasNoMargin?: boolean;
    value?: string | number | null | boolean | bigint | object;
}

type TextInputType = TextInputProps & TextFieldProps


export const TextInput: React.FC<TextInputType> = (props) => {
    const {hasNoMargin, ...rest} = props;

    return (
        <>
            <TextField
                {...rest}
                value={props.value || ""}
                margin={hasNoMargin ? 'none' : 'normal'}
                InputLabelProps={
                    props.handleShrink ?
                        {shrink: !!props.value} : undefined
                }
            />
        </>
    )
}

export default TextInput;
