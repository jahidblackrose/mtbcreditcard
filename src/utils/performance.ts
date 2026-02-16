/**
 * Performance optimization utilities
 * Tools for measuring and optimizing app performance
 */

/**
 * Measure performance of async operations
 */
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  if (typeof performance === 'undefined' || !performance.mark) {
    return fn();
  }

  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-measure`;

  try {
    performance.mark(startMark);
    const result = await fn();
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);

    const measure = performance.getEntriesByName(measureName)[0];
    if (measure && measure.duration > 100) {
      console.warn(`⚠️ Slow operation: ${name} took ${measure.duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    console.error(`Error in ${name}:`, error);
    throw error;
  } finally {
    // Clean up marks and measures
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
  }
};

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load images with Intersection Observer
 */
export const lazyLoadImage = (
  img: HTMLImageElement,
  src: string,
  rootMargin: string = '50px'
): void => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      },
      { rootMargin }
    );

    observer.observe(img);
  } else {
    // Fallback for older browsers
    img.src = src;
  }
};

/**
 * Report web vitals to monitoring service
 */
export const reportWebVitals = (metric: any): void => {
  const { name, value, id } = metric;

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${name}:`, Math.round(value), id);
  }

  // Send to analytics service in production
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }
};

/**
 * Get device performance capability
 */
export const getDeviceCapability = (): 'low' | 'medium' | 'high' => {
  // Check hardware concurrency
  const cores = navigator.hardwareConcurrency || 2;

  // Check memory (if available)
  const memory = (navigator as any).deviceMemory || 4;

  // Check connection (if available)
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || '4g';

  if (cores <= 2 || memory <= 2 || effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'low';
  }

  if (cores <= 4 || memory <= 4 || effectiveType === '3g') {
    return 'medium';
  }

  return 'high';
};

/**
 * Disable animations for low-end devices
 */
export const shouldReduceMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Request animation frame with fallback
 */
export const rafFallback = (callback: () => void): void => {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 16); // ~60fps
  }
};

/**
 * Batch DOM updates for performance
 */
export const batchDOMUpdates = (updates: Array<() => void>): void => {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

/**
 * Memoize expensive calculations
 */
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
};

/**
 * Clear memory cache periodically
 */
export const setupCacheCleanup = (cache: Map<any, any>, intervalMs: number = 60000): void => {
  setInterval(() => {
    if (cache.size > 100) {
      const keysToDelete = Array.from(cache.keys()).slice(0, 50);
      keysToDelete.forEach(key => cache.delete(key));
      console.log(`[Performance] Cache cleanup: removed ${keysToDelete.length} entries`);
    }
  }, intervalMs);
};
