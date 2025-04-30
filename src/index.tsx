/* @refresh reload */
import { render } from 'solid-js/web';
import Router from './router';
import './fonts.css';
import './index.css';

const root = document.getElementById('root');

render(() => <Router />, root!);
