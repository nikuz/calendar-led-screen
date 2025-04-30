import { Router, Route } from '@solidjs/router';
import App from './App';
import Calendar from '@calendar/Calendar';

export default () => (
    <Router root={App}>
        <Route path="/" component={Calendar} />
        {/* <Route path="/users" component={Users} /> */}
    </Router>
);