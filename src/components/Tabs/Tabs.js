import cn from 'classnames';
import './Tabs.css';

const Tabs = ({children}) => {

    return (
        <ul className={cn('tabs')} role="tablist">
            {children}
        </ul>
    );
};

export default Tabs;