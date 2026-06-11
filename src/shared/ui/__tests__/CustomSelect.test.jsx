import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CustomSelect from '../CustomSelect';

describe('CustomSelect', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];

  it('renders correctly with correct ARIA roles', () => {
    render(<CustomSelect options={options} value="1" onChange={vi.fn()} />);

    const button = screen.getByRole('combobox');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // SVGs should have aria-hidden
    const svg = button.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('opens listbox and shows options on click', () => {
    render(<CustomSelect options={options} value="1" onChange={vi.fn()} />);
    
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const optionElements = screen.getAllByRole('option');
    expect(optionElements).toHaveLength(2);
    expect(optionElements[0]).toHaveAttribute('aria-selected', 'true');
    expect(optionElements[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange when an option is selected', () => {
    const handleChange = vi.fn();
    render(<CustomSelect options={options} value="1" onChange={handleChange} />);
    
    const button = screen.getByRole('combobox');
    fireEvent.click(button);

    const option2 = screen.getByText('Option 2');
    fireEvent.click(option2);

    expect(handleChange).toHaveBeenCalledWith('2');
  });
});
