import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the title', () => {
    render(<Home />);
    const heading = screen.getByText(/Sustainability Assessment Platform/i);
    expect(heading).toBeInTheDocument();
  });
});