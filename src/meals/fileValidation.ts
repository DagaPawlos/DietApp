import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

const MB = 1000000;

export const fileValidation = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 5 * MB }),
    new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
  ],
});
