import { newE2EPage } from '@stencil/core/testing';

describe('msc-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-list></msc-list>');
    const element = await page.find('msc-list');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
