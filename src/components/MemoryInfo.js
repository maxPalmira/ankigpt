import React, { useState, useEffect } from 'react';

const bytesToMegabytes = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2); // Convert bytes to megabytes and round to 2 decimal places
};

const MemoryInfo = () => {
  const [memory, setMemory] = useState({
    totalJSHeapSize: 0,
    usedJSHeapSize: 0,
    jsHeapSizeLimit: 0,
  });

  useEffect(() => {
    const updateMemoryInfo = () => {
      if (performance.memory) {
        const memoryInfo = performance.memory;
        setMemory({
          totalJSHeapSize: bytesToMegabytes(memoryInfo.totalJSHeapSize),
          usedJSHeapSize: bytesToMegabytes(memoryInfo.usedJSHeapSize),
          jsHeapSizeLimit: bytesToMegabytes(memoryInfo.jsHeapSizeLimit),
        });
      }
    };

    // Update memory info every 1 second
    const memoryInterval = setInterval(updateMemoryInfo, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(memoryInterval);
  }, []);

  const styles = {
    container: {
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px',
      maxWidth: '300px',
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: '18px',
      marginBottom: '8px',
    },
    infoItem: {
      fontSize: '16px',
      marginBottom: '4px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Memory Info</h2>
      <p style={styles.infoItem}>Total JS Heap Size: {memory.totalJSHeapSize} MB</p>
      <p style={styles.infoItem}>Used JS Heap Size: {memory.usedJSHeapSize} MB</p>
      <p style={styles.infoItem}>JS Heap Size Limit: {memory.jsHeapSizeLimit} MB</p>
    </div>
  );
};

export default MemoryInfo;
