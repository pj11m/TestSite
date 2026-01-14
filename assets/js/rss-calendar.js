/**
 * RSS Calendar Feed Parser
 * This script fetches and displays events from RSS calendar feeds
 */

class RSSCalendar {
  constructor(options) {
    this.options = {
      corsProxy: 'https://cors-anywhere.herokuapp.com/',
      ...options
    };
    this.feeds = options.feeds || {};
  }

  /**
   * Initialize the calendar
   */
  init() {
    this.loadFeeds();
  }

  /**
   * Load all configured RSS feeds
   */
  loadFeeds() {
    Object.keys(this.feeds).forEach(feedId => {
      const feed = this.feeds[feedId];
      this.fetchFeed(feed.url, feed.containerId);
    });
  }

  /**
   * Fetch and parse an RSS feed
   * @param {string} url - The RSS feed URL
   * @param {string} containerId - The ID of the container element
   */
  async fetchFeed(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      // Use CORS proxy to fetch the feed
      const response = await fetch(this.options.corsProxy + url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const text = await response.text();
      this.parseFeed(text, container);
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
      container.innerHTML = '<p>Error loading events. Please try again later.</p>';
      
      // If demo mode is enabled, load demo events
      if (this.options.demoMode) {
        this.loadDemoEvents(containerId);
      }
    }
  }

  /**
   * Parse RSS XML and display events
   * @param {string} xml - The RSS XML content
   * @param {HTMLElement} container - The container element
   */
  parseFeed(xml, container) {
    // Clear loading message
    container.innerHTML = '';
    
    try {
      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      const items = xmlDoc.querySelectorAll('item');
      
      if (items.length === 0) {
        container.innerHTML = '<p>No events found.</p>';
        return;
      }
      
      // Process each event item
      items.forEach(item => {
        const title = item.querySelector('title')?.textContent || 'No Title';
        const description = item.querySelector('description')?.textContent || 'No description available';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '#';
        
        // Format date
        const eventDate = pubDate ? new Date(pubDate) : new Date();
        const formattedDate = this.formatDate(eventDate);
        
        // Create event element
        this.createEventElement(container, {
          title,
          description,
          date: formattedDate,
          link
        });
      });
    } catch (error) {
      console.error('Error parsing RSS feed:', error);
      container.innerHTML = '<p>Error parsing events. Please try again later.</p>';
      
      // If demo mode is enabled, load demo events
      if (this.options.demoMode) {
        this.loadDemoEvents(container.id);
      }
    }
  }

  /**
   * Format a date for display
   * @param {Date} date - The date to format
   * @returns {string} - Formatted date string
   */
  formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Create an event element and add it to the container
   * @param {HTMLElement} container - The container element
   * @param {Object} event - The event data
   */
  createEventElement(container, event) {
    const eventElement = document.createElement('div');
    eventElement.className = 'event-item';
    
    eventElement.innerHTML = `
      <div class="event-date">${event.date}</div>
      <h3 class="event-title">
        ${event.link && event.link !== '#' 
          ? `<a href="${event.link}" target="_blank">${event.title}</a>` 
          : event.title}
      </h3>
      <div class="event-description">${event.description}</div>
    `;
    
    container.appendChild(eventElement);
  }

  /**
   * Load demo events when RSS feeds are unavailable
   * @param {string} containerId - The ID of the container element
   */
  loadDemoEvents(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // Demo events - customize as needed
    const demoEvents = this.getDemoEvents(containerId);
    
    demoEvents.forEach(event => {
      this.createEventElement(container, event);
    });
  }

  /**
   * Get demo events based on container ID
   * @param {string} containerId - The ID of the container element
   * @returns {Array} - Array of demo events
   */
  getDemoEvents(containerId) {
    // Base demo events
    const baseEvents = [
      {
        title: 'City Council Meeting',
        date: 'Monday, June 10, 2024, 6:00 PM',
        description: 'Regular city council meeting to discuss budget proposals and community development projects.',
        link: '#'
      },
      {
        title: 'Downtown Farmers Market',
        date: 'Saturday, June 15, 2024, 8:00 AM',
        description: 'Weekly farmers market featuring local produce, crafts, and food vendors.',
        link: '#'
      },
      {
        title: 'Planning Commission',
        date: 'Thursday, June 20, 2024, 5:30 PM',
        description: 'Monthly planning commission meeting to review zoning requests and development plans.',
        link: '#'
      }
    ];
    
    // Filter events based on container ID
    if (containerId.includes('city-meetings')) {
      return baseEvents.filter(event => 
        event.title.includes('Council') || 
        event.title.includes('Commission')
      );
    } else if (containerId.includes('community-events')) {
      return baseEvents.filter(event => 
        !event.title.includes('Council') && 
        !event.title.includes('Commission')
      );
    }
    
    return baseEvents;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RSSCalendar;
}