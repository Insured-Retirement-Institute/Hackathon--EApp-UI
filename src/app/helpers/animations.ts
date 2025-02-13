import { animate, group, query, style, transition, trigger } from '@angular/animations';
export const transitionFadeIn = trigger('transitionFadeIn', [
    transition('* <=> *', [ // This runs on every route transition
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
    ])
]);
export const slideInOutFromRight =
    trigger('slideInOutFromRight', [
        transition(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
        ])
    ]);

export const fadeIn =
    trigger('fadeIn', [
        transition(':enter', [   // :enter is alias to 'void => *'
            style({ opacity: 0 }),
            animate(500, style({ opacity: 1 }))
        ])
    ]);

export const fadeInOut =
    trigger('fadeInOut', [
        transition(':enter', [   // :enter is alias to 'void => *'
            style({ opacity: 0 }),
            animate(500, style({ opacity: 1 }))
        ]),
        transition(':leave', [   // :leave is alias to '* => void'
            animate(500, style({ opacity: 0 }))
        ])
    ]);

export const slideInOut =
    trigger('slideInOut', [
        transition(':enter', [
            style({ transform: 'translateY(-100%)' }),
            animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
        ])
    ]);

export const routerTransition = trigger('routerTransition', [
    transition('* <=> *', [
    /* order */
    /* 1 */ query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
    /* 2 */ group(
        [  // block executes in parallel
            query(':enter', [
                style({ opacity: 0 }),
                animate('0.5s ease-in-out', style({ opacity: 1 }))
            ], { optional: true }),
        ]
    )
    ])
]);
