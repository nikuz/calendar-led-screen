import { Router, Route } from '@solidjs/router';
import App from './App';
import CalendarPage from '@calendar/Calendar';
import GamePage from '@game/Game';
import {
    ROUTER_HOME,
    ROUTER_GAME,
} from 'src/constants';

export default () => (
    <Router root={App}>
        <Route path={ROUTER_HOME} component={CalendarPage} />
        <Route path={ROUTER_GAME} component={GamePage} />
    </Router>
);