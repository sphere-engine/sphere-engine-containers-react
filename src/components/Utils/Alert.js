const Alert = ({children, type, onClose}) => {

    let color;
    switch (type) {
        case 'success':
            color = 'green';
            break;
        case 'danger':
            color = 'red';
            break;
        default:
            color = 'black';
            break;
    }
    let closeButton = null;
    if (onClose) {
        closeButton = (
            <div style={{textAlign: 'right'}}>
                <button onClick={() => {onClose()}}>Close</button>
            </div>
        );
    }

    return (
        <div
            style={{
                color: color, 
                fontWeight: 'bold', 
                padding: '10px 5px', 
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: color,
                marginBottom: '10px',
            }}
        >
            {children}
            {closeButton}
        </div>
    );
};

export default Alert;
