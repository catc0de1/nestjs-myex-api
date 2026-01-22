import helmet from 'helmet';

export function HelmetConfig() {
  return helmet({
    contentSecurityPolicy: false,

    // pure API = no client
    // contentSecurityPolicy: {
    //   directives: {
    //     defaultSrc: ["'self'"],
    //     scriptSrc: ["'self'"],
    //     styleSrc: ["'self'"],
    //     imgSrc: ["'self'", 'data:'],
    //     frameSrc: ["'self'"],
    //     objectSrc: ["'none'"],
    //     baseUri: ["'self'"],
    //     upgradeInsecureRequests: [],
    //   },
    // },

    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    referrerPolicy: { policy: 'no-referrer' },
    noSniff: true,
    xssFilter: false,
  });
}
