import helmet from 'helmet';

export function HelmetConfig() {
  return helmet({
    // pdf frame handler
    // contentSecurityPolicy: {
    //   directives: {
    //     defaultSrc: ["'self'"],
    //     frameSrc: ["'self'", 'blob:'],
    //   },
    // },
  });
}
