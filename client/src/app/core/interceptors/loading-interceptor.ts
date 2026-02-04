import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { BusyService } from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  // Show the loading indicator immediately
  busyService.busy();

  return next(req).pipe(
    // Remove the artificial delay
    finalize(() => busyService.idle())
  );
};
