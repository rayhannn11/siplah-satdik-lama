import store from '../store';
import currentVersion from '../store/version';
import Swal from 'sweetalert2';

// Default check interval in milliseconds (1.5 minutes)
const DEFAULT_CHECK_INTERVAL = 1.5 * 60 * 1000;

let versionCheckInterval = null;

/**
 * Checks if there's a new version available by fetching the version file
 * @param {Function} onUpdateAvailable - Callback when update is available
 */
const checkVersion = async (onUpdateAvailable) => {
  try {
    // Add cache busting parameter to prevent caching
    const cacheBuster = `t=${new Date().getTime()}&r=${Math.random()}`;
    const response = await fetch(`/version.json?${cacheBuster}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch version info:', response.status);
      return;
    }
    
    const data = await response.json();
    const serverVersion = data.version;
    
    console.log(`Current version: ${currentVersion}, Server version: ${serverVersion}`);
    
    // If server version is different from current version, notify about update
    if (serverVersion > currentVersion) {
      console.log('New version detected, triggering update...');
      if (onUpdateAvailable) {
        onUpdateAvailable(serverVersion);
      }
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};

/**
 * Automatically refreshes the page when a new version is available
 * @param {number} newVersion - The new version number
 */
const showUpdateNotification = (newVersion) => {
  console.log('Forcing page refresh due to new version...');
  
  // Clear all caches first
  if ('caches' in window) {
    caches.keys().then(function(names) {
      names.forEach(function(name) {
        caches.delete(name);
      });
    });
  }
  
  // Clear localStorage cache flags
  localStorage.removeItem('cacheVersion');
  localStorage.removeItem('lastCacheUpdate');
  
  // Force hard refresh
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      registrations.forEach(function(registration) {
        registration.unregister();
      });
      // Hard refresh after unregistering service worker
      setTimeout(() => {
        window.location.href = window.location.href + '?v=' + newVersion + '&t=' + Date.now();
      }, 100);
    });
  } else {
    // Fallback hard refresh
    window.location.href = window.location.href + '?v=' + newVersion + '&t=' + Date.now();
  }
};

/**
 * Starts the version checking service
 * @param {number} interval - Check interval in milliseconds (default: 2 minutes)
 */
export const startVersionChecker = (interval = DEFAULT_CHECK_INTERVAL) => {
  // Clear any existing interval
  if (versionCheckInterval) {
    clearInterval(versionCheckInterval);
  }
  
  // Initial check after 10 seconds
  setTimeout(() => {
    checkVersion(showUpdateNotification);
  }, 10000);
  
  // Set up regular interval checks
  versionCheckInterval = setInterval(() => {
    checkVersion(showUpdateNotification);
  }, interval);
};

/**
 * Stops the version checking service
 */
export const stopVersionChecker = () => {
  if (versionCheckInterval) {
    clearInterval(versionCheckInterval);
    versionCheckInterval = null;
  }
};
