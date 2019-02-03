
module.exports = ({ phone }) => {
  const phones = [];
  for(let i = 0; i < 3; i +=1) {
    if (phone[i]) {
      phones.push(phone[i]);
    }
  }

  return phones.join(' ');
}
