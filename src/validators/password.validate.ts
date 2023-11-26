import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import * as passwordValidator from "password-validator";

const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

@ValidatorConstraint({ name: "CheckPassword", async: false })
export class PasswordValidator implements ValidatorConstraintInterface {
  response = "";

  validate(password: string) {
    const result = passwordSchema.validate(password, { details: true });

    if (result && Array.isArray(result) && result.length != 0) {
      this.response = result[0].message;
      return false;
    }

    return true;
  }

  defaultMessage() {
    return `Password: ${this.response}`;
  }
}
