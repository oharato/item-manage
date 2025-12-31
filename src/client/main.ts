import Alpine from 'alpinejs';
import app from './app';
import './main.css';

window.Alpine = Alpine;
Alpine.data('app', app);
Alpine.start();
