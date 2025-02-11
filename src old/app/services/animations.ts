import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const slideInOutFromLeft =
  trigger('slideInOutFromLeft', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)' }),
      animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
    ])
  ]);

  export const fadeIn =
  trigger('fadeIn', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({ opacity: 0 }),
      animate(500, style({ opacity: 1 }))
    ])
  ]);