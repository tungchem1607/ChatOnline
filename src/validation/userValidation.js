import { check } from 'express-validator';
import { transValidation } from './../../lang/vi'
let updateInfo = [
    check('username', transValidation.update_username)
    .optional()
    .isLength({ min:5, max:17})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
  check("gender", transValidation.update_gender)
    .optional()
    .isIn([ "male", "female" ]),
  check("address", transValidation.update_address)
    .optional()
    .isLength({ min: 3, max: 100 }),
  check("phone", transValidation.update_phone)
    .optional()
    .matches(/^(0)[0-9]{9,10}$/)

];
module.exports = {
  updateInfo
};