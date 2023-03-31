const passwordValidator = require('password-validator')
const passwordSchema = new passwordValidator()
// le schema que doit respecter le mdp 
passwordSchema
.is().min(5)                                    // Minimum length   5
.is().max(30)                                  // Maximum length 30
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', '<script>','</script>']); // Blacklist these values

module.exports = passwordSchema;
