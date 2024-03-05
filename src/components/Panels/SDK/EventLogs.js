import { useEffect, useRef } from "react";


function EventLog({id, type, origin, data}) {
  return (
    <div>
      {id}. {type} (origin: {origin})
      <pre><code>{JSON.stringify(data)}</code></pre>
    </div>
  );
}

function EventLogs({ events }) {
  
  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [events.length]);

  const containerStyle = {
    padding: '5px', 
    border: '1px solid #ccc',
    height: '300px', 
    maxHeight: '300px', 
    overflow: 'scroll',
    marginTop: '10px',
  };

  if (events.length === 0) {
    return (<div style={containerStyle}>
      No events yet
    </div>);
  }

  return (
    <div ref={divRef} style={containerStyle}>
      {events.toReversed().map(event => (
        <EventLog key={event.id} id={event.id} type={event.type} origin={event.origin} data={event.data}/>
      ))}
    </div>
  );
}

export default EventLogs;
