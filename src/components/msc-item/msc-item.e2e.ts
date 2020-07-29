import { newE2EPage } from '@stencil/core/testing';

describe('msc-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-item></msc-item>');
    const element = await page.find('msc-item');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
