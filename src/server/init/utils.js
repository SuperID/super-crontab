/**
 * utils
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

export default function (done) {

  $.utils.MissingParameterError = $.utils.customError('MissingParameterError', {code: 'missing_parameter'});
  $.utils.InvalidParameterError = $.utils.customError('InvalidParameterError', {code: 'invalid_parameter'});

  $.utils.UserAlreadyExistsError = $.utils.customError('UserAlreadyExistsError', {code: 'user_already_exists'});
  $.utils.UserDoesNotExistsError = $.utils.customError('UserDoesNotExistsError', {code: 'user_does_not_exists'});
  $.utils.UserNoPasswordError = $.utils.customError('UserNoPasswordError', {code: 'user_no_password'});
  $.utils.UserNotLoginError = $.utils.customError('UserNotLoginError', {code: 'user_not_login'});
  $.utils.PermissionDeniedError = $.utils.customError('PermissionDeniedError', {code: 'permission_denied'});

  $.utils.die = function (msg, code) {
    console.log(msg);
    process.exit(code);
  };

  done();

};