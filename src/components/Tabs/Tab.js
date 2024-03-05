import cn from 'classnames';


const Tab = ({id, isActive, onChange, children}) => {

    const onClick = () => {
        onChange && onChange(id);
    };

    return (
        <li 
            onClick={onClick}
            className={cn('tab', {'active': isActive})} 
            role="tab"
        >
            {children}
        </li>
    );
};

export default Tab;