const parse = require('url-parse');

module.exports = (url) => {
  const data = parse(url, true);
  const challenge = data.pathname.replace(/\/challenges\//, '').replace(/[^a-zA-Z0-9_ ]/, '');
  const solution = data.query.solution.replace(/fccss/, '<script>').replace(/fcces/, '</script>');
  return {
      challenge,
      solution
  };
}