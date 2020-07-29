import { newE2EPage } from '@stencil/core/testing';

describe('msc-loader', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-loader></msc-loader>');
    const element = await page.find('msc-loader');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
