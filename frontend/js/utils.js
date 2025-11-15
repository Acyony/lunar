export const formatUnixTimestamp = (timestamp, format = 'datetime') => {
  if (!timestamp || timestamp === 0) {
    return 'N/A';
  }

  const date = new Date(timestamp * 1000);

  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  switch (format) {
    case 'time':
      return date.toLocaleTimeString();
    case 'date':
      return date.toLocaleDateString();
    case 'datetime':
    default:
      return date.toLocaleString();
  }
};
