const formatCount = (count) => {
  if (count < 1e3) return count;
  if (count >= 1e3 && count < 1e6)
    return `${+(count / 1e3).toFixed(1) + 'K'}`.replace('.', ',');
  if (count >= 1e6 && count < 1e9)
    return `${+(count / 1e6).toFixed(1) + 'M'}`.replace('.', ',');
  if (count >= 1e9 && count < 1e12)
    return `${+(count / 1e9).toFixed(1) + 'B'}`.replace('.', ',');
  if (count >= 1e12)
    return `${+(count / 1e12).toFixed(1) + 'T'}`.replace('.', ',');
};

export default formatCount;
