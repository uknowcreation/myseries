	// Constants
  const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const PASSWORD_REGEX  = /^(?=.*\d).{4,10}$/;

module.exports = {
  generateMailRegex: function(userMail) {
    return (EMAIL_REGEX);
  },
  generatePasswordRegex: function(password) {
    return (PASSWORD_REGEX);
  }
}