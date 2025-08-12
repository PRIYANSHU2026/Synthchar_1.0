"use client";

import { useState, useRef, type FC, type InputHTMLAttributes, useEffect, RefObject } from 'react';
import type { AtomicMass } from '@/types';

interface ElementAutoSuggestProps {
  value: string;
  onChange: (val: string) => void;
  atomics: AtomicMass[];
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  inputRef?: RefObject<HTMLInputElement>;
}

const ElementAutoSuggest: FC<ElementAutoSuggestProps> = ({ value, onChange, atomics, inputProps, inputRef }) => {
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  
  // Use provided ref or internal ref
  const effectiveInputRef = inputRef || internalInputRef;

  const val = value || "";
  const trimmed = val.trim();

  // Extract the last token that could be an element symbol
  const lastToken = trimmed.match(/[A-Z][a-z]*$/)?.[0] ?? "";

  // Only show suggestions if the user is specifically looking for element suggestions
  // by starting with a capital letter
  const showSuggestions = lastToken.length > 0 && /^[A-Z]/.test(lastToken);

  // Memoize suggestions for better performance
  const suggestions = (showSuggestions && atomics.length > 0)
    ? atomics
        .filter(a => {
          // Prioritize exact symbol matches first
          const symbolMatch = a.Symbol.toLowerCase().startsWith(lastToken.toLowerCase());
          const elementMatch = a.Element?.toLowerCase().startsWith(lastToken.toLowerCase());
          return symbolMatch || elementMatch;
        })
        .sort((a, b) => {
          // Sort exact matches first
          const aExact = a.Symbol.toLowerCase() === lastToken.toLowerCase();
          const bExact = b.Symbol.toLowerCase() === lastToken.toLowerCase();
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          
          // Then sort by symbol length (shorter first)
          return a.Symbol.length - b.Symbol.length;
        })
        .slice(0, 10) // max 10 suggestions
    : [];

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlight >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('.element-suggest-item');
      if (items[highlight]) {
        items[highlight].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlight]);

  // Handle keyboard navigation in dropdown - optimized for better typing experience
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle custom onKeyDown from inputProps first
    if (inputProps?.onKeyDown) {
      // Clone the event to prevent issues with synthetic events
      const event = { ...e };
      
      // Only if suggestions are shown and Enter is pressed with a highlight,
      // we handle it here and don't propagate
      if (suggestions.length > 0 && e.key === "Enter" && highlight >= 0) {
        e.preventDefault();
        pick(highlight);
        return;
      }
      
      // Otherwise, call the custom handler
      inputProps.onKeyDown(event as React.KeyboardEvent<HTMLInputElement>);
      
      // If the event was prevented by the custom handler, don't continue
      if (event.defaultPrevented) return;
    }
    
    // Only handle dropdown navigation if we have suggestions
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      setHighlight(h => Math.min(h + 1, suggestions.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlight(h => Math.max(h - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter" && highlight >= 0) {
      e.preventDefault();
      pick(highlight);
    } else if (e.key === "Escape") {
      setFocused(false);
      effectiveInputRef.current?.blur();
    }
  };

  const pick = (idx: number) => {
    if (!suggestions[idx]) return;

    // Replace just the last (possibly partial) symbol, not the whole input
    let newVal = val;
    if (lastToken) {
      // Replace lastToken (e.g. "L" in "La2O3")
      newVal = val.replace(/[A-Z][a-z]*$/, suggestions[idx].Symbol);
    } else {
      newVal = suggestions[idx].Symbol;
    }

    // Save current selection position for cursor restoration
    const selectionStart = effectiveInputRef.current?.selectionStart || 0;
    
    // Determine new cursor position after suggestion
    const positionAdjustment = suggestions[idx].Symbol.length - lastToken.length;
    const newPosition = selectionStart + positionAdjustment;
    
    // Keep focus state active to prevent dropdown from closing
    setFocused(true);
    
    // Ensure focus is maintained before updating value
    if (document.activeElement !== effectiveInputRef.current) {
      effectiveInputRef.current?.focus();
    }
    
    // Update value and reset highlight
    onChange(newVal);
    setHighlight(-1);

    // Use a more efficient approach for cursor position restoration
    // that minimizes focus loss during rapid typing or selection
    queueMicrotask(() => {
      if (effectiveInputRef.current) {
        // Ensure input is focused
        if (document.activeElement !== effectiveInputRef.current) {
          effectiveInputRef.current.focus();
        }
        
        // Set cursor position
        effectiveInputRef.current.setSelectionRange(newPosition, newPosition);
        
        // Use requestAnimationFrame for UI updates that need to happen after the next paint
        requestAnimationFrame(() => {
          // Final focus check to ensure we maintain focus
          if (document.activeElement !== effectiveInputRef.current) {
            effectiveInputRef.current?.focus();
          }
        });
      }
    });
  };

  // Hide dropdown if unfocused
  const onBlur = () => {
    // Increased delay to allow click on suggestion to register
    setTimeout(() => {
      // Only unfocus if we're not trying to interact with the component
      if (document.activeElement !== effectiveInputRef.current && 
          !listRef.current?.contains(document.activeElement as Node)) {
        setFocused(false);
      } else {
        // Try to refocus if needed
        effectiveInputRef.current?.focus();
      }
    }, 300);
  };

  return (
    <div className="relative w-full">
      <input
        {...inputProps}
        ref={effectiveInputRef}
        className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                    file:border-0 file:bg-transparent file:text-sm file:font-medium
                    placeholder:text-muted-foreground focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    disabled:cursor-not-allowed disabled:opacity-50 ${inputProps?.className || ''}`}
        value={val}
        onFocus={() => setFocused(true)}
        onBlur={onBlur}
        onChange={e => {
          const cursorPosition = e.target.selectionStart;
          const newValue = e.target.value;
          
          // Keep focus state active during typing
          setFocused(true);
          
          // Update value and reset highlight immediately for responsive typing
          onChange(newValue);
          setHighlight(-1);

          // Use a more optimized approach for cursor position restoration
          if (cursorPosition !== null) {
            // Ensure we maintain focus during typing with minimal delay
            // This prevents focus loss during rapid typing
            requestAnimationFrame(() => {
              if (effectiveInputRef.current) {
                effectiveInputRef.current.focus();
                effectiveInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
                
                // Use a microtask for better performance than setTimeout
                queueMicrotask(() => {
                  if (document.activeElement !== effectiveInputRef.current) {
                    effectiveInputRef.current?.focus();
                  }
                });
              }
            });
          }
        }}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />

      {focused && suggestions.length > 0 && (
        <div
          ref={listRef}
          className="element-suggest-menu absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md
                     border border-muted bg-popover p-1 text-popover-foreground shadow-md
                     animate-in fade-in-80 zoom-in-95"
        >
          {suggestions.map((sug, i) => (
            <div
              key={sug.Symbol}
              className={`element-suggest-item relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5
                         text-sm outline-none transition-colors
                         ${i === highlight
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'}`}
              onMouseDown={e => { e.preventDefault(); pick(i); }}
              onMouseEnter={() => setHighlight(i)}
            >
              <span className="mr-2 font-medium">{sug.Symbol}</span>
              <span className="text-muted-foreground">{sug.Element}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElementAutoSuggest;
