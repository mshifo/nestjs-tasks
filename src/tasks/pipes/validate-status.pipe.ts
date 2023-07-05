import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class ValidateStatusPipe implements PipeTransform {
  readonly validStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isValidStatus(value)) {
      throw new BadRequestException(`${value} is not valid status`);
    }
    return value;
  }

  isValidStatus(status: any) {
    const idx = this.validStatuses.indexOf(status);
    return idx !== -1;
  }
}
