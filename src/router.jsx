import { Router, Route } from "@solidjs/router";

export default () => (
    <Router root={App}>
        <Route path="/" component={Home} />
        <Route path="/users" component={Users} />
    </Router>
);