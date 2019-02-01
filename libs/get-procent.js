
module.exports = ({ full, part }) => {
  if (!full || !part) {
    return 0;
  }
  const procent = ((part / full) * 100);

  if (procent % parseInt(procent) !== 0) {
    return procent.toFixed(1)
  }
  return procent;
};
