import { Time, Events } from 'src/components';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'src/constants';
import './App.css';

export default function App() {
    return (
        <div
            id="app-container"
            style={{
                width: `${SCREEN_WIDTH}px`,
                height: `${SCREEN_HEIGHT}px`,
            }}
        >
            <Time />
            <Events />
        </div>
    );
}
