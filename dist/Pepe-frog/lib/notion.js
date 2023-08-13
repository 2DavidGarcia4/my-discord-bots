"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSnackData = void 0;
const client_1 = require("@notionhq/client");
const config_1 = require("../../config");
const NotionClient = new client_1.Client({ auth: config_1.notionToken });
const snackDbId = '722ba61dd6f34f13b7c057e3fe27186b';
let snackDataMock;
let saveTime = 0;
async function getSnackData() {
    const nowTime = Date.now();
    if (saveTime + (10 * 60 * 60000) < nowTime) {
        const { results } = await NotionClient.databases.query({
            database_id: snackDbId,
            filter: {
                property: 'type',
                select: {
                    equals: 'snack_hot'
                }
            }
        });
        const firstResult = results.map((m) => m.properties.data)[0];
        let text = firstResult.rich_text[0].plain_text;
        text = text.split(/ +/g).join('').replaceAll('\n', '').replaceAll('{', '{"').replaceAll('}', '"}')
            .replaceAll(':', '":"').replaceAll(',', '","').replaceAll('}",', '},').replaceAll(':"{', ':{').replaceAll('}"}', '}}');
        snackDataMock = JSON.parse(text);
    }
    return snackDataMock;
}
exports.getSnackData = getSnackData;
