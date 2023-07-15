import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';

export default function FilterButtonGroup({ data, handleChange }) {
    const [filter, setFilter] = useState(data[0].value);

    const handleFilterChange = (_, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter);
            handleChange(newFilter);
        }
    };

    return (
        <ToggleButtonGroup
            exclusive
            color="primary"
            value={filter}
            onChange={handleFilterChange}
        >
            {data.map((item, index) => (
                <ToggleButton
                    key={index}
                    value={item.value}
                    disabled={item.disabled}
                >
                    {item.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}
