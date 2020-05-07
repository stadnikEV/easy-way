
module.exports = ({ numperWords, matchProcent }) => {
  const words = Math.ceil((numperWords / 100) * matchProcent);
  if (words > numperWords) {
    return numperWords;
  }
  return Math.ceil((numperWords / 100) * matchProcent);
};
