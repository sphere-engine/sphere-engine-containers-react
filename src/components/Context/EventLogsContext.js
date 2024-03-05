import { createContext, useReducer, useContext } from 'react';

const EventLogsContext = createContext(null);
const EventLogsDispatchContext = createContext(null);
let nextId = 0;

export function EventLogsProvider({ children }) {
    const [eventsLogs, dispatch] = useReducer(
        eventLogsReducer,
        []
    );

    return (
        <EventLogsContext.Provider value={eventsLogs}>
            <EventLogsDispatchContext.Provider value={dispatch}>
                {children}
            </EventLogsDispatchContext.Provider>
        </EventLogsContext.Provider>
    );
}

export function useEventLogs() {
    return useContext(EventLogsContext);
}

export function useEventLogsDispatch() {
    return useContext(EventLogsDispatchContext);
}

function eventLogsReducer(eventLogs, action) {
    switch (action.type) {
      case 'add': {
        return [...eventLogs, {
            ...action.event,
            id: nextId++,
        }];
      }
      case 'clear': {
        return [];
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }
