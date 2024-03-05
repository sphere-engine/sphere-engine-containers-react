import { useCallback, useEffect } from "react";

const SelectableList = ({items, selectedItem, onChange, emptyList, disabled}) => {

    items = items || [];
    emptyList = emptyList || (<select></select>);

    const selectItem = useCallback((value) => {
        onChange && onChange(value);
    }, [onChange]);

    useEffect(() => {
        if (items.length > 0) {
            if (selectedItem === null) {
                selectItem(items[0][0]);
            } else if (items.map(i => i[0]).includes(selectedItem) === false) {
                selectItem(items[0][0]);
            }
        } else {
            selectItem(null);
        }
    }, [selectItem, selectedItem, items]);

    if (items.length === 0) {
        return emptyList;
    }

    const _onChange = (value) => {
        selectItem(value);
    };
    
    return (
        <select 
            value={selectedItem || ''} 
            onChange={(e) => {_onChange(e.target.value)}}
            disabled={disabled || false}
        >
            {items.map(item => (
                <option key={item[0]} value={item[0]}>{item[1]}</option>
            ))}
        </select>
    );
};

export default SelectableList;
