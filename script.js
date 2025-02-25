document.addEventListener('DOMContentLoaded', async function() {
  // Configure marked.js to use highlight.js for code syntax highlighting
  marked.setOptions({
    highlight: function(code, language) {
      if (language && hljs.getLanguage(language)) {
        return hljs.highlight(code, { language }).value;
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
  });
  
  const bookContainer = document.getElementById('book-container');
  const book = document.getElementById('book');
  const pageIndicator = document.getElementById('page-indicator');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const tocToggle = document.getElementById('toc-toggle');
  const toc = document.getElementById('toc');
  const tocLinks = document.getElementById('toc-links');
  const themeToggle = document.getElementById('theme-toggle');
  const loader = document.querySelector('.loader');
  const errorMsg = document.getElementById('error-msg');
  const progressBar = document.querySelector('.progress-bar');
  
  let pages = [];
  let currentPageIndex = 0;
  let totalPages = 0;
  let titles = [];
  
  // Toggle table of contents
  tocToggle.addEventListener('click', function() {
    toc.classList.toggle('visible');
  });
  
  // Toggle dark/light mode
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀' : '☾';
    
    // Store the theme preference
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });

  // Load theme preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀';
  }

  // Function to show error
  function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    setTimeout(() => {
      errorMsg.style.display = 'none';
    }, 10000); // Hide after 10 seconds
    loader.classList.add('hidden');
  }

  // Function to update progress bar
  function updateProgressBar() {
    const progress = ((currentPageIndex + 1) / totalPages) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Create a table of contents
  function updateTableOfContents() {
    tocLinks.innerHTML = '';
    
    // Add cover page to TOC
    const coverLink = document.createElement('div');
    coverLink.className = 'toc-link';
    coverLink.textContent = 'Cover';
    coverLink.addEventListener('click', () => goToPage(0));
    if (currentPageIndex === 0) {
      coverLink.classList.add('active');
    }
    tocLinks.appendChild(coverLink);
    
    // Add content pages to TOC
    titles.forEach((title, index) => {
      const link = document.createElement('div');
      link.className = 'toc-link';
      link.textContent = title;
      link.addEventListener('click', () => goToPage(index + 1));
      if (currentPageIndex === index + 1) {
        link.classList.add('active');
      }
      tocLinks.appendChild(link);
    });
  }

  // Create a cover page
  function createCoverPage() {
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'page-wrapper';
    
    const pageFront = document.createElement('div');
    pageFront.className = 'page-front';
    
    const coverPage = document.createElement('div');
    coverPage.className = 'cover-page';
    
    // Get the title from the document or use a default
    const docTitle = document.title || 'Markdown Book';
    
    coverPage.innerHTML = `
      <div class="decoration decoration-1">{ }</div>
      <div class="book-logo"></div>
      <div class="cover-content">
        <h1 class="cover-title">${docTitle}</h1>
        <p class="cover-subtitle">A beautiful digital book</p>
        <p class="cover-author">Created with the Markdown Book Viewer</p>
      </div>
      <div class="decoration decoration-2">{ }</div>
    `;
    
    pageFront.appendChild(coverPage);
    pageWrapper.appendChild(pageFront);
    
    return pageWrapper;
  }

  // Extract title from markdown content
  function extractTitle(content) {
    const match = content.match(/^# (.+)$/m);
    return match ? match[1] : 'Untitled';
  }

  // Create a page element from markdown content
  function createPageElement(content, pageNumber) {
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'page-wrapper';
    
    const pageFront = document.createElement('div');
    pageFront.className = 'page-front';
    
    const pageContent = document.createElement('div');
    pageContent.className = 'page-content';
    pageContent.setAttribute('data-page', pageNumber);
    
    try {
      // Parse the markdown content
      pageContent.innerHTML = marked.parse(content);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      pageContent.innerHTML = `<h1>Error Parsing Page ${pageNumber}</h1><p>There was an error rendering this page.</p>`;
    }
    
    // Add page corner for turning effect
    const pageCorner = document.createElement('div');
    pageCorner.className = 'page-corner';
    pageCorner.addEventListener('click', goToNextPage);
    
    pageFront.appendChild(pageContent);
    pageFront.appendChild(pageCorner);
    pageWrapper.appendChild(pageFront);
    
    return pageWrapper;
  }

  // Function to go to a specific page
  function goToPage(index) {
    if (index < 0 || index >= pages.length) return;
    
    // Hide all pages
    pages.forEach(page => {
      page.classList.remove('active');
      page.classList.remove('flipped');
    });
    
    // Show the target page
    pages[index].classList.add('active');
    
    // Flip previous pages
    for (let i = 0; i < index; i++) {
      pages[i].classList.add('flipped');
    }
    
    currentPageIndex = index;
    updatePageIndicator();
    updateProgressBar();
    updateTableOfContents();
    
    // Save current page in local storage
    localStorage.setItem('currentPage', index);
  }

  // Update the page indicator
  function updatePageIndicator() {
    pageIndicator.textContent = `Page ${currentPageIndex + 1} / ${totalPages}`;
  }

  // Functions to navigate through pages
  function goToPrevPage() {
    if (currentPageIndex > 0) {
      goToPage(currentPageIndex - 1);
    }
  }

  function goToNextPage() {
    if (currentPageIndex < pages.length - 1) {
      goToPage(currentPageIndex + 1);
    }
  }

  // Fetch the markdown file with error handling and retries
  async function fetchMarkdownFile(pageFile, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(pageFile);
        
        if (!response.ok) {
          console.warn(`Attempt ${i+1}: Failed to fetch ${pageFile} - Status: ${response.status}`);
          if (i === retries - 1) {
            throw new Error(`Failed to load ${pageFile}: ${response.status} ${response.statusText}`);
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
          continue;
        }
        
        return await response.text();
      } catch (error) {
        console.error(`Attempt ${i+1}: Error fetching ${pageFile}:`, error);
        if (i === retries - 1) {
          throw error;
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // Check if a page file exists
  async function checkPageExists(pageNumber) {
    try {
      const response = await fetch(`${pageNumber}.md`, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Load markdown files and create pages
  async function loadPages() {
    try {
      console.log('Starting to load pages...');
      
      // Add the cover page
      const coverPage = createCoverPage();
      book.appendChild(coverPage);
      pages.push(coverPage);
      
      let pageNumber = 1;
      let loadedCount = 0;
      let consecutiveFailures = 0;
      const maxConsecutiveFailures = 3; // Stop trying after 3 consecutive failures
      
      // Keep trying to load pages until we reach 3 consecutive failures
      while (consecutiveFailures < maxConsecutiveFailures) {
        const pageFile = `${pageNumber}.md`;
        
        try {
          console.log(`Checking if ${pageFile} exists...`);
          
          // Check if the page exists before trying to fetch it
          const exists = await checkPageExists(pageNumber);
          
          if (!exists) {
            console.log(`${pageFile} does not exist.`);
            consecutiveFailures++;
            pageNumber++;
            continue;
          }
          
          console.log(`Loading ${pageFile}...`);
          
          // Fetch the markdown content with retries
          const content = await fetchMarkdownFile(pageFile);
          
          // Extract the title and create a page
          const title = extractTitle(content);
          titles.push(title);
          
          const pageElement = createPageElement(content, pageNumber);
          book.appendChild(pageElement);
          pages.push(pageElement);
          
          loadedCount++;
          consecutiveFailures = 0; // Reset failures counter on success
          console.log(`Successfully loaded ${pageFile}`);
        } catch (error) {
          console.error(`Failed to load ${pageFile}:`, error);
          consecutiveFailures++;
        }
        
        pageNumber++;
      }
      
      totalPages = pages.length;
      
      if (loadedCount === 0) {
        showError(`No markdown files found. Please ensure you have files named "1.md", "2.md", etc. in the same directory.`);
        // Create a help page
        const helpContent = `# No Pages Found\n\nNo markdown files were found. Please ensure you have created markdown files with the following naming pattern:\n\n- 1.md\n- 2.md\n- 3.md\n- etc.\n\nThese files should be in the same directory as this HTML file.`;
        const helpPage = createPageElement(helpContent, 1);
        book.appendChild(helpPage);
        pages.push(helpPage);
        titles.push('Help');
      }
      
      totalPages = pages.length;
      
      // Update UI
      updateTableOfContents();
      updatePageIndicator();
      updateProgressBar();
      
      // Restore the last viewed page from local storage or show the first page
      const savedPage = localStorage.getItem('currentPage');
      if (savedPage !== null && !isNaN(savedPage) && parseInt(savedPage) < pages.length) {
        goToPage(parseInt(savedPage));
      } else {
        goToPage(0);
      }
      
      // Hide loader
      loader.classList.add('hidden');
      
    } catch (error) {
      console.error('Error initializing book:', error);
      showError('Failed to initialize the book. Please check the console for details.');
    }
  }

  // Add event listeners for navigation
  prevBtn.addEventListener('click', goToPrevPage);
  nextBtn.addEventListener('click', goToNextPage);
  
  // Add keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      goToPrevPage();
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
      goToNextPage();
    }
  });
  
  // Add touch swipe navigation for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, false);
  
  document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);
  
  function handleSwipe() {
    const threshold = 100; // Minimum distance for swipe
    
    if (touchEndX - touchStartX > threshold) {
      // Swipe right - go to previous page
      goToPrevPage();
    } else if (touchStartX - touchEndX > threshold) {
      // Swipe left - go to next page
      goToNextPage();
    }
  }
  
  // Start loading pages
  loadPages();
});
