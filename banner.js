import { author, version, license, description } from './package.json';

export const myBanner = `
/**
 * Version ${version} | ${new Date().toLocaleDateString('en-us')}
 * Build with Node ${process.version}
 * Licensed under the ${license} license
 *  _
 * |_) _  |   _   _   _   _|  _  __  _|_  _
 * |  (_) |< (/_ | | (_) (_| (/_      |_ _>
 *
 * ${description}
 * ${author.name} <${author.url}>
 */
`;
