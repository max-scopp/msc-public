import { newE2EPage } from '@stencil/core/testing';

describe('msc-icon', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-icon></msc-icon>');
    const element = await page.find('msc-icon');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
