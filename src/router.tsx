import { Router, Route } from '@solidjs/router';
import App from './App';
import CalendarPage from '@calendar/CalendarPage';
import GamePage from '@game/GamePage';
import VipasanaPage from '@vipasana/VipasanaPage';
import {
    ROUTER_HOME,
    ROUTER_GAME,
    ROUTER_VIPASANA,
} from 'src/constants';

export default () => (
    <Router root={App}>
        <Route path={ROUTER_HOME} component={CalendarPage} />
        <Route path={ROUTER_GAME} component={GamePage} />
        <Route path={ROUTER_VIPASANA} component={VipasanaPage} />
    </Router>
);