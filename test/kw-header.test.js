/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import '../kw-header';

describe('KwHeader', () => {
  it('should have the basic template', async () => {
    const el = await fixture(html`<kw-header></kw-header>`);
    const base = el.shadowRoot.querySelector('.kw-header');

    expect(base).not.to.be.null;
    expect(el).dom.to.equalSnapshot();
  });
});
