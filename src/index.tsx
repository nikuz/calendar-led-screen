/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App.tsx';
import './fonts.css';
import './index.css';

const root = document.getElementById('root');

render(() => <App />, root!);
