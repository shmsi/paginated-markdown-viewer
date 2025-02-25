# Markdown Book Viewer

A beautiful, interactive digital book viewer that automatically loads sequentially numbered markdown files. Simply create your markdown content files with numeric names (1.md, 2.md, 3.md, etc.) and the viewer will display them as an elegant book.

## Features

- Beautiful book-like interface with realistic page-turning effects
- Automatic detection and loading of numbered markdown files (1.md, 2.md, etc.)
- Table of contents generated from page titles
- Dark/light mode toggle with saved preference
- Responsive design that works on desktop, tablet, and mobile devices
- Syntax highlighting for code blocks
- Touch swipe navigation for mobile devices
- Keyboard navigation (arrow keys and spacebar)
- Bookmark functionality (remembers your last page)
- Stunning typography and layout for a premium reading experience

## Setup Instructions

1. Download the three main files:
   - `index.html` - The HTML structure
   - `styles.css` - The stunning visual styling
   - `script.js` - The functionality

2. Create your markdown content files in the same directory:
   - `1.md` - First page
   - `2.md` - Second page
   - `3.md` - Third page
   - etc.

3. Open `index.html` in your web browser

That's it! The viewer will automatically detect and load your numbered markdown files.

### Running Locally

Due to browser security restrictions, you may need to run this on a local web server if you experience issues with loading the markdown files. You can use Python's built-in HTTP server:

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Then open http://localhost:8000 in your browser.

## Markdown Content Guidelines

### File Naming

Files must be named with sequential numbers followed by the `.md` extension:
- `1.md`
- `2.md`
- `3.md`
- etc.

### Page Titles

The first heading in each markdown file (using `# Title`) will be used as the page title in the table of contents. For example:

```markdown
# Getting Started with Python

Python is a versatile programming language...
```

In this case, "Getting Started with Python" will appear in the table of contents.

### Supported Markdown Features

The viewer supports all standard Markdown syntax plus:

- **Code syntax highlighting** for multiple languages
  ```python
  def hello_world():
      print("Hello, World!")
  ```

- **Tables**
  ```markdown
  | Name  | Age | Role  |
  |-------|-----|-------|
  | Alice | 28  | Admin |
  | Bob   | 35  | User  |
  ```

- **Custom callouts** (notes, warnings, tips)
  ```markdown
  <div class="note">
  This is a note callout.
  </div>

  <div class="warning">
  This is a warning callout.
  </div>

  <div class="tip">
  This is a tip callout.
  </div>
  ```

- **Images** (relative or absolute URLs)
  ```markdown
  ![Alt text](image.jpg)
  ```

## Customization

### Changing the Style

You can easily customize the look and feel by modifying the CSS variables at the top of the `styles.css` file:

```css
:root {
  --book-color: linear-gradient(135deg, #3a7bd5, #2d3e50);
  --page-color: #fff;
  --accent-color: #3a7bd5;
  /* And many more variables you can adjust */
}
```

### Changing the Logo

The book logo on the cover page is an SVG defined in the CSS. You can replace it by modifying the `background-image` property of the `.book-logo` class in `styles.css`.

### Changing the Cover Page

The cover page content can be customized by editing the `createCoverPage()` function in `script.js`.

## Advanced Configuration

### Custom Page Order

If you need to use a different naming scheme or order for your files, you can modify the `loadPages()` function in `script.js` to specify a custom array of file names:

```javascript
// Define our page files
const pageFiles = [
  'introduction.md',
  'chapter1.md',
  'chapter2.md',
  // Add more files here
];
```

### Integrating with a Content Management System

The viewer can be integrated with a CMS by modifying the `fetchMarkdownFile()` function to retrieve content from an API endpoint instead of local files.

## Browser Compatibility

The Markdown Book Viewer works in all modern browsers:

- Chrome (and Chromium-based browsers like Edge, Brave, etc.)
- Firefox
- Safari
- Opera

## License

This project is released under the MIT License. Feel free to use, modify, and distribute it as you see fit.

## Troubleshooting

### Files Not Loading

If your markdown files aren't loading:

1. Make sure they're correctly named with just the number and .md extension
2. Check that they're in the same directory as the HTML file
3. Use a local server as described in the "Running Locally" section
4. Check your browser console for any error messages

### Code Highlighting Issues

If code highlighting isn't working:

1. Make sure you're specifying the language after the opening triple backticks
2. For less common languages, you might need to add the specific language script to the index.html file

## Example Markdown Structure

Here's a simple example of what your `1.md` file might look like:

```markdown
# Introduction to Markdown

## What is Markdown?

Markdown is a lightweight markup language with plain-text formatting syntax.

## Why Use Markdown?

- **Simplicity**: Easy to learn and use
- **Portability**: Works across many platforms
- **Flexibility**: Can be converted to many formats

## Example Code

```python
def greet(name):
    return f"Hello, {name}!"
```

## Next Steps

Check out the next chapter to learn more about advanced formatting.
```

## Acknowledgments

- [Marked.js](https://marked.js.org/) for markdown parsing
- [highlight.js](https://highlightjs.org/) for code syntax highlighting
- All the wonderful open source contributors who make projects like this possible

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to improve the viewer.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Contact

If you have any questions or feedback, please open an issue in the repository.

---

Happy writing and reading with your beautiful new book!
