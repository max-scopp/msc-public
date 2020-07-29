import { newE2EPage } from '@stencil/core/testing';

describe('msc-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-modal></msc-modal>');
    const element = await page.find('msc-modal');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
