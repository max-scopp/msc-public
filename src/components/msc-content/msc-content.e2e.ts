import { newE2EPage } from '@stencil/core/testing';

describe('msc-content', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-content></msc-content>');
    const element = await page.find('msc-content');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
