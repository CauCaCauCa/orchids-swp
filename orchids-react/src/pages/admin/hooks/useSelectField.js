import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';

export default function useSelectField(label, selectItems, ...props) {

    const [data, setData] = useState(selectItems[0].value);

    function handleChange(event) {
        setData(event.target.value);
    }

    const getComponent = () => (
        <>
            <Select
                labelId="mui-select-field"
                value={data}
                onChange={handleChange}
                {...props}
            >
                {selectItems.map((item) => (
                    <MenuItem value={item.value} key={item.label}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </>
    )

    return [data, getComponent]
}