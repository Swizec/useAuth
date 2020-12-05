/** @jsx jsx */
import { jsx } from 'theme-ui';
import Layout from './components/layout';

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props} children={element} />
);

export { default as Banner } from './components/banner';
export { default as Cards } from './components/cards';
export { default as Note } from './components/note';
export { default as Tiles } from './components/tiles';

