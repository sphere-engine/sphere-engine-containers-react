const EventList = ({ events }) => {
    return (
        <div>
            {events.length > 0 &&
                (<ul>
                    {events.map((e) => {
                        return (
                            <li key={e}>
                                {e}
                            </li>
                        );
                    })}
                </ul>)
            }
            {events.length === 0 && <div style={{ marginTop: '1rem' }}>no subscribed events</div>}
        </div>
    );
};

export default EventList;
