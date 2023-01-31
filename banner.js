import * as PACKAGE from './package.json' assert { type: 'json' };

export const myBanner = `
/**
 * Version ${PACKAGE.version} | Licensed under the ${PACKAGE.license} license
 *  _
 * |_) _  |   _   _   _   _|  _  __  _|_  _
 * |  (_) |< (/_ | | (_) (_| (/_      |_ _>
 *
 * ${PACKAGE.description}
 * ${PACKAGE.author.name} <${PACKAGE.author.url}>
 */
`;
