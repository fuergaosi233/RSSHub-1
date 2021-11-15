import got from '~/utils/got.js';
import cheerio from 'cheerio';

export default async (ctx) => {
    const rootUrl = 'https://www.cgtn.com/';
    const response = await got({
        method: 'get',
        url: rootUrl,
    });

    const $ = cheerio.load(response.data);
    const list = $('div.topNews-item')
        .map((_, item) => {
            item = $(item);
            const a = item.find('div.topNews-item-content-title a');
            return {
                title: a.text(),
                link: a.attr('href'),
                pubDate: new Date(parseInt(a.attr('data-time'))).toUTCString(),
            };
        })
        .get();

    const items = await Promise.all(
        list.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const detailResponse = await got({
                    method: 'get',
                    url: item.link,
                });
                const content = cheerio.load(detailResponse.data);

                item.description = content('#cmsMainContent').html();

                return item;
            })
        )
    );

    ctx.state.data = {
        title: 'CGTN - Top News',
        link: rootUrl,
        item: items,
    };
};