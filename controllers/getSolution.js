const parse = require('url-parse');

module.exports = (url) => {
  const data = parse(url, true);
  const challenge = data.pathname.replace(/\/challenges\//, '');
  const solution = data.query.solution.replace(/fccss/, '<script>').replace(/fcces/, '</script>');
  return {
      challenge,
      solution
  };
}