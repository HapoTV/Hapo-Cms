import React from 'react';
import {useFieldArray, useFormContext} from 'react-hook-form';
import {Plus, X} from 'lucide-react';
import {useTheme} from "../../hooks/useTheme.ts";
import {Button} from "./Button.tsx";
import {Input} from "./Input.tsx";

/**
 * A reusable, themed component for creating key-value metadata pairs.
 */
export const MetadataEditor: React.FC<{ name: string; title: string }> = ({name, title}) => {
    // 1. Get `register` and `errors` from the context
    const {control, register, formState: {errors}} = useFormContext();
    const {fields, append, remove} = useFieldArray({control, name});
    const {currentTheme} = useTheme();

    // 1. CORRECTED: Type-safe way to get nested errors from react-hook-form.
    // 'get' is a utility that safely traverses the nested errors object.
    const getNestedError = (path: string) => {
        const pathParts = path.split('.');
        let current: any = errors;
        for (const part of pathParts) {
            if (current && part in current) {
                current = current[part];
            } else {
                return undefined;
            }
        }
        return current;
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.md}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 style={{
                    fontSize: currentTheme.typography.fontSize.sm,
                    fontWeight: 500,
                    color: currentTheme.colors.text.secondary
                }}>{title}</h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append({label: '', value: ''})}
                    leftIcon={<Plus size={16}/>}
                >
                    Add
                </Button>
            </div>

            {fields.length === 0 &&
                <p style={{
                    fontSize: currentTheme.typography.fontSize.sm,
                    color: currentTheme.colors.text.tertiary,
                    fontStyle: 'italic'
                }}>
                    No metadata entries
                </p>
            }

            <div style={{display: 'flex', flexDirection: 'column', gap: currentTheme.spacing.sm}}>
                {fields.map((field, index) => (
                    <div key={field.id}
                         style={{display: 'flex', gap: currentTheme.spacing.sm, alignItems: 'flex-start'}}>
                        {/* 2. Pass the `register` and `errors` objects to the Input component */}
                        <Input
                            // Use the register function provided by react-hook-form
                            {...register(`${name}.${index}.label`)}
                            placeholder="Label"
                            // Pass the specific error message to the component's error prop
                            error={getNestedError(`${name}.${index}.label`)?.message}
                            inputSize="sm"
                        />
                        <Input
                            {...register(`${name}.${index}.value`)}
                            placeholder="Value"
                            error={getNestedError(`${name}.${index}.value`)?.message}
                            inputSize="sm"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(index)}
                            title="Remove entry"
                        >
                            <X size={16}/>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export class MetadataEditorProps {
}