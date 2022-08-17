
# VARIABLE NAMING CONVENTION

> "There are only two hard things in computer science: cache invalidation, and naming things." - Phil Karlton

This quote rings especially true for colors.

## WHY?

Because rebranding happens, requirements change, and sometimes you want alternate themes like light and dark mode.  This is frustratingly limiting, hence why it's so tempting to give up and name things intuitively.  Some shades  of red might be labeled "merlot" or "crimson", and that's friendly to type and friendly to remember.  But we have  to be cognizant the dangers that go along with that.  You've rebranded, and now you figure out all the variables  aren't very ... variable.  Merlot's COLOR changed to navy, and crimson to cobalt, but the variable NAMES haven't.  Oof, confusing.  I've been there, and I don't want to go back.

## HOW?

It's been a maddening journey to figure out a sane naming convention that's also flexible and terse.  For this boilerplate, we're going to try a naming convention that applies some meaning to the palette without locking us into one particular color, nor even the visual description of that color, like "light" or "saturated" or something.  Although it's a tall order, the goal is to cross that bridge between design and code in an easy way.

## RULES

```css
--color-palette-1
--color-palette-1-c
--color-palette-1-1
--color-palette-1-2
--color-palette-1-3
```

1. Prefix the color with `--color` to differentiate from other types of CSS variables, like size or font.

2. Label the name of the palette, like `-brand` for example.  Palette names can be semantic in such a way that they group all the colors used for "focus", "disabled", "warning", "error", etc.  Try to avoid names that lock to a particular use case, like "table" or "button," as you may reuse those colors across different elements.  Even names like "background" and "foreground" trap us into those roles, since such variables are often swapped for nested boxes, in which case the variable names become misleading.

3. Assign a number to the color; this retains the meaning of words like "primary," "secondary," and so on, but it allows us to continue adding colors infinitely instead of spending pointless time humming and hawing over what comes after "tertiary."  For example, `--color-brand-1`.

4. Successive variables should be suffixed by either `-c` or a number.
    - The `-c` is short for contrast, and ascribes accessible meaning to the color as it contrasts with the base color. For example: `--color-brand-1-c` is a safe text color to overlap `--color-brand-1` and vice versa.
    - An extra number just denotes that this color loosely belongs together with the base color, but their relationship is not meaningful enough to concern ourselves with it.  For example, if we have a very shiny OK button that uses 7 different shades of green, we can loosely group all those colors in the same bucket. `--color-success-1` could be accompanied by `--color-success-1-1`, `--color-success-1-2`, and so on.

## SUMMARY

- Avoid lock-in naming, such as "red" or "button".
- Use `-1-c` for contrast and any `-1-1` number for loosely related colors.