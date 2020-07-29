import { newE2EPage } from '@stencil/core/testing';

describe('msc-define', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<msc-define></msc-define>');
    const element = await page.find('msc-define');
    expect(element).toHaveClass('hydrated');
  }); { cursor }
});
