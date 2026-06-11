import React, { useState, useRef, useEffect, useId } from 'react';
import styles from './CustomSelect.module.css';

const CustomSelect = ({ id, value, onChange, options, placeholder = "Seleziona un'opzione" }) => {
  const generatedId = useId();
  const componentId = id || generatedId;
  const listboxId = `${componentId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update active index when opening or value changes
  useEffect(() => {
    if (isOpen) {
      const index = options.findIndex((opt) => opt.value === value);
      setActiveIndex(index !== -1 ? index : 0);
      
      // Auto-scroll to selected option
      if (index !== -1) {
        const optionEl = document.getElementById(`${componentId}-option-${index}`);
        if (optionEl && typeof optionEl.scrollIntoView === 'function') {
          optionEl.scrollIntoView({ block: 'nearest' });
        }
      }
    }
  }, [isOpen, value, options, componentId]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => {
          const nextIndex = (prev + 1) % options.length;
          const optionEl = document.getElementById(`${componentId}-option-${nextIndex}`);
          if (optionEl && typeof optionEl.scrollIntoView === 'function') optionEl.scrollIntoView({ block: 'nearest' });
          return nextIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => {
          const nextIndex = (prev - 1 + options.length) % options.length;
          const optionEl = document.getElementById(`${componentId}-option-${nextIndex}`);
          if (optionEl && typeof optionEl.scrollIntoView === 'function') optionEl.scrollIntoView({ block: 'nearest' });
          return nextIndex;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          handleSelect(options[activeIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.customSelectWrapper} ref={selectRef}>
      <button
        type="button"
        id={componentId}
        role="combobox"
        className={`${styles.selectTrigger} ${isOpen ? styles.open : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen && activeIndex >= 0 ? `${componentId}-option-${activeIndex}` : undefined
        }
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.selectValue}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          aria-hidden="true"
          className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          className={styles.selectOptions}
          role="listbox"
          tabIndex="-1"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li
                key={option.value}
                id={`${componentId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`${styles.option} ${isActive ? styles.active : ''} ${
                  isSelected ? styles.selected : ''
                }`}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
