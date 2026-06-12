import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import '@fontsource/inter';
import '@fontsource/playfair-display';

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
